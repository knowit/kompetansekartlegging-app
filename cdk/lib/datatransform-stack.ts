import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from "path";
import * as rds from 'aws-cdk-lib/aws-rds';
// import * as sqs from 'aws-cdk-lib/aws-sqs'

export class DatatransformStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const ENV = this.node.tryGetContext("ENV");


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
    const account  = props?.env?.account;
    const region = props?.env?.region;
    const auroraArn = `arn:aws:rds:${region}:${account}:cluster:${auroraCluster.clusterArn}`;

    const deploymentStage = "aurora-cluster-id-dev";
      
    new CfnOutput(this, 'AuroraClusterArn', {
      exportName: `${deploymentStage}`,
      value: auroraArn
    });


    ///START
    const transformedDataBucket = new s3.Bucket(this, "transformedDataBucket", {});

    const transformDataPolicyStatment = new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:s3:::*', transformedDataBucket.bucketArn, `${transformedDataBucket.bucketArn}/*`]
      });

    const pandasLayer = lambda.LayerVersion.fromLayerVersionAttributes(this, "PandasLayer", {
        layerVersionArn:"arn:aws:lambda:eu-central-1:770693421928:layer:Klayers-p39-pandas:6"
    })


    // 👇 define the Lambda
    const transformDataFunction = new lambda.Function(this, "TransformData", {
        code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/transformData")),
        functionName: "TransformData",
        handler: "index.handler",
        runtime: lambda.Runtime.PYTHON_3_9,
        environment:  {
            ENV:ENV,
            TRANSFORMED_DATA_BUCKET: transformedDataBucket.bucketName
        },
        timeout: Duration.seconds(25),
        layers: [pandasLayer]
      });
      
    // 👇 add the policy to the Function's role
    transformDataFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'transform-data-buckets-policy', {
        statements: [transformDataPolicyStatment],
      }),
    );

    const insertDataFunction = new lambda.Function(this, "InsertData", {
      code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/insertData")),
      functionName: "InsertData",
      handler: "index.handler",
      runtime: lambda.Runtime.PYTHON_3_9,
      environment : {
        ENV:ENV,
        TRANSFORMED_DATA_BUCKET: transformedDataBucket.bucketName,
        DATABASE_ARN: auroraCluster.clusterArn,
        SECRET_ARN: auroraCluster.secret?.secretArn || "",
        DATABASE_NAME: "auroraTestDB",
      },
      timeout: Duration.seconds(25),
      layers: [pandasLayer]
    })

    const insertDataPolicyStatment = new iam.PolicyStatement({
      actions: ["s3:*", "rds:*"],
      effect: iam.Effect.ALLOW,
      resources: ['arn:aws:s3:::*', transformedDataBucket.bucketArn, `${transformedDataBucket.bucketArn}/*`]
    });

    insertDataFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'insert-data-buckets-policy', {
        statements: [insertDataPolicyStatment],
      }),
    )

    auroraCluster.grantDataApiAccess(insertDataFunction)


  }
}
