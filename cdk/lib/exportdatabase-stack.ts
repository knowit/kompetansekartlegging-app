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
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { TaskStateBase } from 'aws-cdk-lib/aws-stepfunctions';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { CdkTransformer } from 'cdk-appsync-transformer/lib/transformer';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ExportDatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const tableArns: any = {}
    const ENV = this.node.tryGetContext("ENV");
    const exportToDataBucket = new s3.Bucket(this, "exportToDataBucket", {
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    //access 
    const exportDataPolicy = new iam.PolicyStatement({
        actions: [
          "s3:*",
          "dynamodb:Get*",
          "dynamodb:BatchGetItem",
          "dynamodb:List*",
          "dynamodb:Describe*",
          "dynamodb:Scan",
          "dynamodb:Query"
        ],
        effect: iam.Effect.ALLOW,
        resources: [
            "arn:aws:s3:::*",
            "arn:aws:dynamodb:*",
            exportToDataBucket.bucketArn,
            `${exportToDataBucket.bucketArn}/*`
        ]
      });

      //lambda function
      const exportDataLambda = new lambda.Function(this, "ExportData", {
        code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/exportData")),
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: "index.handler",
        timeout: Duration.seconds(25),
        environment:  {
            ENV:ENV,
            SOURCE_NAME: "KompetanseStack",
            EXPORT_TO_DATA_BUCKET:exportToDataBucket.bucketName
        },
        memorySize:2048
      });

      exportDataLambda.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [ 
            "s3:*",
            "dynamodb:*"
        ],
        resources: [ 
            "arn:aws:s3:::*",
            "arn:aws:dynamodb:*"
        ]
      }));   

      const lambdaTrigger = new AwsCustomResource(this, "ExportDataTrigger", {
        policy: AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          effect: iam.Effect.ALLOW,
          resources: [exportDataLambda.functionArn]

        })]),
        onCreate: {
          service: "Lambda",
          action: "invoke",
          parameters: {
            FunctionName: exportDataLambda.functionName,
            InvocationType: "Event"
          },
          physicalResourceId: PhysicalResourceId.of("ExportDataTriggerId")
        },
        onUpdate: {
          service: "Lambda",
          action: "invoke",
          parameters: {
            FunctionName: exportDataLambda.functionName,
            InvocationType: "event"
          },
          physicalResourceId: PhysicalResourceId.of("ExportDataTriggerId")
        } 
      })
  }
}