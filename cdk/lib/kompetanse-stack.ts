import * as python from '@aws-cdk/aws-lambda-python-alpha'
import {
  aws_cloudwatch,
  aws_secretsmanager,
  aws_sns_subscriptions,
  CfnOutput,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import * as backup from 'aws-cdk-lib/aws-backup'
import * as cam from 'aws-cdk-lib/aws-certificatemanager'
import {
  ComparisonOperator,
  Stats,
  TreatMissingData,
  Unit,
} from 'aws-cdk-lib/aws-cloudwatch'
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as sns from 'aws-cdk-lib/aws-sns'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
// import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as gateway from 'aws-cdk-lib/aws-apigateway'
// import { CfnUserPoolIdentityProvider } from 'aws-cdk-lib/aws-cognito';
import { AppSyncTransformer } from 'cdk-appsync-transformer'
import { Construct } from 'constructs'
import * as path from 'path'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class KompetanseStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    const AZURE = this.node.tryGetContext('AZURE')
    const EXCEL = this.node.tryGetContext('EXCEL')
    const ENV = this.node.tryGetContext('ENV')
    const isProd = ENV === 'prod'
    const isDev = ENV === 'dev'
    const LOG_RETENTION_THREE_MONTHS = RetentionDays.THREE_MONTHS

    // COGNITO SetUp

    const pool = new cognito.UserPool(this, 'Kompetansekartlegging', {
      customAttributes: {
        OrganizationID: new cognito.StringAttribute({ mutable: true }),
        company: new cognito.StringAttribute({ mutable: true }),
        anonymizedID: new cognito.StringAttribute({ mutable: true }),
      },
      signInAliases: {
        username: true,
      },
      passwordPolicy: {
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      },
      selfSignUpEnabled: !isProd,
      autoVerify: { email: !isProd },
    })

    const supportedProviders = []

    if (AZURE) {
      const samlProvider = new cognito.CfnUserPoolIdentityProvider(
        this,
        'Saml',
        {
          userPoolId: pool.userPoolId,
          providerName: 'AzureAD',
          providerType: 'SAML',
          providerDetails: {
            MetadataURL: AZURE,
          },
          attributeMapping: {
            'custom:company':
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/company',
            email:
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
            name: 'http://schemas.microsoft.com/identity/claims/displayname',
          },
        }
      )
      supportedProviders.push({ name: samlProvider.providerName })
    }
    // AppClient
    const appClient = pool.addClient('AppClient', {
      supportedIdentityProviders: supportedProviders,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        callbackUrls: isProd
          ? ['https://kompetanse.knowit.no/']
          : isDev
          ? ['https://dev.kompetanse.knowit.no/']
          : ['http://localhost:3000/'],
        logoutUrls: isProd
          ? ['https://kompetanse.knowit.no/']
          : isDev
          ? ['https://dev.kompetanse.knowit.no/']
          : ['http://localhost:3000/'],
      },
      userPoolClientName: 'Kompetansekartlegging App Client',
    })

    // Identity Pool Setup
    if (supportedProviders.length > 0) {
      const identityPool = new cognito.CfnIdentityPool(
        this,
        'KompetanseIdentityPool',
        {
          allowUnauthenticatedIdentities: true,
          cognitoIdentityProviders: [
            {
              providerName: pool.userPoolProviderName,
              clientId: appClient.userPoolClientId,
            },
          ],
        }
      )

      const authRole = new iam.Role(this, 'AuthRole', {
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ),
      })

      const unauthRole = new iam.Role(this, 'UnauthRole', {
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ),
      })

      const roleAttachment = new cognito.CfnIdentityPoolRoleAttachment(
        this,
        'IdentityPoolRoleAttachment',
        {
          identityPoolId: identityPool.ref,
          roles: {
            authenticated: authRole.roleArn,
            unauthenticated: unauthRole.roleArn,
          },
        }
      )

      // Conditional output
      const identityPoolIdOutput = new CfnOutput(
        this,
        'aws_cognito_identity_pool_id',
        {
          value: identityPool.ref, // "eu-central-1:ed60ff7c-18dc-49e6-a8cf-aa7a068fa2a5",
        }
      )
    }

    // PreSignUp Trigger Setup

    const presignupCognitoPermissions = new iam.PolicyStatement({
      actions: [
        'cognito-idp:AdminAddUserToGroup',
        'cognito-idp:ListUsers',
        'cognito-idp:UpdateUserAttributes',
        'cognito-idp:AdminUpdateUserAttributes',
        'cognito-idp:AdminLinkProviderForUser',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminConfirmSignUp',
        'cognito-idp:AdminSetUserPassword',
      ],
      resources: ['arn:aws:cognito-idp:*:*:userpool/*'],
    })

    const presignupDynamoDbPermissions = new iam.PolicyStatement({
      actions: ['dynamodb:Query'],
      resources: ['arn:aws:dynamodb:*:*:table/*'],
    })

    const presignupTrigger = new lambda.Function(
      this,
      'KompetansePresignUpTrigger',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '/../backend/presignup')
        ),
        functionName: `KompetansePreSignupTrigger-${ENV}`,
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: Duration.seconds(25),
        logRetention: LOG_RETENTION_THREE_MONTHS,
      }
    )

    presignupTrigger.role?.attachInlinePolicy(
      new iam.Policy(this, 'presignup-cognito', {
        statements: [presignupCognitoPermissions, presignupDynamoDbPermissions],
      })
    )

    const domainSettings: {
      cognitoDomain?: { domainPrefix: string }
      customDomain?: { domainName: string; certificate: cam.Certificate }
    } = {}
    if (isProd) {
      domainSettings.cognitoDomain = {
        domainPrefix: `komptest-${ENV}`,
      }
    } else {
      domainSettings.cognitoDomain = {
        domainPrefix: `komptest-${ENV}`,
      }
    }

    pool.addDomain('kompetansekartlegging-domain-name', domainSettings)

    pool.addTrigger(cognito.UserPoolOperation.PRE_SIGN_UP, presignupTrigger)

    // AppSync Setup

    const tableNames = {
      OrganizationTable: `Organization-${this.artifactId}`,
      UserTable: `User-${this.artifactId}`,
      UserFormTable: `UserForm-${this.artifactId}`,
      QuestionTable: `Question-${this.artifactId}`,
      QuestionAnswerTable: `QuestionAnswer-${this.artifactId}`,
      FormDefinitionTable: `FormDefinition-${this.artifactId}`,
      APIKeyPermissionTable: `APIKeyPermission-${this.artifactId}`,
      GroupTable: `Group-${this.artifactId}`,
      CategoryTable: `Category-${this.artifactId}`,
      AnonymizedUserTable: `AnonymizedUser-${this.artifactId}`,
    }

    const appSync = new AppSyncTransformer(this, 'Appsync', {
      schemaPath: path.join(__dirname, '/../backend/schema.graphql'),
      tableNames: tableNames,
    })

    const tableArns: any = {}

    Object.keys(appSync.tableMap).forEach(table => {
      tableArns[table] = appSync.tableMap[table].tableArn
    })

    const ApiMap: {
      [key: string]: {
        name: string
        region: string
        endpoint: string
      }
    } = {}

    // AdminQueries Lambda setup

    const adminQueriesLambda = new lambda.Function(
      this,
      'kompetanseAdminQueries',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '/../backend/function/AdminQueries')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: Duration.seconds(25),
        logRetention: LOG_RETENTION_THREE_MONTHS,
        memorySize: 512,
        environment: {
          USERPOOL: pool.userPoolId,
          GROUP: 'admin',
          GROUP_LIST_USERS: 'groupLeader',
          ANONYMIZED_ID_ATTRIBUTE_NAME: 'custom:anonymizedID',
          TABLE_MAP: JSON.stringify(appSync.tableNameMap),
        },
        initialPolicy: [
          new iam.PolicyStatement({
            actions: [
              'cognito-idp:ListUsersInGroup',
              'cognito-idp:AdminUserGlobalSignOut',
              'cognito-idp:AdminEnableUser',
              'cognito-idp:AdminDisableUser',
              'cognito-idp:AdminRemoveUserFromGroup',
              'cognito-idp:AdminAddUserToGroup',
              'cognito-idp:AdminListGroupsForUser',
              'cognito-idp:AdminGetUser',
              'cognito-idp:AdminConfirmSignUp',
              'cognito-idp:AdminDeleteUser',
              'cognito-idp:AdminUpdateUserAttributes',
              'cognito-idp:ListUsers',
              'cognito-idp:ListGroups',
              'dynamodb:Query',
              'dynamodb:UpdateItem',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
            ],
            effect: iam.Effect.ALLOW,
            resources: [
              pool.userPoolArn,
              tableArns['UserFormTable'],
              `${tableArns['UserFormTable']}/index/*`,
              tableArns['QuestionAnswerTable'],
              `${tableArns['QuestionAnswerTable']}/index/*`,
              tableArns['UserTable'],
              `${tableArns['UserTable']}/index/*`,
              tableArns['AnonymizedUserTable'],
              `${tableArns['AnonymizedUserTable']}/index/*`,
            ],
          }),
        ],
      }
    )

    // ExternalAPI Lambda Setup

    const externalApiStatement = new iam.PolicyStatement({
      actions: [
        'dynamodb:Get*',
        'dynamodb:BatchGetItem',
        'dynamodb:List*',
        'dynamodb:Describe*',
        'dynamodb:Scan',
        'dynamodb:Query',
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        tableArns['UserFormTable'],
        `${tableArns['UserFormTable']}/index/*`,
        tableArns['GroupTable'],
        `${tableArns['GroupTable']}/index/*`,
        tableArns['UserTable'],
        `${tableArns['GroupTable']}/index/*`,
        tableArns['QuestionTable'],
        `${tableArns['QuestionTable']}/index/*`,
        tableArns['QuestionAnswerTable'],
        `${tableArns['QuestionAnswerTable']}/index/*`,
        tableArns['CategoryTable'],
        `${tableArns['CategoryTable']}/index/*`,
        tableArns['FormDefinitionTable'],
        `${tableArns['FormDefinitionTable']}/index/*`,
        tableArns['APIKeyPermissionTable'],
        `${tableArns['APIKeyPermissionTable']}/index/*`,
        tableArns['AnonymizedUserTable'],
        `${tableArns['AnonymizedUserTable']}/index/*`,
      ],
    })

    const externalAPICognitoStatement = new iam.PolicyStatement({
      actions: [
        'cognito-identity:Describe*',
        'cognito-identity:Get*',
        'cognito-identity:List*',
        'cognito-idp:Describe*',
        'cognito-idp:AdminGetDevice',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminList*',
        'cognito-idp:List*',
        'cognito-sync:Describe*',
        'cognito-sync:Get*',
        'cognito-sync:List*',
        'iam:ListOpenIdConnectProviders',
        'iam:ListRoles',
        'sns:ListPlatformApplications',
      ],
      effect: iam.Effect.ALLOW,
      resources: [pool.userPoolArn],
    })

    const externalAPILambda = new lambda.Function(
      this,
      'kompetanseExternalApiLambda',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '/../backend/function/externalAPI')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        environment: {
          USERPOOL: pool.userPoolId,
          TABLE_MAP: JSON.stringify(appSync.tableNameMap),
        },
        initialPolicy: [externalApiStatement, externalAPICognitoStatement],
        memorySize: 1024,
        timeout: Duration.seconds(25),
        logRetention: LOG_RETENTION_THREE_MONTHS,
      }
    )

    // CreateExcel Setup
    const excelEnabled = EXCEL

    if (excelEnabled) {
      const excelBucket = new s3.Bucket(this, 'excelBucket', {
        lifecycleRules: [{ expiration: Duration.days(1) }],
      })

      const excelStatement = new iam.PolicyStatement({
        actions: [
          'dynamodb:Get*',
          'dynamodb:BatchGetItem',
          'dynamodb:List*',
          'dynamodb:Describe*',
          'dynamodb:Scan',
          'dynamodb:Query',
          's3:*',
          's3:PutObject',
          's3:PutObjectAcl',
        ],
        effect: iam.Effect.ALLOW,
        resources: [
          tableArns['UserFormTable'],
          `${tableArns['UserFormTable']}/index/*`,
          tableArns['QuestionTable'],
          `${tableArns['QuestionTable']}/index/*`,
          tableArns['QuestionAnswerTable'],
          `${tableArns['QuestionAnswerTable']}/index/*`,
          tableArns['CategoryTable'],
          `${tableArns['CategoryTable']}/index/*`,
          tableArns['FormDefinitionTable'],
          `${tableArns['FormDefinitionTable']}/index/*`,
          tableArns['AnonymizedUserTable'],
          `${tableArns['AnonymizedUserTable']}/index/*`,
          excelBucket.bucketArn,
          `${excelBucket.bucketArn}/*`,
        ],
      })

      const createExcelLambda = new python.PythonFunction(
        this,
        'kompetanseCreateExcelLambda',
        {
          entry: path.join(__dirname, '/../backend/function/excelGenerator'),
          runtime: lambda.Runtime.PYTHON_3_9,
          environment: {
            SOURCE_NAME: 'KompetanseStack',
            ENV: ENV,
            USER_POOL_ID: pool.userPoolId,
            EXCEL_BUCKET: excelBucket.bucketName,
          },
          initialPolicy: [excelStatement, externalAPICognitoStatement],
          timeout: Duration.seconds(25),
          logRetention: LOG_RETENTION_THREE_MONTHS,
          memorySize: 2048,
        }
      )
      // Excel API Setup

      const excelApi = new gateway.RestApi(this, 'kompetanseExcelRestApi', {
        restApiName: 'CreateExcelAPI',
        deployOptions: {
          stageName: 'dev',
        },
      })

      const excelProxy = excelApi.root.addProxy({
        anyMethod: false,
      })
      excelProxy.addMethod(
        'ANY',
        new gateway.LambdaIntegration(createExcelLambda),
        {
          authorizer: new gateway.CognitoUserPoolsAuthorizer(
            this,
            'CognitoExcelAPI',
            {
              authorizerName: 'COGNITO',
              cognitoUserPools: [pool],
            }
          ),
          authorizationScopes: ['aws.cognito.signin.user.admin'],
        }
      )

      excelProxy.addMethod(
        'OPTIONS',
        new gateway.MockIntegration({
          passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
          requestTemplates: {
            'application/json': JSON.stringify({ statusCode: 200 }),
          },
          integrationResponses: [
            {
              statusCode: '200',
              responseParameters: {
                'method.response.header.Access-Control-Allow-Methods':
                  "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
                'method.response.header.Access-Control-Allow-Headers':
                  "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                'method.response.header.Access-Control-Allow-Origin': "'*'",
              },
            },
          ],
        }),
        {
          methodResponses: [
            {
              statusCode: '200',
              responseParameters: {
                'method.response.header.Content-Type': true,
                'method.response.header.Access-Control-Allow-Headers': true,
                'method.response.header.Access-Control-Allow-Origin': true,
                'method.response.header.Access-Control-Allow-Credentials': true,
                'method.response.header.Access-Control-Allow-Methods': true,
              },
              responseModels: {
                'application/json': gateway.Model.EMPTY_MODEL,
                'application/vnd.ms-excel': gateway.Model.EMPTY_MODEL,
              },
            },
          ],
        }
      )
      ApiMap['excelApi'] = {
        name: excelApi.restApiName,
        endpoint: excelApi.url,
        region: this.region,
      }
    }

    // CopyCatalog Setup

    const copyCatalogStatement = new iam.PolicyStatement({
      actions: [
        'dynamodb:Get*',
        'dynamodb:BatchGetItem',
        'dynamodb:List*',
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:PutItem',
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        tableArns['UserFormTable'],
        `${tableArns['UserFormTable']}/index/*`,
        tableArns['QuestionTable'],
        `${tableArns['QuestionTable']}/index/*`,
        tableArns['QuestionAnswerTable'],
        `${tableArns['QuestionAnswerTable']}/index/*`,
        tableArns['CategoryTable'],
        `${tableArns['CategoryTable']}/index/*`,
        tableArns['FormDefinitionTable'],
        `${tableArns['FormDefinitionTable']}/index/*`,
      ],
    })

    const createCopyCatalogLambda = new python.PythonFunction(
      this,
      'kompetanseCopyCatalogLambda',
      {
        entry: path.join(__dirname, '/../backend/function/copyCatalog'),
        runtime: lambda.Runtime.PYTHON_3_9,
        environment: {
          SOURCE_NAME: 'KompetanseStack',
          ENV: ENV,
          USER_POOL_ID: pool.userPoolId,
        },
        initialPolicy: [copyCatalogStatement, externalAPICognitoStatement],
        timeout: Duration.seconds(25),
        logRetention: LOG_RETENTION_THREE_MONTHS,
        memorySize: 2048,
      }
    )

    // CopyCatalog API Setup

    const copyCatalogApi = new gateway.RestApi(this, 'kompetanseRestApi', {
      restApiName: 'CreateCopyCatalogAPI',
      deployOptions: {
        stageName: 'dev',
      },
    })

    const copyCatalogProxy = copyCatalogApi.root.addProxy({
      anyMethod: false,
    })
    copyCatalogProxy.addMethod(
      'ANY',
      new gateway.LambdaIntegration(createCopyCatalogLambda),
      {
        authorizer: new gateway.CognitoUserPoolsAuthorizer(
          this,
          'CognitoCopyCatalogAPI',
          {
            authorizerName: 'COGNITO',
            cognitoUserPools: [pool],
          }
        ),
        authorizationScopes: ['aws.cognito.signin.user.admin'],
      }
    )

    copyCatalogProxy.addMethod(
      'OPTIONS',
      new gateway.MockIntegration({
        passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          'application/json': JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods':
                "'GET,POST,PUT'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Methods': true,
            },
            responseModels: {
              'application/json': gateway.Model.EMPTY_MODEL,
              'application/vnd.ms-excel': gateway.Model.EMPTY_MODEL,
            },
          },
        ],
      }
    )
    ApiMap['copyCatalogApi'] = {
      name: copyCatalogApi.restApiName,
      endpoint: copyCatalogApi.url,
      region: this.region,
    }

    // CreateUserformBatch setup

    const createUserFormStatement = new iam.PolicyStatement({
      actions: [
        'dynamodb:Put*',
        'dynamodb:Create*',
        'dynamodb:BatchWriteItem',
        'dynamodb:Get*',
        'dynamodb:BatchGetItem',
        'dynamodb:List*',
        'dynamodb:Describe*',
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:Update*',
        'dynamodb:RestoreTable*',
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        tableArns['UserFormTable'],
        `${tableArns['UserFormTable']}/index/*`,
        tableArns['QuestionTable'],
        `${tableArns['QuestionTable']}/index/*`,
        tableArns['QuestionAnswerTable'],
        `${tableArns['QuestionAnswerTable']}/index/*`,
      ],
    })

    const createUserFormPolicy = new iam.Policy(this, 'CreateUserFormPolicy', {
      statements: [createUserFormStatement],
    })

    // Add Table map from appsync to Presignup trigger
    presignupTrigger.addEnvironment(
      'TABLE_MAP',
      JSON.stringify(appSync.tableNameMap)
    )

    // CreateUserFormBatch Setup

    const batchCreateUserTimeoutSeconds = 25
    const batchCreateUser = new lambda.Function(
      this,
      'kompetansebatchuserform',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '/../backend/function/createUserformBatch')
        ),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        timeout: Duration.seconds(batchCreateUserTimeoutSeconds),
        logRetention: LOG_RETENTION_THREE_MONTHS,
      }
    )
    appSync.addLambdaDataSourceAndResolvers(
      'createUserformBatch',
      'BatchCreateUserDataSource',
      batchCreateUser
    )

    if (batchCreateUser.role)
      createUserFormPolicy.attachToRole(batchCreateUser.role)

    const batchCreateUserMetric = batchCreateUser.metricDuration({
      statistic: Stats.MAXIMUM,
      period: Duration.minutes(5),
      unit: Unit.MILLISECONDS,
    })

    const batchCreateUserAlarm = new aws_cloudwatch.Alarm(
      this,
      `${ENV}-lambda-createUserFormBatch-timeout-alarm`,
      {
        alarmName: `${ENV}-lambda-createUserFormBatch-timeout-alarm`,
        metric: batchCreateUserMetric,
        threshold: Duration.seconds(
          batchCreateUserTimeoutSeconds
        ).toMilliseconds(),
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: TreatMissingData.NOT_BREACHING,
        evaluationPeriods: 1,
        alarmDescription: `Alarm when lambda createUserFormBatch times out (${batchCreateUserTimeoutSeconds} seconds)`,
      }
    )

    const systemAdminTopic = new sns.Topic(this, `${ENV}-system-admin-topic`, {
      displayName: `Kompetansekartlegging ${ENV} systemadministrator`,
      topicName: `${ENV}-system-admin-topic`,
    })

    batchCreateUserAlarm.addAlarmAction(new SnsAction(systemAdminTopic))
    batchCreateUserAlarm.addOkAction(new SnsAction(systemAdminTopic))

    // SlackAlarmForwarder setup
    const slackWebhookSecret = new aws_secretsmanager.Secret(
      this,
      'slack_webhook_url',
      {
        secretName: 'slack_webhook_url',
        generateSecretString: {
          secretStringTemplate:
            '{"url": "value must be set using AWS Console or CLI"}',
          generateStringKey: 'url',
        },
      }
    )

    const slackAlarmForwarderPermissions = new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [slackWebhookSecret.secretArn],
    })

    const slackAlarmForwarder = new python.PythonFunction(
      this,
      'slackAlarmForwarder',
      {
        entry: path.join(__dirname, '/../backend/function/slackAlarmForwarder'),
        runtime: lambda.Runtime.PYTHON_3_9,
        initialPolicy: [slackAlarmForwarderPermissions],
        timeout: Duration.seconds(10),
        logRetention: LOG_RETENTION_THREE_MONTHS,
      }
    )

    systemAdminTopic.addSubscription(
      new aws_sns_subscriptions.LambdaSubscription(slackAlarmForwarder)
    )

    // Admin API Setup

    const adminQueryApi = new gateway.RestApi(
      this,
      'kompetanseAdminQueriesRestApi',
      {
        restApiName: 'AdminQueries',
        deployOptions: {
          stageName: 'dev',
        },
      }
    )

    const adminProxy = adminQueryApi.root.addProxy({
      anyMethod: false,
    })
    adminProxy.addMethod(
      'ANY',
      new gateway.LambdaIntegration(adminQueriesLambda),
      {
        authorizer: new gateway.CognitoUserPoolsAuthorizer(
          this,
          'CognitoAdminQueries',
          {
            authorizerName: 'COGNITO',
            cognitoUserPools: [pool],
          }
        ),
        authorizationScopes: ['aws.cognito.signin.user.admin'],
      }
    )

    adminProxy.addMethod(
      'OPTIONS',
      new gateway.MockIntegration({
        passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          'application/json': JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods':
                "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Methods': true,
            },
            responseModels: { 'application/json': gateway.Model.EMPTY_MODEL },
          },
        ],
      }
    )

    ApiMap['adminQueries'] = {
      name: adminQueryApi.restApiName,
      endpoint: adminQueryApi.url,
      region: this.region,
    }

    // External API Setup

    const externalApi = new gateway.RestApi(this, 'KompetanseExternalApi', {
      restApiName: 'externalApi',
      deployOptions: {
        stageName: isProd ? 'prod' : 'dev',
      },
    })

    const externalApiProxy = externalApi.root.addProxy({
      anyMethod: false,
    })

    const extResponseModel = externalApi.addModel('externalAPIResponseModel', {
      contentType: 'application/json',
      modelName: 'ResponseSchema',
      schema: {
        type: gateway.JsonSchemaType.OBJECT,
        required: ['response'],
        properties: {
          response: {
            type: gateway.JsonSchemaType.STRING,
          },
        },
        title: 'Response Schema',
      },
    })

    const externalApiAnyMethod = externalApiProxy.addMethod(
      'ANY',
      new gateway.LambdaIntegration(externalAPILambda),
      {
        apiKeyRequired: true,
        requestModels: {
          'application/json': extResponseModel,
        },
        methodResponses: [
          {
            statusCode: '200',
            responseModels: {
              'application/json': extResponseModel,
            },
          },
        ],
      }
    )
    externalApiProxy.addMethod(
      'OPTIONS',
      new gateway.MockIntegration({
        passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          'application/json': JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods':
                "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Methods': true,
            },
          },
        ],
      }
    )

    ApiMap['externalAPI'] = {
      name: externalApi.restApiName,
      endpoint: externalApi.url,
      region: this.region,
    }

    // configureNewOrganization setup

    const configureNewOrganizationStatement = new iam.PolicyStatement({
      actions: [
        'cognito-idp:CreateGroup',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminAddUserToGroup',
        'cognito-idp:AdminGetUser',
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:PutItem',
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        pool.userPoolArn,
        tableArns['FormDefinitionTable'],
        `${tableArns['FormDefinitionTable']}/index/*`,
        tableArns['CategoryTable'],
        `${tableArns['CategoryTable']}/index/*`,
        tableArns['QuestionTable'],
        `${tableArns['QuestionTable']}/index/*`,
      ],
    })

    const configureNewOrganizationLambda = new python.PythonFunction(
      this,
      'configureNewOrganizationLambda',
      {
        entry: path.join(
          __dirname,
          '/../backend/function/configureNewOrganization'
        ),
        runtime: lambda.Runtime.PYTHON_3_9,
        environment: {
          GROUP: 'admin',
          ENV: ENV,
          SOURCE_NAME: 'KompetanseStack',
          USER_POOL_ID: pool.userPoolId,
        },
        initialPolicy: [configureNewOrganizationStatement],
        timeout: Duration.seconds(25),
        logRetention: LOG_RETENTION_THREE_MONTHS,
        memorySize: 2048,
      }
    )

    // configureNewOrganization API Setup

    const configureNewOrganizationApi = new gateway.RestApi(
      this,
      'kompetanseConfigureNewOrganizationRestApi',
      {
        restApiName: 'configureNewOrganizationAPI',
        deployOptions: {
          stageName: 'dev',
        },
      }
    )

    const configureNewOrganizationProxy = configureNewOrganizationApi.root.addProxy(
      {
        anyMethod: false,
      }
    )
    configureNewOrganizationProxy.addMethod(
      'ANY',
      new gateway.LambdaIntegration(configureNewOrganizationLambda),
      {
        authorizer: new gateway.CognitoUserPoolsAuthorizer(
          this,
          'configureNewOrganizationAPI',
          {
            authorizerName: 'COGNITO',
            cognitoUserPools: [pool],
          }
        ),
        authorizationScopes: ['aws.cognito.signin.user.admin'],
      }
    )

    configureNewOrganizationProxy.addMethod(
      'OPTIONS',
      new gateway.MockIntegration({
        passthroughBehavior: gateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          'application/json': JSON.stringify({ statusCode: 200 }),
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Methods':
                "'GET,POST,PUT'",
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Content-Type': true,
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Credentials': true,
              'method.response.header.Access-Control-Allow-Methods': true,
            },
            responseModels: { 'application/json': gateway.Model.EMPTY_MODEL },
          },
        ],
      }
    )
    ApiMap['configureNewOrganizationApi'] = {
      name: configureNewOrganizationApi.restApiName,
      endpoint: configureNewOrganizationApi.url,
      region: this.region,
    }

    // ExternalAPI Usage plan setup

    const extUsagePlan = externalApi.addUsagePlan('externalApiUsagePlan', {
      name: 'standard',
      apiStages: [
        {
          api: externalApi,
          stage: externalApi.deploymentStage,
        },
      ],
    })

    // Backup-plan for production
    if (isProd) {
      const plan = backup.BackupPlan.daily35DayRetention(this, 'Plan')
      plan.addSelection('Selection', {
        resources: Object.keys(appSync.tableMap).map(tableName =>
          backup.BackupResource.fromDynamoDbTable(appSync.tableMap[tableName])
        ),
      })
    }
    // Outputs
    const userPoolIdOutput = new CfnOutput(this, 'aws_user_pools_id', {
      value: pool.userPoolId,
    })
    const userPoolWebClientIdOutput = new CfnOutput(
      this,
      'aws_user_pools_web_client_id',
      {
        value: appClient.userPoolClientId,
      }
    )
    const tableMapOutput = new CfnOutput(this, 'tablename_map', {
      value: JSON.stringify(appSync.tableNameMap),
    })
    const tableArnMapOutput = new CfnOutput(this, 'tableArns', {
      value: JSON.stringify(tableArns),
    })

    const createUserFormRoleNameOutput = new CfnOutput(
      this,
      'userFormRoleNameOutput',
      {
        value: batchCreateUser.role?.roleName || '',
      }
    )

    const oauthOutput = new CfnOutput(this, 'oauth', {
      value: JSON.stringify({
        domain: `${domainSettings.cognitoDomain?.domainPrefix}.auth.eu-central-1.amazoncognito.com`, //"komptest.auth.eu-central-1.amazoncognito.com"
      }),
    })

    const functionMapOutput = new CfnOutput(this, 'functionMap', {
      value: JSON.stringify(ApiMap),
    })

    const userCreateBatchOutput = new CfnOutput(this, 'outputCreateBatch', {
      value: batchCreateUser.functionName,
    })

    const apiId = new CfnOutput(this, 'outputAppSyncId', {
      value: appSync.appsyncAPI.apiId,
    })
  }
}
