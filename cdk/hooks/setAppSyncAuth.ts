import * as appsync from "@aws-sdk/client-appsync";
import * as lambda from "@aws-sdk/client-lambda";
import * as iam from "@aws-sdk/client-iam";
import { fromIni } from "@aws-sdk/credential-providers";

export default async (userPoolId: string, userPoolClientId: string, appsyncId: string, batchCreateUserId: any, tableMap: string, tableArns: string) => {
    const lambdaClient = new lambda.LambdaClient({region: "eu-central-1"});
    const appsyncClient = new appsync.AppSyncClient({region: "eu-central-1"});
    const iamClient = new iam.IAMClient({region: "eu-central-1"});

    
    console.log("Adding TableName map to CreateUserformBatch");
    const currentLambdaConfig = await lambdaClient.send(new lambda.GetFunctionCommand({FunctionName:batchCreateUserId}));
    const currentVariables = currentLambdaConfig.Configuration?.Environment?.Variables;
    const updateResponse = await lambdaClient.send(new lambda.UpdateFunctionConfigurationCommand({
        ...currentLambdaConfig,
        FunctionName: batchCreateUserId,
        Environment: {Variables: {...currentVariables, TABLEMAP: tableMap, REGION: "eu-central-1"}}//...currentLambdaConfig.Configuration?.Environment, "TABLEMAP": tableMap}
    }));
    // let test = {
    //     actions: [
    //       "dynamodb:Get*",
    //       "dynamodb:BatchGetItem",
    //       "dynamodb:List*",
    //       "dynamodb:Describe*",
    //       "dynamodb:Scan",
    //       "dynamodb:Query"
    //     ],
    //     effect: "ALLOW",
    //     resources: [parsedTableArns["UserFormTable"],parsedTableArns["QuestionTable"], parsedTableArns["QuestionAnswerTable"]]
    //   }
    // console.log(batchCreateUserId);
    // try {
    //     const batchCreateUserPolicy = await lambdaClient.send(new lambda.GetPolicyCommand({
    //         FunctionName: batchCreateUserId
    //     }));
    //     console.log(batchCreateUserPolicy);
    // } catch (error) {
    //     console.log(error);
    // }
    // const parsedTableArns = JSON.parse(tableArns);
    // try {
    //     const policyResponse = await iamClient.send(new iam.CreatePolicyCommand({
    //         PolicyName: "CreateUserFormDynamoDBAccess",
    //         PolicyDocument: JSON.stringify({
    //             actions: [
    //                 "dynamodb:Get*",
    //                 "dynamodb:BatchGetItem",
    //                 "dynamodb:List*",
    //                 "dynamodb:Describe*",
    //                 "dynamodb:Scan",
    //                 "dynamodb:Query"
    //             ],
    //             effect: "ALLOW",
    //             resources: [parsedTableArns["UserFormTable"],parsedTableArns["QuestionTable"], parsedTableArns["QuestionAnswerTable"]]
    //         })
    //     }));

    //     const attachPolicyToRole = await iamClient.send(new iam.AttachRolePolicyCommand({
    //         PolicyArn: "",
    //         RoleName: ""
    //     }))
    // } catch (error) {
    //     // const policyResponse = await iamClient.send(new iam.GetPolicyCommand({PolicyArn}))
    //     // const addPolicyToRole = await iamClient.send(new iam.UpdateRoleCommand({
    //     //     RoleName: "",

    //     // }))
    // }


    console.log("Successfully added TableName map to CreateUserformBatch");

    console.log("Updating authentication for Appsync");
    const currentAppsyncConfig = await appsyncClient.send(new appsync.GetGraphqlApiCommand({apiId: appsyncId}));
    const updateAppsyncConfigResponse = await appsyncClient.send(new appsync.UpdateGraphqlApiCommand({
        ...currentAppsyncConfig.graphqlApi,
        apiId: appsyncId,
        name: currentAppsyncConfig.graphqlApi?.name,
        userPoolConfig: {
            awsRegion: "eu-central-1",
            userPoolId: userPoolId,
            defaultAction: "ALLOW"
        },
        authenticationType: appsync.AuthenticationType.AMAZON_COGNITO_USER_POOLS
    }));
    console.log("Successfully updated authentication for AppSync");
}