"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KompetanseFrontendStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
class KompetanseFrontendStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
exports.KompetanseFrontendStack = KompetanseFrontendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS29tcGV0YW5zZUZyb250ZW5kU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJLb21wZXRhbnNlRnJvbnRlbmRTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBZ0Q7QUFFaEQseUNBQXlDO0FBQ3pDLDBEQUEwRDtBQUsxRCx5REFBeUQ7QUFDekQsOERBQThEO0FBRTlELE1BQWEsdUJBQXdCLFNBQVEsbUJBQUs7SUFDaEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QiwrQ0FBK0M7UUFFM0MsTUFBTSxhQUFhLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNuRSxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxnQ0FBZ0MsRUFBRTtZQUN2RixlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1NBQ2pFLENBQUMsQ0FBQztRQUVILElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSwyQ0FBMkMsRUFBRTtZQUMvRSxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QyxpQkFBaUIsRUFBRSxhQUFhO1lBQ2hDLFlBQVk7WUFDWixpQkFBaUIsRUFBRSxDQUFDLElBQUksQ0FBQztTQUMxQixDQUFDLENBQUM7UUFHUCwyRUFBMkU7UUFDM0UsOEJBQThCO1FBQzlCLFNBQVM7UUFFVCw0REFBNEQ7UUFDNUQsNkNBQTZDO1FBQzdDLCtEQUErRDtRQUMvRCxTQUFTO1FBRVQseUdBQXlHO1FBQ3pHLDJCQUEyQjtRQUMzQixxREFBcUQ7UUFDckQsNERBQTREO1FBQzVELGFBQWE7UUFDYixnRkFBZ0Y7UUFDaEYsbUNBQW1DO1FBQ25DLFlBQVk7UUFDWixTQUFTO0lBQ1AsQ0FBQztDQUNGO0FBMUNELDBEQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNkZXBsb3kgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0ICogYXMgcjUzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IENlcnRpZmljYXRlLCBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24gfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNlcnRpZmljYXRlbWFuYWdlclwiO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnRcIjtcbmltcG9ydCAqIGFzIG9yaWdpbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnQtb3JpZ2lucyc7XG5cbmV4cG9ydCBjbGFzcyBLb21wZXRhbnNlRnJvbnRlbmRTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbi8vICAgIGNvbnN0IGRvbWFpbm5hbWUgPSBcImtvbXBldGFuc2Uua25vd2l0Lm5vXCJcblxuICAgIGNvbnN0IHdlYnNpdGVCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsICdLb21wZXRhbnNlSG9zdGluZ0J1Y2tldCcsIHtcbiAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiAnaW5kZXguaHRtbCcsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuRGlzdHJpYnV0aW9uKHRoaXMsICdLb21wZXRhbnNlRnJvbnRlbmREaXN0cmlidXRpb24nLCB7XG4gICAgICBkZWZhdWx0QmVoYXZpb3I6IHsgb3JpZ2luOiBuZXcgb3JpZ2lucy5TM09yaWdpbih3ZWJzaXRlQnVja2V0KSB9LFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0tvbXBldGFuc2VrYXJ0bGVnZ2luZ0Zyb250ZW5kQnVja2V0RGVwbG95Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldCgnLi4vYnVpbGQnKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogd2Vic2l0ZUJ1Y2tldCxcbiAgICAgIGRpc3RyaWJ1dGlvbixcbiAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbJy8qJ10sXG4gICAgfSk7XG5cblxuLy8gICAgY29uc3QgaG9zdGVkWm9uZSA9IG5ldyByNTMuSG9zdGVkWm9uZSh0aGlzLCBcIktvbXBldGFuc2VIb3N0ZWRab25lXCIsIHtcbi8vICAgICAgICB6b25lTmFtZTogZG9tYWlubmFtZVxuLy8gICAgfSk7XG5cbi8vICAgIGNvbnN0IGNlcnQgPSBuZXcgQ2VydGlmaWNhdGUodGhpcywgXCJrb21wZXRhbnNlY2VydFwiLCB7XG4vLyAgICAgICAgZG9tYWluTmFtZTogXCJrb21wZXRhbnNlLmtub3dpdC5ub1wiLFxuLy8gICAgICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKGhvc3RlZFpvbmUpXG4vLyAgICB9KTtcblxuLy8gICAgY29uc3QgY2xvdWRGcm9udERpc3RyaWJ1dGlvbiA9IG5ldyBjZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCBcIktvbXBldGFuc2VDbG91ZEZyb250XCIsIHtcbi8vICAgICAgICBvcmlnaW5Db25maWdzOiBbe1xuLy8gICAgICAgICAgICBiZWhhdmlvcnM6IFt7aXNEZWZhdWx0QmVoYXZpb3I6IHRydWV9XSxcbi8vICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtzM0J1Y2tldFNvdXJjZTpob3N0aW5nQnVja2V0fVxuLy8gICAgICAgIH1dLFxuLy8gICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBjZnJvbnQuVmlld2VyQ2VydGlmaWNhdGUuZnJvbUFjbUNlcnRpZmljYXRlKGNlcnQsIHtcbi8vICAgICAgICAgICAgYWxpYXNlczogW2RvbWFpbm5hbWVdXG4vLyAgICAgICAgfSlcbi8vICAgIH0pO1xuICB9XG59Il19