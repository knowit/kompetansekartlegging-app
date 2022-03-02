import { Stack } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
export declare class KompetanseFrontendDistributionAndCertsStack {
    constructor(domainname: string, websiteBucket: s3.Bucket, stack: Stack);
}
