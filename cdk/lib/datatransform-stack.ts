import { CfnOutput, Duration, Stack, StackProps, Fn } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as path from "path";
import * as rds from 'aws-cdk-lib/aws-rds';
// import * as sqs from 'aws-cdk-lib/aws-sqs'

interface DatatransformStackProps extends StackProps {
  cluster: rds.ServerlessCluster;
}

export class DatatransformStack extends Stack {
  constructor(scope: Construct, id: string, props: DatatransformStackProps) {
    super(scope, id, props);
    const ENV = this.node.tryGetContext("ENV");

    const transformedDataBucket = new s3.Bucket(this, "transformedDataBucket", {});

    const transformDataPolicyStatment = new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:s3:::*', transformedDataBucket.bucketArn, `${transformedDataBucket.bucketArn}/*`]
      });

    const pandasLayer = lambda.LayerVersion.fromLayerVersionAttributes(this, "PandasLayer", {
        layerVersionArn:"arn:aws:lambda:eu-central-1:770693421928:layer:Klayers-p39-pandas:6"
    })

    // Fetch aurora cluster
    const cluster: rds.ServerlessCluster = props.cluster;

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
        DATABASE_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret!.secretArn,
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

    cluster.grantDataApiAccess(insertDataFunction);
  }
}
