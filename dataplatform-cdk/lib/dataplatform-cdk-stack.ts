import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ksm from "aws-cdk-lib/aws-kms";
import * as path from "path";

import * as glue from "aws-cdk-lib/aws-glue";
import * as sqs from 'aws-cdk-lib/aws-sqs';

interface DataplatformStackProps extends StackProps {
  orgIds: string[]
}

export class DataplatformCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: DataplatformStackProps) {
    super(scope, id, props);
    const env = this.node.tryGetContext("ENV");


    const lowLevelBuckets: {[key:string]: s3.Bucket} = {};
    const level4Buckets: {[key:string]: s3.Bucket} = {};
    const ingestionDeadLetterQueue = new sqs.Queue(this, "kompetanse-ingestion-deadLetterQueue", {
      fifo: true,
      contentBasedDeduplication: true,
    })
    const ingestionQueue = new sqs.Queue(this, "kompetanse-ingestion-queue", {
      visibilityTimeout: Duration.seconds(200),
      contentBasedDeduplication: true,
      deadLetterQueue: {queue: ingestionDeadLetterQueue, maxReceiveCount: 1},
    });
    
    const orgIds = props?.orgIds; // ["knowitobejctnet", "knowitstavanger", "knowitquality", "knowitamende", "knowitexposlo", "knowitexpbergen"]
    if (orgIds) orgIds.forEach(orgId => {
      const orgLowKey = new ksm.Key(this, `${orgId}-low-key`);
      const orgL4Key = new ksm.Key(this, `${orgId}-l4-key`);

      const lowerLevelBucket = new s3.Bucket(this, `kompetanse-${orgId}-level-1-2-3`, {
        encryption: s3.BucketEncryption.KMS_MANAGED,
        encryptionKey: orgLowKey,
      });
      lowLevelBuckets[orgId] = lowerLevelBucket;

      lowerLevelBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SqsDestination(ingestionQueue));

      const l4Bucket = new s3.Bucket(this, `kompetanse-${orgId}-level-4`, {
        encryption: s3.BucketEncryption.KMS_MANAGED,
        encryptionKey: orgL4Key
      });
      level4Buckets[orgId] = l4Bucket;
      l4Bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.SqsDestination(ingestionQueue));
    });

    const bucketNames = {
      "LowLevelBucketMap": JSON.stringify(lowLevelBuckets), 
      "L4BucketMap": JSON.stringify(level4Buckets), 
    };
    
    const ingestorLambda = new lambda.Function(this, "kompetanse-ingestor", {
      code: lambda.Code.fromAsset(path.join(__dirname, "../functions/ingestor")),
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: "ingestor.handler",
      environment: {
        ...bucketNames,
        queueName: ingestionQueue.queueName,
        SOURCE_NAME: "KompetanseStack",
        ENV: env
      },
      timeout: Duration.seconds(25)
    });

    const processingLambda = new lambda.Function(this, "kompetanse-processor", {
      code: lambda.Code.fromAsset(path.join(__dirname, "../functions/processor")),
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: "index.handler",
      environment: {
        ...bucketNames,
        SOURCE_NAME: "KompetanseStack",
        ENV: env
      },
      timeout: Duration.seconds(25)
    });

  }
}
