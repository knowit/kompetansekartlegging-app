import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cam from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as python from "@aws-cdk/aws-lambda-python-alpha";
import * as iam from 'aws-cdk-lib/aws-iam';
import * as backup from 'aws-cdk-lib/aws-backup';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as gateway from 'aws-cdk-lib/aws-apigateway';
// import { CfnUserPoolIdentityProvider } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import * as path from "path";
import { AppSyncTransformer } from 'cdk-appsync-transformer';
import { Environment } from '@aws-sdk/client-lambda';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs'

export class DatatransformStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const ENV = this.node.tryGetContext("ENV");
    const transformedDataBucket = new s3.Bucket(this, "transformedDataBucket", {});

    const transformDataPolicyStatment = new iam.PolicyStatement({
        actions: ["s3:*"],
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:s3:::*', transformedDataBucket.bucketArn, `${transformedDataBucket.bucketArn}/*`]
      });

    /*const pandasLayer = new lambda.LayerVersion(this, "panda-layer", {
        compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
        code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/packages/pandas/pandas.zip")),
        description: 'Uses the 3rd party library pandas'
    });*/

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
      new iam.Policy(this, 'list-buckets-policy', {
        statements: [transformDataPolicyStatment],
      }),
    );

  }
}
