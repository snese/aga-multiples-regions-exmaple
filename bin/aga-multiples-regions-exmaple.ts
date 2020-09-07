#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleFargateStack } from '../lib/aga-multiples-regions-exmaple-stack';

const app = new cdk.App();

const envEU  = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' };
const envUS = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-west-2' };

new SampleFargateStack(app, 'app-us', {env: envUS });
new SampleFargateStack(app, 'app-eu', {env: envEU });
