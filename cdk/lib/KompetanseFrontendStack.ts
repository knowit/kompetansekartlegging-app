import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from "path";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class KompetanseFrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

//    const domainname = "kompetanse.knowit.no"

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


//    const hostedZone = new r53.HostedZone(this, "KompetanseHostedZone", {
//        zoneName: domainname
//    });

//    const cert = new Certificate(this, "kompetansecert", {
//        domainName: "kompetanse.knowit.no",
//        validation: CertificateValidation.fromDns(hostedZone)
//    });

//    const cloudFrontDistribution = new cfront.CloudFrontWebDistribution(this, "KompetanseCloudFront", {
//        originConfigs: [{
//            behaviors: [{isDefaultBehavior: true}],
//            s3OriginSource: {s3BucketSource:hostingBucket}
//        }],
//        viewerCertificate: cfront.ViewerCertificate.fromAcmCertificate(cert, {
//            aliases: [domainname]
//        })
//    });
  }
}