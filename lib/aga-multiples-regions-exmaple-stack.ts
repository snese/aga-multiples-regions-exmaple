import * as cdk from '@aws-cdk/core';
import globalaccelerator = require('@aws-cdk/aws-globalaccelerator');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

// class endpoints {
//   id: string;
//   loadBalancer: elbv2.IApplicationLoadBalancer;
// }

// export interface SampleAgaStackProps extends cdk.StackProps {
//   endpoints: endpoints;
// }

// array
export interface SampleAgaStackProps extends cdk.StackProps {
  id: Array<string>
  loadBalancer: Array<elbv2.ApplicationLoadBalancer>;
}

// export interface SampleAgaStackProps extends cdk.StackProps {
//   id: Array<string>
//   loadBalancer: Array<string>;
// }

// export interface SampleAgaStackProps extends cdk.StackProps {
//   id: string;
//   loadBalancer: elbv2.ApplicationLoadBalancer;
// }

export class SampleAgaStack extends cdk.Stack {
  public readonly endpointGroups: globalaccelerator.EndpointGroup;

  // constructor(scope: cdk.Construct, id: string, props?: SampleAgaStackProps) {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const accelerator = new globalaccelerator.Accelerator(this,"Accelerator")
    const listener = new globalaccelerator.Listener(this, 'Listener', {
      accelerator,
      portRanges: [
        {
          fromPort: 80,
          toPort: 80,
        }
      ],
    });

    // const endpointGroups = new globalaccelerator.EndpointGroup(this, "Group", {listener:listener})
    this.endpointGroups = new globalaccelerator.EndpointGroup(this, "Group", {listener:listener})

    // for (let i in props.id){

    //   endpointGroups.addLoadBalancer(props.id[i], props.loadBalancer[i]);
    // }
  }
}

export class SampleFargateStack extends cdk.Stack {
  public readonly name: string;
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC and Fargate Cluster
    // NOTE: Limit AZs to avoid reaching resource quotas
    const vpc = new ec2.Vpc(this, 'DemoVPC', { maxAzs: 3 });
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

    fartageApp.targetGroup.configureHealthCheck({
      path: "/",
    })

    this.name = id;
    this.loadBalancer = fartageApp.loadBalancer;
  }
} 