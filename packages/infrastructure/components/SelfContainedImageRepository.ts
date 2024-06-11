import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";

interface SelfContainedImageRepositoryOptions
  extends pulumi.ComponentResourceOptions {
  image?: Pick<docker.types.input.DockerBuild, "context" | "dockerfile">;
}

// TODO: Think about this name. I am not sure that I like it.
export class SelfContainedImageRepository extends pulumi.ComponentResource {
  public repository: aws.ecr.Repository;
  public image: docker.Image;

  constructor(name: string, options: SelfContainedImageRepositoryOptions = {}) {
    super("mock-me:SelfContainedImageRepository", name, {}, options);

    this.repository = new aws.ecr.Repository(
      `${name}-repository`,
      {
        name: `mock-me/${name}`,
        forceDelete: true,
      },
      { parent: this }
    );
    const authToken = aws.ecr.getAuthorizationTokenOutput(
      {
        registryId: this.repository.registryId,
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
            images: [
              pulumi.interpolate`${this.repository.repositoryUrl}:latest`,
            ],
          },
          context: options.image?.context || `../${name}`,
          dockerfile: options.image?.dockerfile,
          platform: "Linux/X86_64",
        },
        imageName: pulumi.interpolate`${this.repository.repositoryUrl}:latest`,
        registry: {
          username: pulumi.secret(
            authToken.apply((authToken) => authToken.userName)
          ),
          password: pulumi.secret(
            authToken.apply((authToken) => authToken.password)
          ),
          server: this.repository.repositoryUrl,
        },
      },
      { parent: this }
    );
  }
}
