import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as cam from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as gateway from 'aws-cdk-lib/aws-apigateway';
// import { CfnUserPoolIdentityProvider } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
import * as path from "path";
import AppsyncConstruct from './appsyncConstruct';
import { AppSyncTransformer } from 'cdk-appsync-transformer';
import * as graphQL from "@aws-cdk/aws-appsync-alpha/lib/graphqlapi"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class KompetanseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const DEVELOPMENT_ENV = this.node.tryGetContext("DEVELOPMENT_ENV");
    const AZURE = this.node.tryGetContext("AZURE");
    const GOOGLE_ID = this.node.tryGetContext("GOOGLE_ID");
    const GOOGLE_SECRET = this.node.tryGetContext("GOOGLE_SECRET");
    const ENV = this.node.tryGetContext("ENV");
    const isProd = DEVELOPMENT_ENV === "master";

    const pool = new cognito.UserPool(this, "Kompetansekartlegging", {
      customAttributes: {
        "OrganizationID": new cognito.StringAttribute({ mutable: true }),
        "company": new cognito.StringAttribute({ mutable: true })
      },
      signInAliases: {
        username: true
      },
      passwordPolicy: {
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      }
    })

    const supportedProviders = [];

    const googlePorvider = new cognito.UserPoolIdentityProviderGoogle(this, "Google", {
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      userPool: pool,
      scopes: ["profile", "email", "openid"],
      attributeMapping: {
        email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        fullname: cognito.ProviderAttribute.GOOGLE_NAME,
        profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE
      }
    })
    supportedProviders.push({ name: googlePorvider.providerName });

    const samlProvider = new cognito.CfnUserPoolIdentityProvider(this, "Saml", {
      userPoolId: pool.userPoolId,
      providerName: "AzureAD",
      providerType: "SAML",
      providerDetails: {
        MetadataURL: AZURE//"https://login.microsoftonline.com/645152b7-1e59-4dbc-aec9-b418a90db78c/federationmetadata/2007-06/federationmetadata.xml?appid=f0c04a53-e576-4c4b-b9f1-86491313bc2f"
      },
      attributeMapping: {
        "custom:company": "http://schemas.microsoft.com/ws/2008/06/identity/claims/companyname",
        "email": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        "name": "http://schemas.microsoft.com/ws/2008/06/identity/claims/displayname"
      }
    });

    supportedProviders.push({ name: samlProvider.providerName });

    const appClient = pool.addClient("AppClient", {
      supportedIdentityProviders: supportedProviders,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: (isProd) ? ["https://kompetanse.knowit.no/"] : ["http://localhost:3000/"],
        logoutUrls: (isProd) ? ["https://kompetanse.knowit.no/"] : ["http://localhost:3000/"]
      },
      userPoolClientName: "Kompetansekartlegging App Client",

    });

    const identityPool = new cognito.CfnIdentityPool(this, "KompetanseIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{ providerName: pool.userPoolProviderName, clientId: appClient.userPoolClientId }],
    })

    const authRole = new iam.Role(this, "AuthRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    authRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        "execute-api:Invoke"
      ],
      resources: [
        "arn:aws:execute-api:eu-central-1:153690382195:65iwvl3jha/migrate/GET//*",
        "arn:aws:execute-api:eu-central-1:153690382195:65iwvl3jha/migrate/GET/"
      ],
      effect: iam.Effect.ALLOW
    }))

    const unauthRole = new iam.Role(this, "UnauthRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    const roleAttachment = new cognito.CfnIdentityPoolRoleAttachment(
      this,
      "IdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: { authenticated: authRole.roleArn, unauthenticated: unauthRole.roleArn },
      }
    );

    const presignupCognitoPermissions = new iam.PolicyStatement({
      actions: ["cognito-idp:AdminAddUserToGroup", "cognito-idp:ListUsers", "cognito-idp:UpdateUserAttributes", "cognito-idp:AdminUpdateUserAttributes", "cognito-idp:AdminLinkProviderForUser", "cognito-idp:AdminCreateUser", "cognito-idp:AdminConfirmSignUp", "cognito-idp:AdminSetUserPassword"],
      resources: ["arn:aws:cognito-idp:*:*:userpool/*"]
    });

    const presignupDynamoDbPermissions = new iam.PolicyStatement({
      actions: ["dynamodb:Query"],
      resources: ["arn:aws:dynamodb:*:*:table/*"]
    });


    const presignupTrigger = new lambda.Function(this, "KompetansePresignUpTrigger", {
      code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/presignup")),
      functionName: "KompetansePreSignupTrigger",
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: Duration.seconds(25)
    });

    presignupTrigger.role?.attachInlinePolicy(
      new iam.Policy(this, "presignup-cognito", {
        statements: [presignupCognitoPermissions, presignupDynamoDbPermissions]
      })
    );

    const domainSettings: { cognitoDomain?: { domainPrefix: string }, customDomain?: { domainName: string, certificate: cam.Certificate } } = {}
    if (isProd) {
      // const hostedZone = new r53.HostedZone(this, "KompetansekartleggingHostedZone", {
      //   zoneName: "kompetanse.knowit.no",
      // });

      // const authDomainName = "auth.kompetanse.knowit.no";
      // const certificate = new cam.Certificate(this, "auth.kompetanse.knowit.no", {
      //   domainName: authDomainName,
      //   validation: cam.CertificateValidation.fromDns(hostedZone)
      // });
      // domainSettings.customDomain = {
      //     domainName: authDomainName,
      //     certificate: certificate
      // };
    } else {
      domainSettings.cognitoDomain = {
        domainPrefix: `komptest-${ENV}`
      };
    }

    pool.addDomain("kompetansekartlegging-domain-name", domainSettings);


    pool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, presignupTrigger);
    
    const tableNames = {
      "OrganizationTable": `Organization-${this.artifactId}`,
      "UserTable": `User-${this.artifactId}`,
      "UserFormTable": `UserForm-${this.artifactId}`,
      "QuestionTable": `Question-${this.artifactId}`,
      "QuestionAnswerTable": `QuestionAnswer-${this.artifactId}`,
      "FormDefinitionTable": `FormDefinition-${this.artifactId}`,
      "APIKeyPermissionTable": `APIKeyPermission-${this.artifactId}`,
      "GroupTable": `Group-${this.artifactId}`,
      "CategoryTable": `Category-${this.artifactId}`,
    }

    const appSync = new AppSyncTransformer(this, "Appsync", {
      schemaPath: path.join(__dirname, "/../backend/schema.graphql"),
      tableNames: tableNames
    });

    const adminQueriesLambda = new lambda.Function(this, "kompetanseAdminQueries", {
      code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/AdminQueries")),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        "USERPOOL": pool.userPoolId,
        "GROUP": "admin",
        "GROUP_LIST_USERS": "groupLeader"
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            "cognito-idp:ListUsersInGroup",
            "cognito-idp:AdminUserGlobalSignOut",
            "cognito-idp:AdminEnableUser",
            "cognito-idp:AdminDisableUser",
            "cognito-idp:AdminRemoveUserFromGroup",
            "cognito-idp:AdminAddUserToGroup",
            "cognito-idp:AdminListGroupsForUser",
            "cognito-idp:AdminGetUser",
            "cognito-idp:AdminConfirmSignUp",
            "cognito-idp:ListUsers",
            "cognito-idp:ListGroups"
          ],
          effect: iam.Effect.ALLOW,
          resources: [pool.userPoolArn]
        })
      ]
    });

    const tableArns: any = {}

    Object.keys(appSync.tableMap).forEach(table => {
      tableArns[table] = appSync.tableMap[table].tableArn;
    });

    const externalApiStatement = new iam.PolicyStatement({
      actions: [
        "dynamodb:Get*",
        "dynamodb:BatchGetItem",
        "dynamodb:List*",
        "dynamodb:Describe*",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        tableArns["UserFormTable"],
        `${tableArns["UserFormTable"]}/index/*`,
        tableArns["QuestionTable"], 
        `${tableArns["QuestionTable"]}/index/*`,
        tableArns["QuestionAnswerTable"],
        `${tableArns["QuestionAnswerTable"]}/index/*`,
        tableArns["CategoryTable"],
        `${tableArns["CategoryTable"]}/index/*`,
        tableArns["FormDefinitionTable"],
        `${tableArns["FormDefinitionTable"]}/index/*`,
        tableArns["APIKeyPermissionTable"],
        `${tableArns["APIKeyPermissionTable"]}/index/*`
      ]
    });
    
    const externalAPILambda = new lambda.Function(this, "kompetanseExternalApiLambda", {
      code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/externalAPI")),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        "USERPOOL": pool.userPoolId,
        "TABLE_MAP": JSON.stringify(appSync.tableNameMap)
      },
      initialPolicy: [externalApiStatement]
    });

    



    const createUserFormStatement = new iam.PolicyStatement({
      actions: [
        "dynamodb:Put*",
        "dynamodb:Create*",
        "dynamodb:BatchWriteItem",
        "dynamodb:Get*",
        "dynamodb:BatchGetItem",
        "dynamodb:List*",
        "dynamodb:Describe*",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:Update*",
        "dynamodb:RestoreTable*"
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        tableArns["UserFormTable"],
        `${tableArns["UserFormTable"]}/index/*`,
        tableArns["QuestionTable"], 
        `${tableArns["QuestionTable"]}/index/*`,
        tableArns["QuestionAnswerTable"],
        `${tableArns["QuestionAnswerTable"]}/index/*`
      ]
    });
    
    const createUserFormPolicy = new iam.Policy(this, "CreateUserFormPolicy", {
      statements: [createUserFormStatement]
    })

    presignupTrigger.addEnvironment("TABLE_MAP", JSON.stringify(appSync.tableNameMap));
    // externalAPILambda.addEnvironment("TABLE_MAP", JSON.stringify(appSync.tableNameMap));

    const batchCreateUser = new lambda.Function(this, "kompetansebatchuserform", {
      code: lambda.Code.fromAsset(path.join(__dirname, "/../backend/function/createUserformBatch")),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    appSync.addLambdaDataSourceAndResolvers("createUserformBatch", "BatchCreateUserDataSource", batchCreateUser);

    // const appSync = new AppsyncConstruct(this, "KompetanseAppSync", {
    //   userpool: pool,
    //   region: this.region
    // });

    // const adminQueryApi = new gateway.LambdaRestApi(this, "KompetanseAdminQueriesApi", {
    //   handler: adminQueriesLambda,
    //   restApiName: "AdminQueries",
    //   deployOptions: {
    //     stageName: (isProd) ? "prod" : "dev",
    //   },
    //   defaultMethodOptions: {
    //     authorizer: new gateway.CognitoUserPoolsAuthorizer(this, "CognitoAdminQueries", {
    //       authorizerName: "COGNITO",
    //       cognitoUserPools: [pool],
    //     }),
    //     authorizationScopes: ["aws.cognito.signin.user.admin"],
    //   },
    //   defaultCorsPreflightOptions: {
    //     allowOrigins: gateway.Cors.ALL_ORIGINS,
    //     allowMethods: gateway.Cors.ALL_METHODS,
    //     allowHeaders: [
    //       'Content-Type',
    //       'X-Amz-Date',
    //       'Authorization',
    //       'X-Api-Key',
    //     ],
    //   }
    // });

    const adminQueryApi = new gateway.RestApi(this, "kompetanseAdminQueriesRestApi", {
      restApiName: "AdminQueries",
      deployOptions: {
        stageName: "dev"
      },
    });

    // const resource = adminQueryApi.root.addResource("");
    const proxy = adminQueryApi.root.addProxy({
      anyMethod: false
    });
    proxy.addMethod("ANY", new gateway.LambdaIntegration(adminQueriesLambda), {
      authorizer: new gateway.CognitoUserPoolsAuthorizer(this, "CognitoAdminQueries", {
        authorizerName: "COGNITO",
        cognitoUserPools: [pool],
      }),
      authorizationScopes: ["aws.cognito.signin.user.admin"],
    });

    proxy.addMethod("OPTIONS", new gateway.MockIntegration({
      passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        "application/json" : JSON.stringify({statusCode: 200})
      },
      integrationResponses: [{
        statusCode: "200",
        responseParameters:{
          "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
          "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "method.response.header.Access-Control-Allow-Origin": "'*'"
        }
      }],
    }), {
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          'method.response.header.Content-Type': true,
          "method.response.header.Access-Control-Allow-Headers": true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Methods': true
        },
        responseModels: {"application/json": gateway.Model.EMPTY_MODEL}
      }],
    });
    
    // const externalApi = new gateway.LambdaRestApi(this, "KompetanseExternalApi", {
    //   handler: externalAPILambda,
    //   restApiName: "externalAPI",
    //   deployOptions: {
    //     stageName: (isProd) ? "prod" : "dev"
    //   }
    // });

    const externalApi = new gateway.RestApi(this, "KompetanseExternalApi", {
      restApiName: "externalApi",
      deployOptions: {
        stageName: (isProd) ? "prod" : "dev"
      }
    });

    const externalApiProxy = externalApi.root.addProxy({
      anyMethod: false,
    });

    const extResponseModel = externalApi.addModel("externalAPIResponseModel", {
      contentType: "application/json",
      modelName: "ResponseSchema",
      schema: {
        "type" : gateway.JsonSchemaType.OBJECT,
        "required" : [ "response" ],
        "properties" : {
          "response" : {
            "type" : gateway.JsonSchemaType.STRING
          }
        },
        "title" : "Response Schema"
      }
    })

    const externalApiAnyMethod = externalApiProxy.addMethod("ANY", new gateway.LambdaIntegration(
      externalAPILambda
    ),
    {
      apiKeyRequired: true,
      requestModels: {
        "application/json": extResponseModel
      },
      methodResponses: [
        {
          statusCode: "200",
          responseModels: {
            "application/json": extResponseModel
          }
        }
      ]
    })
    externalApiProxy.addMethod("OPTIONS", new gateway.MockIntegration({
      passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        "application/json" : JSON.stringify({statusCode: 200})
      },
      integrationResponses: [{
        statusCode: "200",
        responseParameters:{
          "method.response.header.Access-Control-Allow-Methods": "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
          "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "method.response.header.Access-Control-Allow-Origin": "'*'"
        }
      }],
    }), {
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          'method.response.header.Content-Type': true,
          "method.response.header.Access-Control-Allow-Headers": true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Methods': true
        },
      }],
    });

    const extUsagePlan = externalApi.addUsagePlan("externalApiUsagePlan", {
      name: "standard",
      apiStages: [{
        api: externalApi,
        stage: externalApi.deploymentStage
      }]
    });
  

    const apiKeyTest = extUsagePlan.addApiKey(new gateway.ApiKey(this, "TestKey", {apiKeyName:"Test"}));


    if (batchCreateUser.role) createUserFormPolicy.attachToRole(batchCreateUser.role);

    const identityPoolIdOutput = new CfnOutput(this, "aws_cognito_identity_pool_id", {
      value: identityPool.ref, // "eu-central-1:ed60ff7c-18dc-49e6-a8cf-aa7a068fa2a5",
    });
    const userPoolIdOutput = new CfnOutput(this, "aws_user_pools_id", {
      value: pool.userPoolId
    });
    const userPoolWebClientIdOutput = new CfnOutput(this, "aws_user_pools_web_client_id", {
      value: appClient.userPoolClientId
    });
    const tableMapOutput = new CfnOutput(this, "tablename_map", {
      value: JSON.stringify(appSync.tableNameMap)
    });
    const tableArnMapOutput = new CfnOutput(this, "tableArns", {
      value: JSON.stringify(tableArns)
    });
    // const createUserFormRoleOutput = new CfnOutput(this, "userFormRoleOutput", {
    //   value: batchCreateUser.role?.roleArn || ""
    // });

    // const createUserFormPolicyArnOutput = new CfnOutput(this, "userFormPolicyArn", {
    //   value: createUserFormPolicy,
    // });

    const createUserFormRoleNameOutput = new CfnOutput(this, "userFormRoleNameOutput", {
      value: batchCreateUser.role?.roleName || ""
    });

    const oauthOutput = new CfnOutput(this, "oauth", {
      value: JSON.stringify({
          domain: (isProd) ? domainSettings.customDomain?.domainName : `${domainSettings.cognitoDomain?.domainPrefix}.auth.eu-central-1.amazoncognito.com` //"komptest.auth.eu-central-1.amazoncognito.com"
      })
    });

    const functionMapOutput = new CfnOutput(this, "functionMap", {
      value: JSON.stringify({
        adminQueries: {
          name: adminQueryApi.restApiName,
          endpoint: adminQueryApi.url,
          region: this.region
        },
        externalAPI: {
          name: externalApi.restApiName,
          endpoint: externalApi.url,
          region: this.region
        }
      })
    });
    
    const userCreateBatchOutput = new CfnOutput(this, "outputCreateBatch", {
      value: batchCreateUser.functionName
    });
    
    const apiId = new CfnOutput(this, "outputAppSyncId", {
      value: appSync.appsyncAPI.apiId
    });
  }
}
