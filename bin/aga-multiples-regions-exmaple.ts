#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AgaMultiplesRegionsExmapleStack } from '../lib/aga-multiples-regions-exmaple-stack';

const app = new cdk.App();
new AgaMultiplesRegionsExmapleStack(app, 'AgaMultiplesRegionsExmapleStack');
