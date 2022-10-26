import setAppSyncAuth from "./setAppSyncAuth";
import * as fs from "fs"

const file = fs.readFileSync("outputs.json", {encoding: "utf-8"})

const json = JSON.parse(file);
let stack: any;

stack = json[Object.keys(json)[0]];

stack.oauth = JSON.parse(stack.oauth);
stack.functionMap = JSON.parse(stack.functionMap);
const functionMap = Object.keys(stack.functionMap).map(key => {
    return {
        ...stack.functionMap[key],
        endpoint: stack.functionMap[key].endpoint.substring(0, stack.functionMap[key].endpoint.length - 1) // Remove / from endpoint 
    }
});

setAppSyncAuth(stack.awsuserpoolsid, stack.awsuserpoolswebclientid, stack.outputAppSyncId, stack.outputCreateBatch, stack.tablenamemap, stack.tableArns)

fs.writeFileSync("../frontend/src/exports.js", `
const exports = {
    aws_project_region: "eu-central-1",
    aws_cognito_region: "eu-central-1",
    aws_user_pools_id: "${stack.awsuserpoolsid}",
    aws_cognito_identity_pool_id: "${stack.awscognitoidentitypoolid}",
    aws_user_pools_web_client_id: "${stack.awsuserpoolswebclientid}",
    oauth: {
        domain: "${stack.oauth.domain}",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "responseType": "code",
        redirectSignIn: "",
        redirectSignOut: ""
    },
    aws_appsync_graphqlEndpoint: "${stack.appsyncGraphQLEndpointOutput}",
    aws_cloud_logic_custom: ${JSON.stringify(functionMap, null, 2)},
    "federationTarget": "COGNITO_USER_AND_IDENTITY_POOLS",
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [
        "GOOGLE"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [],
    "aws_appsync_region": "eu-central-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
}
export default exports;
`);

// awsconfig.aws_cognito_identity_pool_id = outputs.awscognitoidentitypoolid;
// awsconfig.aws_user_pools_id = outputs.awsuserpoolsid;
// awsconfig.aws_user_pools_web_client_id = outputs.awsuserpoolswebclientid;
// awsconfig.oauth.domain = outputs.oauth.oauth.domain;
// awsconfig.aws_appsync_graphqlEndpoint = outputs.appsyncGraphQLEndpointOutput;
// awsconfig.aws_cloud_logic_custom = [
//     {
//         ...outputs.functionMap.adminQueries,
//         endpoint: outputs.kompetanseAdminQueriesRestApiEndpoint41001590
//     },
//     {
//         ...outputs.functionMap.externalAPI,
//         endpoint: outputs.KompetanseExternalApiEndpoint650AEEDF
//     },
// ];