import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

import { MultiTargetApplicationLoadBalancer } from "./MultiTargetApplicationLoadBalancer";
import { SelfContainedImageRepository } from "./SelfContainedImageRepository";

export class App extends pulumi.ComponentResource {
  public service: awsx.ecs.FargateService;
  public loadbalancer: aws.lb.LoadBalancer;

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

    const multiTargetLoadbalancer = new MultiTargetApplicationLoadBalancer("app-loadbalancer", {
      ports: [80, 6969],
      parent: this,
    });

    this.loadbalancer = multiTargetLoadbalancer.loadbalancer;

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
              image: assetImageRepository.image.ref,
              cpu: 1,
              memory: 512,
              essential: true,
              portMappings: [
                {
                  containerPort: 80,
                  hostPort: 80,
                  targetGroup: multiTargetLoadbalancer.targetGroups[80],
                },
              ],
            },
            server: {
              name: "server",
              image: serverImageRepository.image.ref,
              cpu: 1,
              memory: 512,
              essential: true,
              portMappings: [
                {
                  containerPort: 6969,
                  hostPort: 6969,
                  targetGroup: multiTargetLoadbalancer.targetGroups[6969],
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
