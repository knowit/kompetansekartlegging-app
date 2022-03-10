"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KompetanseFrontendDistributionAndCertsStack = void 0;
const aws_certificatemanager_1 = require("aws-cdk-lib/aws-certificatemanager");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const r53 = require("aws-cdk-lib/aws-route53");
class KompetanseFrontendDistributionAndCertsStack {
    constructor(domainname, websiteBucket, stack) {
        const hostedZone = new r53.HostedZone(stack, "KompetanseHostedZone", {
            zoneName: domainname
        });
        const cert = new aws_certificatemanager_1.Certificate(stack, "kompetansecert", {
            domainName: domainname,
            validation: aws_certificatemanager_1.CertificateValidation.fromDns(hostedZone)
        });
        const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(stack, "KompetanseCloudFront", {
            originConfigs: [{
                    behaviors: [{ isDefaultBehavior: true }],
                    s3OriginSource: { s3BucketSource: websiteBucket }
                }],
            viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(cert, {
                aliases: [domainname]
            })
        });
    }
}
exports.KompetanseFrontendDistributionAndCertsStack = KompetanseFrontendDistributionAndCertsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS29tcGV0YW5zZUZyb250ZW5kRGlzdHJpYnV0aW9uQW5kQ2VydHNTdGFhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJLb21wZXRhbnNlRnJvbnRlbmREaXN0cmlidXRpb25BbmRDZXJ0c1N0YWFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwrRUFBd0Y7QUFDeEYseURBQXlEO0FBQ3pELCtDQUErQztBQUcvQyxNQUFhLDJDQUEyQztJQUN0RCxZQUFZLFVBQWtCLEVBQUUsYUFBd0IsRUFBRyxLQUFZO1FBRXJFLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUU7WUFDakUsUUFBUSxFQUFFLFVBQVU7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQ0FBVyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUNsRCxVQUFVLEVBQUUsVUFBVTtZQUN0QixVQUFVLEVBQUUsOENBQXFCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUN4RCxDQUFDLENBQUM7UUFFSCxNQUFNLHNCQUFzQixHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBRTtZQUNyRyxhQUFhLEVBQUUsQ0FBQztvQkFDVixTQUFTLEVBQUUsQ0FBQyxFQUFDLGlCQUFpQixFQUFFLElBQUksRUFBQyxDQUFDO29CQUN0QyxjQUFjLEVBQUUsRUFBQyxjQUFjLEVBQUMsYUFBYSxFQUFDO2lCQUNqRCxDQUFDO1lBQ0YsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRTtnQkFDckUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ3hCLENBQUM7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF0QkQsa0dBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDZXJ0aWZpY2F0ZSwgQ2VydGlmaWNhdGVWYWxpZGF0aW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXJcIjtcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1jbG91ZGZyb250XCI7XG5pbXBvcnQgKiBhcyByNTMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcblxuZXhwb3J0IGNsYXNzIEtvbXBldGFuc2VGcm9udGVuZERpc3RyaWJ1dGlvbkFuZENlcnRzU3RhY2sge1xuICBjb25zdHJ1Y3Rvcihkb21haW5uYW1lOiBzdHJpbmcsIHdlYnNpdGVCdWNrZXQ6IHMzLkJ1Y2tldCAsIHN0YWNrOiBTdGFjaykge1xuXG4gICAgY29uc3QgaG9zdGVkWm9uZSA9IG5ldyByNTMuSG9zdGVkWm9uZShzdGFjaywgXCJLb21wZXRhbnNlSG9zdGVkWm9uZVwiLCB7XG4gICAgICAgIHpvbmVOYW1lOiBkb21haW5uYW1lXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZXJ0ID0gbmV3IENlcnRpZmljYXRlKHN0YWNrLCBcImtvbXBldGFuc2VjZXJ0XCIsIHtcbiAgICAgICAgZG9tYWluTmFtZTogZG9tYWlubmFtZSxcbiAgICAgICAgdmFsaWRhdGlvbjogQ2VydGlmaWNhdGVWYWxpZGF0aW9uLmZyb21EbnMoaG9zdGVkWm9uZSlcbiAgICB9KTtcblxuICAgIGNvbnN0IGNsb3VkRnJvbnREaXN0cmlidXRpb24gPSBuZXcgY2xvdWRmcm9udC5DbG91ZEZyb250V2ViRGlzdHJpYnV0aW9uKHN0YWNrLCBcIktvbXBldGFuc2VDbG91ZEZyb250XCIsIHtcbiAgICAgIG9yaWdpbkNvbmZpZ3M6IFt7XG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7aXNEZWZhdWx0QmVoYXZpb3I6IHRydWV9XSxcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7czNCdWNrZXRTb3VyY2U6d2Vic2l0ZUJ1Y2tldH1cbiAgICAgICAgfV0sXG4gICAgICAgIHZpZXdlckNlcnRpZmljYXRlOiBjbG91ZGZyb250LlZpZXdlckNlcnRpZmljYXRlLmZyb21BY21DZXJ0aWZpY2F0ZShjZXJ0LCB7XG4gICAgICAgICAgICBhbGlhc2VzOiBbZG9tYWlubmFtZV1cbiAgICAgICAgfSlcbiAgICB9KTtcbiAgfVxufSJdfQ==