import { CfnStackSet, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as fs from 'fs'
import * as path from 'path'

type ac_data = {
  accountId: string,
  region: string,
}
export interface OidcCdkStackProps extends StackProps {
  childAccounts: ac_data[],
  policy_name: string
}
export class OidcCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: OidcCdkStackProps) {
    super(scope, id, props);
    
    const templateReplicationFile = path.resolve(__dirname, `../roles/${props?.policy_name}.yml`)
    const templateReplicationData = fs.readFileSync(templateReplicationFile).toString()
    new CfnStackSet(this, 'StackSet', {
      stackSetName: `github-oidc-replication`,
      permissionModel: "SELF_MANAGED",
      parameters: [
        {
          parameterKey: 'GitHubOrg',
          parameterValue: "harshit9715"
        },
        {
          parameterKey: 'OIDCProviderArn',
          parameterValue: ""
        }
      ],
      stackInstancesGroup: props?.childAccounts.map(i => ({
        regions: [i.region],
        deploymentTargets: {
          accounts: [i.accountId],
        },
      })),
      templateBody: templateReplicationData
    })
  }
}