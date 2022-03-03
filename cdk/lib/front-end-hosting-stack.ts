import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from "path";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import * as cfront from "aws-cdk-lib/aws-cloudfront";

export class FrontEndStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps, hostedZoneProps?: {name: string, id: string}) {
        super(scope, id, props);
        const accountId = "";
        const domainname = "kompetasne.knowit.no"

        const hostingBucket = new s3.Bucket(this, "KompetanseHostingBucket");
        hostingBucket.grantPublicAccess();
        hostingBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions:["s3:GetObject"],
            effect: iam.Effect.ALLOW,
            resources: [hostingBucket.arnForObjects("*")]
        }));
        const deployFrontend = new s3deploy.BucketDeployment(this, "kompetansekartleggingFrontendBucketDeploy", {
            destinationBucket: hostingBucket,
            sources: [s3deploy.Source.asset(path.join(path.join(__dirname, "/../build")))] // TODO: Change to Build folder :)
        });

        let hostedZone;

        if (hostedZoneProps && hostedZoneProps.name && hostedZoneProps.id) {
            // Uncomment this code if HostedZone is located in other account or is created from other stack :)
            hostedZone = r53.HostedZone.fromHostedZoneAttributes(this, "KompetanseHostedZone", {
                hostedZoneId: hostedZoneProps.id,
                zoneName: hostedZoneProps.name
            })
        } else {
            hostedZone = new r53.HostedZone(this, "KompetanseHostedZone", {
                zoneName: domainname
            });
        }

        const cert = new Certificate(this, "kompetansecert", {
            domainName: "kompetanse.knowit.no",
            validation: CertificateValidation.fromDns(hostedZone)
        });

        const cloudFrontDistribution = new cfront.CloudFrontWebDistribution(this, "KompetanseCloudFront", {
            originConfigs: [{
                behaviors: [{isDefaultBehavior: true}],
                s3OriginSource: {s3BucketSource:hostingBucket}
            }],
            viewerCertificate: cfront.ViewerCertificate.fromAcmCertificate(cert, {
                aliases: [domainname]
            })
        });
    }
}