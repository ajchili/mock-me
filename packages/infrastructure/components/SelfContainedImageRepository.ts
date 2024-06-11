import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";

interface SelfContainedImageRepositoryOptions
  extends pulumi.ComponentResourceOptions {
  image: {
    name: string;
  } & Pick<docker.types.input.DockerBuild, "context" | "dockerfile">;
}

// TODO: Think about this name. I am not sure that I like it.
export class SelfContainedImageRepository extends pulumi.ComponentResource {
  public image: docker.Image;

  constructor(name: string, options: SelfContainedImageRepositoryOptions) {
    super("mock-me:SelfContainedImageRepository", name, {}, options);

    const repository = new aws.ecr.Repository(
      `${name}-repository`,
      {
        name: `mock-me/${options.image.name}`,
      },
      { parent: this }
    );
    const authToken = aws.ecr.getAuthorizationTokenOutput(
      {
        registryId: repository.registryId,
      },
      { parent: this }
    );

    this.image = new docker.Image(
      `${name}-image`,
      {
        build: {
          args: {
            BUILDKIT_INLINE_CACHE: "1",
          },
          cacheFrom: {
            images: [pulumi.interpolate`${repository.repositoryUrl}:latest`],
          },
          context: options.image.context || `../${options.image.name}`,
          dockerfile:
            options.image.dockerfile || `../${options.image.name}/Dockerfile`,
          platform: "linux/arm64",
        },
        imageName: pulumi.interpolate`${repository.repositoryUrl}:latest`,
        registry: {
          username: pulumi.secret(
            authToken.apply((authToken) => authToken.userName)
          ),
          password: pulumi.secret(
            authToken.apply((authToken) => authToken.password)
          ),
          server: repository.repositoryUrl,
        },
      },
      { parent: this }
    );
  }
}
