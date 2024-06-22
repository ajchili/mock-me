import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export interface Options extends pulumi.ComponentResourceOptions {
  ports: number[];
}

export class MultiTargetApplicationLoadBalancer extends pulumi.ComponentResource {
  public loadbalancer: aws.lb.LoadBalancer;
  public targetGroups: Record<number, aws.lb.TargetGroup> = {};

  constructor(name: string, options: Options) {
    super("mock-me:MultiTargetApplicationLoadBalancer", name, {}, options);

    const defaultVpc = new aws.ec2.DefaultVpc(
      "default-vpc",
      {},
      { parent: this }
    );

    const securityGroup = new aws.ec2.SecurityGroup(
      "security-group",
      {
        ingress: options.ports.map((port) => ({
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: port,
          toPort: port,
          protocol: "tcp",
        })),
        egress: options.ports.map((port) => ({
          cidrBlocks: ["0.0.0.0/0"],
          fromPort: port,
          toPort: port,
          protocol: "tcp",
        })),
      },
      { parent: this }
    );

    this.loadbalancer = new aws.lb.LoadBalancer(
      "loadbalancer",
      {
        idleTimeout: 4000,
        loadBalancerType: "application",
        subnetMappings: aws.ec2
          .getSubnetsOutput(
            {
              filters: [{ name: "vpc-id", values: [defaultVpc.id] }],
            },
            { parent: this }
          )
          .ids.apply((subnetIds) => {
            return pulumi.all(subnetIds.map((subnetId) => ({ subnetId })));
          }),
        securityGroups: [securityGroup.id],
      },
      { parent: this }
    );

    for (const port of options.ports) {
      const targetGroup = new aws.lb.TargetGroup(
        `target-group-${port}`,
        {
          ipAddressType: "ipv4",
          port,
          deregistrationDelay: 30,
          protocol: "HTTP",
          protocolVersion: "HTTP1",
          targetType: "ip",
          vpcId: defaultVpc.id,
        },
        { parent: this }
      );

      new aws.lb.Listener(
        `listener-${port}`,
        {
          defaultActions: [
            { type: "forward", targetGroupArn: targetGroup.arn },
          ],
          loadBalancerArn: this.loadbalancer.arn,
          port,
        },
        { parent: this }
      );

      this.targetGroups[port] = targetGroup;
    }
  }
}
