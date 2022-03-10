import { Stack } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class KompetanseFrontendDistributionAndCertsStack {
  constructor(domainname: string, websiteBucket: s3.Bucket , stack: Stack) {

    const hostedZone = new r53.HostedZone(stack, "KompetanseHostedZone", {
        zoneName: domainname
    });

    const cert = new Certificate(stack, "kompetansecert", {
        domainName: domainname,
        validation: CertificateValidation.fromDns(hostedZone)
    });

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(stack, "KompetanseCloudFront", {
      originConfigs: [{
            behaviors: [{isDefaultBehavior: true}],
            s3OriginSource: {s3BucketSource:websiteBucket}
        }],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(cert, {
            aliases: [domainname]
        })
    });
  }
}