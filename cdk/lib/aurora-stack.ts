import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as rds from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'
import * as path from 'path'

export class AuroraStack extends Stack {
  public readonly auroraCluster: rds.ServerlessCluster
  public readonly defaultDatabaseName: string

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)
    const ENV = this.node.tryGetContext('ENV')

    // Split to remove - from db-name
    this.defaultDatabaseName = `kompetanseDB${ENV.split('-').join('')}`
    this.auroraCluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_11_16,
      }),
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(
        this,
        'ParameterGroup',
        'default.aurora-postgresql11'
      ),
      credentials: { username: 'clusteradmin' },
      clusterIdentifier: `aurora-cluster-${ENV}`,
      defaultDatabaseName: this.defaultDatabaseName,
      enableDataApi: true,
      scaling: {
        autoPause: Duration.minutes(10), // default is to pause after 5 minutes of idle time
        minCapacity: rds.AuroraCapacityUnit.ACU_2, // default is 2 Aurora capacity units (ACUs)
        maxCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 16 Aurora capacity units (ACUs)
      },
    })

    const initializeDB = new lambda.Function(this, 'KompetanseAuroraInitDb', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '/../backend/function/initDb')
      ),
      functionName: `KompetanseAuroraInitDb-${ENV}`,
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: Duration.seconds(60),
      memorySize: 512,
      environment: {
        DATABASE_ARN: this.auroraCluster.clusterArn,
        SECRET_ARN: this.auroraCluster.secret!.secretArn,
        DATABASE_NAME: this.defaultDatabaseName,
      },
    })
    this.auroraCluster.grantDataApiAccess(initializeDB)

    // Outputs

    new CfnOutput(this, 'AuroraClusterArn', {
      value: this.auroraCluster.clusterArn,
    })

    new CfnOutput(this, 'AuroraSecretArn', {
      value: this.auroraCluster.secret!.secretArn,
    })

    new CfnOutput(this, 'initDbFunctionName', {
      value: initializeDB.functionName,
    })
  }
}
