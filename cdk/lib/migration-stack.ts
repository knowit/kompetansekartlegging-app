import { Duration, Stack, StackProps } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { Construct } from 'constructs'
import * as path from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

interface MigrationStackProps extends StackProps {
  cluster: rds.ServerlessCluster
  databaseName: string
  userPoolId: string
}

export class MigrationStack extends Stack {
  constructor(scope: Construct, id: string, props: MigrationStackProps) {
    super(scope, id, props)
    const tableArns: any = {}
    const ENV = this.node.tryGetContext('ENV')
    const exportToDataBucket = new s3.Bucket(this, 'exportToDataBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    })

    const transformedDataBucket = new s3.Bucket(
      this,
      'transformedDataBucket',
      {}
    )

    const pandasLayer = lambda.LayerVersion.fromLayerVersionAttributes(
      this,
      'PandasLayer',
      {
        layerVersionArn:
          'arn:aws:lambda:eu-central-1:770693421928:layer:Klayers-p39-pandas:6',
      }
    )

    // Fetch aurora cluster
    const cluster: rds.ServerlessCluster = props.cluster

    const insertDataFunction = new lambda.Function(this, 'InsertData', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '/../backend/function/insertData')
      ),
      functionName: 'InsertData',
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      environment: {
        ENV: ENV,
        TRANSFORMED_DATA_BUCKET: transformedDataBucket.bucketName,
        DATABASE_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret!.secretArn,
        DATABASE_NAME: props.databaseName,
        SOURCE_NAME: 'KompetanseStack',
        USERPOOL: props.userPoolId,
      },
      timeout: Duration.seconds(25),
      layers: [pandasLayer],
      memorySize: 2048,
    })

    const insertDataPolicyStatment = new iam.PolicyStatement({
      actions: ['s3:*', 'rds:*', 'cognito-idp:AdminUpdateUserAttributes'],
      effect: iam.Effect.ALLOW,
      resources: [
        'arn:aws:s3:::*',
        'arn:aws:cognito-idp:*:*:userpool/*',
        transformedDataBucket.bucketArn,
        `${transformedDataBucket.bucketArn}/*`,
      ],
    })

    insertDataFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'insert-data-buckets-policy', {
        statements: [insertDataPolicyStatment],
      })
    )

    cluster.grantDataApiAccess(insertDataFunction)

    const transformDataPolicyStatment = new iam.PolicyStatement({
      actions: ['s3:*', 'lambda:InvokeFunction'],
      effect: iam.Effect.ALLOW,
      resources: [
        'arn:aws:s3:::*',
        'arn:aws:lambda:*',
        transformedDataBucket.bucketArn,
        `${transformedDataBucket.bucketArn}/*`,
      ],
    })

    // 👇 define the Lambda
    const transformDataFunction = new lambda.Function(this, 'TransformData', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '/../backend/function/transformData')
      ),
      functionName: 'TransformData',
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      environment: {
        ENV: ENV,
        TRANSFORMED_DATA_BUCKET: transformedDataBucket.bucketName,
        EXPORT_BUCKET: exportToDataBucket.bucketName,
        SOURCE_NAME: 'KompetanseStack',
        TRIGGER_FUNCTION: insertDataFunction.functionName,
      },
      timeout: Duration.seconds(25),
      layers: [pandasLayer],
      memorySize: 2048,
    })

    // 👇 add the policy to the Function's role
    transformDataFunction.role?.attachInlinePolicy(
      new iam.Policy(this, 'transform-data-buckets-policy', {
        statements: [transformDataPolicyStatment],
      })
    )

    //lambda function
    const exportDataLambda = new lambda.Function(this, 'ExportData', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, '/../backend/function/exportData')
      ),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
      timeout: Duration.seconds(25),
      environment: {
        ENV: ENV,
        SOURCE_NAME: 'KompetanseStack',
        EXPORT_TO_DATA_BUCKET: exportToDataBucket.bucketName,
        TRIGGER_FUNCTION: transformDataFunction.functionName,
      },
      memorySize: 2048,
    })

    exportDataLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:*', 'dynamodb:*', 'lambda:InvokeFunction'],
        resources: [
          'arn:aws:s3:::*',
          'arn:aws:dynamodb:*',
          'arn:aws:lambda:*',
          transformDataFunction.functionArn,
          `${transformDataFunction.functionArn}/*`,
        ],
      })
    )

    const lambdaTrigger = new AwsCustomResource(this, 'ExportDataTrigger', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: iam.Effect.ALLOW,
          resources: [exportDataLambda.functionArn],
        }),
      ]),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: exportDataLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of('ExportDataTriggerId'),
      },
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: exportDataLambda.functionName,
          InvocationType: 'event',
        },
        physicalResourceId: PhysicalResourceId.of('ExportDataTriggerId'),
      },
    })
  }
}
