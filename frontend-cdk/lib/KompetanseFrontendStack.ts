import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { KompetanseFrontendDistributionAndCertsStack } from './KompetanseFrontendDistributionAndCertsStack';

export class KompetanseFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log('DEPLOYMENT_ENV 👉', process.env.DEPLOYMENT_ENV);

    const websiteBucket = new s3.Bucket(this, 'KompetanseHostingBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });

    const distribution = new cloudfront.Distribution(this, 'KompetanseFrontendDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
    });

    new s3deploy.BucketDeployment(this, 'KompetansekartleggingFrontendBucketDeploy', {
      sources: [s3deploy.Source.asset('../build')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    const deployUser = new iam.User(this, 'deploy_website');
    websiteBucket.grantWrite(deployUser);

    switch(process.env.DEPLOYMENT_ENV) { 
      case 'dev': { 
          new KompetanseFrontendDistributionAndCertsStack('dev.kompetanse.knowit.no', websiteBucket, this);
          break; 
      } 
      case 'prod': { 
        new KompetanseFrontendDistributionAndCertsStack('kompetanse.knowit.no', websiteBucket, this);
        break; 
      } 
   } 
  }
}