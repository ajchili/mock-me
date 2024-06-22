import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as docker from "@pulumi/docker";
import * as dockerBuild from "@pulumi/docker-build";

interface SelfContainedImageRepositoryOptions
  extends pulumi.ComponentResourceOptions {
  image?: Pick<docker.types.input.DockerBuild, "context" | "dockerfile">;
}

// TODO: Think about this name. I am not sure that I like it.
export class SelfContainedImageRepository extends pulumi.ComponentResource {
  public repository: aws.ecr.Repository;
  public image: dockerBuild.Image;

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

    this.image = new dockerBuild.Image(
      `${name}-image`,
      {
        tags: [pulumi.interpolate`${this.repository.repositoryUrl}:latest`],
        context: {
          location: `../${name}`,
          named: {
            root: { location: "../../" },
          },
        },
        cacheFrom: [
          {
            registry: {
              ref: pulumi.interpolate`${this.repository.repositoryUrl}:latest`,
            },
          },
        ],
        platforms: [dockerBuild.Platform.Linux_amd64],
        push: true,
        registries: [
          {
            address: this.repository.repositoryUrl,
            username: pulumi.secret(
              authToken.apply((authToken) => authToken.userName)
            ),
            password: pulumi.secret(
              authToken.apply((authToken) => authToken.password)
            ),
          },
        ],
      },
      { parent: this }
    );
  }
}
