import * as cdk from '@aws-cdk/core';
import globalaccelerator = require('@aws-cdk/aws-globalaccelerator');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class SampleAgaStack extends cdk.Stack {
  readonly endpointGroupUS: globalaccelerator.EndpointGroup
  readonly endpointGroupEU: globalaccelerator.EndpointGroup
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accelerator = new globalaccelerator.Accelerator(this, 'Accelerator');
    const listener = new globalaccelerator.Listener(this, 'Listener', {
      accelerator,
      portRanges: [
        {
          fromPort: 80,
          toPort: 80,
        }
      ],
    });

    this.endpointGroupEU = new globalaccelerator.EndpointGroup(this, 'EndpointGroupEU', { 
      listener,
      region: 'eu-west-1',
    });

    this.endpointGroupUS = new globalaccelerator.EndpointGroup(this, 'EndpointGroupUS', {
      listener,
      region: 'us-west-2',
    });

  }
}

export class SampleFargateStack extends cdk.Stack {
  readonly loadBalancer: elbv2.IApplicationLoadBalancer;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.Vpc(this, 'DemoVPC', { maxAzs: 3, natGateways: 1 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // Instantiate Fargate Service with just cluster and image
    const fartageApp = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      publicLoadBalancer: true,
      memoryLimitMiB: 1024,
      desiredCount: 1,
      cpu: 512,
      taskImageOptions: {
       image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
      
    });

    this.loadBalancer = fartageApp.loadBalancer

    fartageApp.targetGroup.configureHealthCheck({
      path: "/",
    })

    new cdk.CfnOutput(this, 'ALBDnsName', { 
      value: fartageApp.loadBalancer.loadBalancerDnsName,
    })

    new cdk.CfnOutput(this, 'LoadBalancerArn', {
      value: fartageApp.loadBalancer.loadBalancerArn,
    })
  }
} 


