import setAppSyncAuth from "./setAppSyncAuth";
import initializeDatabase from "./initializeDatabase";
import * as fs from "fs"

const file = fs.readFileSync("outputs.json", {encoding: "utf-8"})

const json = JSON.parse(file);
const kompetanseStackKey = Object.keys(json).find(key => key.startsWith("KompetanseStack"));
const auroraStackKey = Object.keys(json).find(key => key.startsWith("AuroraStack"));
if (kompetanseStackKey === undefined) {
    throw new ReferenceError("Kunne ikke finne KompetanseStack i outputs.json");
} else if (auroraStackKey === undefined) {
    throw new ReferenceError("Kunne ikke finne AuroraStack i outputs.json");
}

// AuroraStack

let auroraStack: any = json[auroraStackKey];
initializeDatabase(auroraStack.initDbFunctionName);


// KompetanseStack

let kompetanseStack: any;
kompetanseStack = json[kompetanseStackKey];
// console.log(stack);
kompetanseStack.oauth = JSON.parse(kompetanseStack.oauth);
kompetanseStack.functionMap = JSON.parse(kompetanseStack.functionMap);
const functionMap = Object.keys(kompetanseStack.functionMap).map(key => {
    // stack.functionMap[key].endpoint = stack.functionMap[key].endpoint.substring(0, stack.functionMap[key].endpoint.length - 1) 
    return {
        ...kompetanseStack.functionMap[key],
        endpoint: kompetanseStack.functionMap[key].endpoint.substring(0, kompetanseStack.functionMap[key].endpoint.length - 1) // Remove / from endpoint 
    }
});

setAppSyncAuth(kompetanseStack.awsuserpoolsid, kompetanseStack.awsuserpoolswebclientid, kompetanseStack.outputAppSyncId, kompetanseStack.outputCreateBatch, kompetanseStack.tablenamemap, kompetanseStack.tableArns)

fs.writeFileSync("../frontend/src/exports.js", `
const exports = {
    aws_project_region: "eu-central-1",
    aws_cognito_region: "eu-central-1",
    aws_user_pools_id: "${kompetanseStack.awsuserpoolsid}",
    aws_cognito_identity_pool_id: "${kompetanseStack.awscognitoidentitypoolid}",
    aws_user_pools_web_client_id: "${kompetanseStack.awsuserpoolswebclientid}",
    oauth: {
        domain: "${kompetanseStack.oauth.domain}",
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
    aws_appsync_graphqlEndpoint: "${kompetanseStack.appsyncGraphQLEndpointOutput}",
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