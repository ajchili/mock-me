import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { SelfContainedImageRepository } from "./SelfContainedImageRepository";

export class App extends pulumi.ComponentResource {
  public service: awsx.ecs.FargateService;
  public assetBalancer: awsx.lb.ApplicationLoadBalancer;

  constructor(name: string) {
    super("mock-me:App", name, {}, {});
    const assetImageRepository = new SelfContainedImageRepository("asset", {
      parent: this,
    });
    const serverImageRepository = new SelfContainedImageRepository("server", {
      parent: this,
    });

    const cluster = new aws.ecs.Cluster(
      "cluster",
      {
        name: "mock-me",
      },
      { parent: this }
    );

    this.assetBalancer = new awsx.lb.ApplicationLoadBalancer(
      "asset-loadbalancer",
      {},
      { parent: this }
    );
    const serverLoadbalancer = new awsx.lb.ApplicationLoadBalancer(
      "server-loadbalancer",
      { defaultTargetGroupPort: 6969 },
      { parent: this }
    );

    this.service = new awsx.ecs.FargateService(
      "service",
      {
        cluster: cluster.arn,
        assignPublicIp: true,
        desiredCount: 1,
        taskDefinitionArgs: {
          containers: {
            asset: {
              name: "asset",
              image: assetImageRepository.image.repoDigest,
              cpu: 1,
              memory: 512,
              essential: true,
              environment: [
                {
                  name: "endpoint",
                  value: pulumi.interpolate`http://${serverLoadbalancer.loadBalancer.dnsName}`,
                },
              ],
              portMappings: [
                {
                  containerPort: 80,
                  hostPort: 80,
                  targetGroup: this.assetBalancer.defaultTargetGroup,
                },
              ],
            },
            server: {
              name: "server",
              image: serverImageRepository.image.repoDigest,
              cpu: 1,
              memory: 512,
              essential: true,
              portMappings: [
                {
                  containerPort: 6969,
                  hostPort: 6969,
                  targetGroup: serverLoadbalancer.defaultTargetGroup,
                },
              ],
            },
          },
        },
      },
      { parent: this }
    );
  }
}
