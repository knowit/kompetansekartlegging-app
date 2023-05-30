import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class KompetanseFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    console.log('DEPLOYMENT_ENV 👉', process.env.DEPLOYMENT_ENV);

    const websiteBucket = new s3.Bucket(this, 'KompetanseHostingBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      }
    });

    const s3Origin = new origins.S3Origin(websiteBucket);
    const distribution = new cloudfront.Distribution(this, 'KompetanseFrontendDistribution', {
      defaultBehavior: { origin:  s3Origin, viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS},
      defaultRootObject: "index.html",
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100 // Europe and NA only
    });

    new s3deploy.BucketDeployment(this, 'KompetansekartleggingFrontendBucketDeploy', {
      sources: [s3deploy.Source.asset('../frontend/build')],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    const deployUser = new iam.User(this, 'deploy_website');
    websiteBucket.grantWrite(deployUser);
  }
}