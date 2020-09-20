#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleFargateStack, SampleAgaStack } from '../lib/aga-multiples-regions-exmaple-stack';
import { StackOutputs } from 'cdk-remote-stack';

const app = new cdk.App();

const envEU  = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' };
const envUS = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-west-2' };

// AGA in US
const aga = new SampleAgaStack(app, 'aga-us', { env: envUS })

// fargate in US
const fargateUs = new SampleFargateStack(app, 'app-us', { env: envUS });

// fargate in EU
const fargateEu = new SampleFargateStack(app, 'app-eu', { env: envEU });

// add US ALB to the US endpoint group
aga.endpointGroupUS.addLoadBalancer('alb-us', fargateUs.loadBalancer);

// get the fargate EU stack outputs
const fargateEuOutputs = new StackOutputs(aga, 'FargateEuOutputs', {
  stack: fargateEu,
})

// get the fargate EU ALB LoadBalancer ARN
const fargateEuAlbArn = fargateEuOutputs.getAttString('LoadBalancerArn')
const fargateEuAlbDnsName = fargateEuOutputs.getAttString('ALBDnsName')


aga.endpointGroupEU.addEndpoint('alb-eu', fargateEuAlbArn);

new cdk.CfnOutput(aga, 'AlbDnsNameUS', { value: fargateUs.loadBalancer.loadBalancerDnsName })
new cdk.CfnOutput(aga, 'AlbDnsNameEU', { value: fargateEuAlbDnsName })