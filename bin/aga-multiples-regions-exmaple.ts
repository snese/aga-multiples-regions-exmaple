#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { SampleFargateStack, SampleAgaStack } from '../lib/aga-multiples-regions-exmaple-stack';

const app = new cdk.App();

const envEU  = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' };
const envUS = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-west-2' };

// AGA in US
const aga = new SampleAgaStack(app, 'aga-us', { env: envUS })

// fargate in US
const fargateUs = new SampleFargateStack(app, 'app-us', { env: envUS });
// fargate in EU
const fargateEu = new SampleFargateStack(app, 'app-eu', { env: envEU });

const fargateEuAlbDnsName = cdk.Stack.of(aga).node.tryGetContext('eu_endpoint')

// add US ALB to the US endpoint group
aga.endpointGroupUS.addLoadBalancer('alb-us', fargateUs.loadBalancer);

// add EU ALB to the EU endpoint group
if(fargateEuAlbDnsName){
  aga.endpointGroupEU.addEndpoint('alb-eu', fargateEuAlbDnsName);
}
