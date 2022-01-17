#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OidcCdkStack } from '../lib/oidc-cdk-stack';

const app = new cdk.App();
new OidcCdkStack(app, 'OidcCdkStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  stackName: 'gh-oidc-stack',
  terminationProtection: false,
  childAccounts: [{
    accountId: process.env.CDK_DEFAULT_ACCOUNT!,
    region: 'us-west-1',
  }],
  policy_name: '000',
});