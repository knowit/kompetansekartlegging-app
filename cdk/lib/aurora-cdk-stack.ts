import { CfnOutput, Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from "path";

export class AuroraStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const auroraCluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
        engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
        credentials: { username: 'clusteradmin' },
        clusterIdentifier: 'aurora-cluster',
        defaultDatabaseName: 'auroraTestDB',
        enableDataApi: true,
        scaling: {
            autoPause: Duration.minutes(10), // default is to pause after 5 minutes of idle time
            minCapacity: rds.AuroraCapacityUnit.ACU_2, // default is 2 Aurora capacity units (ACUs)
            maxCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 16 Aurora capacity units (ACUs)
        }
    });

  
    const initDbLambda = new lambda.Function(this, "KompetanseAuroraInitDb", {
        code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/initDb")),
        functionName: "KompetanseAuroraInitDb",
        handler: "index.handler",
        runtime: lambda.Runtime.PYTHON_3_9,
        timeout: Duration.seconds(25),
        environment: { 
            DATABASE_ARN: auroraCluster.clusterArn,
            SECRET_ARN: auroraCluster.secret?.secretArn || "",
            DATABASE_NAME: "auroraTestDB",
        },
    });
    auroraCluster.grantDataApiAccess(initDbLambda);

      
    // construct arn from available information
    const account  = props.env?.account;
    const region = props.env?.region;
    const auroraArn = `arn:aws:rds:${region}:${account}:cluster:${auroraCluster.clusterArn}`;

    const deploymentStage = "aurora-cluster-id-dev";
     
    new CfnOutput(this, 'AuroraClusterArn', {
      exportName: `${deploymentStage}`,
      value: auroraArn
    }); 
  }
}