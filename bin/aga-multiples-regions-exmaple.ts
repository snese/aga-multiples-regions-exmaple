#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleFargateStack, SampleAgaStack } from '../lib/aga-multiples-regions-exmaple-stack';

const app = new cdk.App();

const envEU  = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' };
const envUS = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-west-2' };


// fargate in US
const fargateUs = new SampleFargateStack(app, 'app-us', {env: envUS });
// fargate in EU
const fargateEu = new SampleFargateStack(app, 'app-eu', { env: envEU });


// AGA in US
new SampleAgaStack(app, 'aga-us', {
  env: envUS,
  loadBalancer: fargateUs.loadBalancer,
})


// AGA in EU
new SampleAgaStack(app, 'aga-eu', {
  env: envEU,
  loadBalancer: fargateEu.loadBalancer,
})
