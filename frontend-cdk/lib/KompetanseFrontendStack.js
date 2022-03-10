"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KompetanseFrontendStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const origins = require("aws-cdk-lib/aws-cloudfront-origins");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
const KompetanseFrontendDistributionAndCertsStaack_1 = require("./KompetanseFrontendDistributionAndCertsStaack");
class KompetanseFrontendStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
        switch (process.env.DEPLOYMENT_ENV) {
            case 'dev': {
                new KompetanseFrontendDistributionAndCertsStaack_1.KompetanseFrontendDistributionAndCertsStack('dev.kompetanse.knowit.no', websiteBucket, this);
                break;
            }
            case 'prod': {
                new KompetanseFrontendDistributionAndCertsStaack_1.KompetanseFrontendDistributionAndCertsStack('kompetanse.knowit.no', websiteBucket, this);
                break;
            }
        }
    }
}
exports.KompetanseFrontendStack = KompetanseFrontendStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS29tcGV0YW5zZUZyb250ZW5kU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJLb21wZXRhbnNlRnJvbnRlbmRTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBZ0Q7QUFDaEQseURBQXlEO0FBQ3pELDhEQUE4RDtBQUM5RCx5Q0FBeUM7QUFDekMsMERBQTBEO0FBRTFELGlIQUE2RztBQUU3RyxNQUFhLHVCQUF3QixTQUFRLG1CQUFLO0lBQ2hELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTdELE1BQU0sYUFBYSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDbkUsb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0NBQWdDLEVBQUU7WUFDdkYsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTtTQUNqRSxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsMkNBQTJDLEVBQUU7WUFDL0UsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDNUMsaUJBQWlCLEVBQUUsYUFBYTtZQUNoQyxZQUFZO1lBQ1osaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDMUIsQ0FBQyxDQUFDO1FBR0gsUUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRTtZQUNqQyxLQUFLLEtBQUssQ0FBQyxDQUFDO2dCQUNSLElBQUksMEZBQTJDLENBQUMsMEJBQTBCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNqRyxNQUFNO2FBQ1Q7WUFDRCxLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUNYLElBQUksMEZBQTJDLENBQUMsc0JBQXNCLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM3RixNQUFNO2FBQ1A7U0FDSDtJQUNGLENBQUM7Q0FDRjtBQWxDRCwwREFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1jbG91ZGZyb250XCI7XG5pbXBvcnQgKiBhcyBvcmlnaW5zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250LW9yaWdpbnMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1kZXBsb3ltZW50JztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgS29tcGV0YW5zZUZyb250ZW5kRGlzdHJpYnV0aW9uQW5kQ2VydHNTdGFjayB9IGZyb20gJy4vS29tcGV0YW5zZUZyb250ZW5kRGlzdHJpYnV0aW9uQW5kQ2VydHNTdGFhY2snO1xuXG5leHBvcnQgY2xhc3MgS29tcGV0YW5zZUZyb250ZW5kU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc29sZS5sb2coJ0RFUExPWU1FTlRfRU5WIPCfkYknLCBwcm9jZXNzLmVudi5ERVBMT1lNRU5UX0VOVik7XG5cbiAgICBjb25zdCB3ZWJzaXRlQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnS29tcGV0YW5zZUhvc3RpbmdCdWNrZXQnLCB7XG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkRpc3RyaWJ1dGlvbih0aGlzLCAnS29tcGV0YW5zZUZyb250ZW5kRGlzdHJpYnV0aW9uJywge1xuICAgICAgZGVmYXVsdEJlaGF2aW9yOiB7IG9yaWdpbjogbmV3IG9yaWdpbnMuUzNPcmlnaW4od2Vic2l0ZUJ1Y2tldCkgfSxcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdLb21wZXRhbnNla2FydGxlZ2dpbmdGcm9udGVuZEJ1Y2tldERlcGxveScsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQoJy4uL2J1aWxkJyldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHdlYnNpdGVCdWNrZXQsXG4gICAgICBkaXN0cmlidXRpb24sXG4gICAgICBkaXN0cmlidXRpb25QYXRoczogWycvKiddLFxuICAgIH0pO1xuXG5cbiAgICBzd2l0Y2gocHJvY2Vzcy5lbnYuREVQTE9ZTUVOVF9FTlYpIHsgXG4gICAgICBjYXNlICdkZXYnOiB7IFxuICAgICAgICAgIG5ldyBLb21wZXRhbnNlRnJvbnRlbmREaXN0cmlidXRpb25BbmRDZXJ0c1N0YWNrKCdkZXYua29tcGV0YW5zZS5rbm93aXQubm8nLCB3ZWJzaXRlQnVja2V0LCB0aGlzKTtcbiAgICAgICAgICBicmVhazsgXG4gICAgICB9IFxuICAgICAgY2FzZSAncHJvZCc6IHsgXG4gICAgICAgIG5ldyBLb21wZXRhbnNlRnJvbnRlbmREaXN0cmlidXRpb25BbmRDZXJ0c1N0YWNrKCdrb21wZXRhbnNlLmtub3dpdC5ubycsIHdlYnNpdGVCdWNrZXQsIHRoaXMpO1xuICAgICAgICBicmVhazsgXG4gICAgICB9IFxuICAgfSBcbiAgfVxufSJdfQ==