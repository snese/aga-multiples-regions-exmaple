#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleFargateStack, SampleAgaStack } from '../lib/aga-multiples-regions-exmaple-stack';
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import { Stack } from '@aws-cdk/core';

const app = new cdk.App();

const envEU  = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'eu-west-1' };
const envUS = { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-west-2' };

const app_us = new SampleFargateStack(app, 'hc-app-us', {env: envUS });
const app_eu = new SampleFargateStack(app, 'hc-app-eu', {env: envEU });

// let ids = [app_us.name, app_eu.name];
// let loadBalancers = [app_us.loadBalancer.loadBalancerArn.toString(), app_eu.loadBalancer.loadBalancerArn.toString()];

// let ids = [app_us.name, app_eu.name];
// let loadBalancers = [app_us.loadBalancer.loadBalancerArn.toString(), app_eu.loadBalancer.loadBalancerArn.toString()];

// // let ids = [app_eu.stackName];
// // let loadBalancers = [app_eu.loadBalancer];

// new SampleAgaStack(app, 'aga-demo', {
//     id: ids,
//     loadBalancer: loadBalancers,
// });

const aga_demo = new SampleAgaStack(app, 'hc-aga-demo', {env: envUS });
// aga_demo.endpointGroups.addLoadBalancer(app_us.name, app_us.loadBalancer);
aga_demo.endpointGroups.addLoadBalancer(app_eu.name, app_eu.loadBalancer);   c