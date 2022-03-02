import { Construct } from "constructs";
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as r53 from 'aws-cdk-lib/aws-route53';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as path from "path";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { readdir, readdirSync } from "fs";

interface AppsyncConstructProps {
	userpool: UserPool,
	region: string
}


export default class AppsyncConstruct extends Construct {
	constructor(scope: Construct, id: string, props: AppsyncConstructProps) {
		super(scope, id);

		const apiBucket = new s3.Bucket(scope, "APIBucket", {
			bucketName: "graphql-schema-bucket",
		});

		const schemaArn = apiBucket.arnForObjects("*");

		const schemaDeployment = new s3deploy.BucketDeployment(scope, "GraphQLSchemaDeployment", {
			destinationBucket: apiBucket,
			sources: [s3deploy.Source.asset(path.join(__dirname, "/../backend/schema")), s3deploy.Source.asset(path.join(__dirname, "/../backend/amplify-appsync-files/resolvers"))]
		});

		const api = new appsync.CfnGraphQLApi(scope, "GraphQLApi", {
			authenticationType: "AMAZON_COGNITO_USER_POOLS",
			name: "KompetanseGraphQLApi",
			userPoolConfig: {
				userPoolId: props?.userpool.userPoolId,
				awsRegion: props?.region,
				defaultAction: "ALLOW"
			},
		});

		const tableSchema = new appsync.CfnGraphQLSchema(scope, "GraphQLSchema", {
			apiId: api.attrApiId,
			definitionS3Location: apiBucket.s3UrlForObject("schema.graphql"),
		});

		const tableDefinitions = ["User", "UserForm", "Category", "FormDefinition", "Group", "Question", "QuestionAnswer", "Organization", "APIKeyPermission"];

		const dataSourceConverter: { [key: string]: string } = {}

		tableDefinitions.forEach((tablename) => {
			const dynamoTable = new dynamodb.Table(scope, `${tablename}_dynamodb`, {
				partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
				tableName: `${tablename}-${api.attrApiId}`
			});

			const serviceRole = new iam.Role(scope, `${tablename}-CdkTest-serviceRole`, {
				assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com")
			});

			serviceRole.addToPolicy(new iam.PolicyStatement({
				actions: [
					"dynamodb:BatchGetItem",
					"dynamodb:BatchWriteItem",
					"dynamodb:PutItem",
					"dynamodb:DeleteItem",
					"dynamodb:GetItem",
					"dynamodb:Scan",
					"dynamodb:Query",
					"dynamodb:UpdateItem"
				],
				resources: [
					dynamoTable.tableArn,
					`${dynamoTable.tableArn}/*`
				],
				effect: iam.Effect.ALLOW
			}));

			const dataSource = new appsync.CfnDataSource(scope, `${tablename}TableDatasource`, {
				apiId: api.attrApiId,
				name: `${tablename}Table`,
				type: "AMAZON_DYNAMODB",
				dynamoDbConfig: {
					awsRegion: props.region,
					tableName: `${tablename}-${api.attrApiId}`,
				},
				serviceRoleArn: serviceRole.roleArn
			});

			dataSourceConverter[tablename.substring(0, 1).toLocaleLowerCase() + tablename.substring(1)] = `${tablename}Table`;
		});



		// const resolvers = [
		// 	{
		// 		tableName: "Category",
		// 		fields: [
		// 			{
		// 				name: "formDefinition",
		// 				dSource: "FormDefinitionTable"
		// 			},
		// 			{
		// 				name: "questions",
		// 				dSource: "QuestionTable"
		// 			},
		// 			{
		// 				name: "organization",
		// 				dSource: "OrganizationTable"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		tableName: "FormDefinition",
		// 		fields: [
		// 			{
		// 				name: "questions",
		// 				dSource: "QuestionTable"
		// 			},
		// 			{
		// 				name: "organization",
		// 				dSource: "OrganizationTable"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		tableName: "Group",
		// 		fields: [
		// 			{
		// 				name: "organization",
		// 				dSource: "OrganizationTable"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		tableName: "Question",
		// 		fields: [
		// 			{
		// 				name: "category",
		// 				dSource: "CategoryTable"
		// 			},
		// 			{
		// 				name: "organization",
		// 				dSource: "OrganizationTable"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		tableName: "QuestionAnswer",
		// 		fields: [
		// 			{
		// 				name: "question",
		// 				dSource: "QuestionTable"
		// 			},
		// 		]
		// 	},
		// 	{
		// 		tableName: "User",
		// 		fields: [
		// 			{
		// 				name: "group",
		// 				dSource: "GroupTable"
		// 			},
		// 			{
		// 				name: "organization",
		// 				dSource: "OrganizationTable"
		// 			}
		// 		]
		// 	},
		// 	{
		// 		tableName: "UserForm",
		// 		fields: [
		// 			{
		// 				name: "formDefinition",
		// 				dSource: "FormDefinitionTable"
		// 			},
		// 			{
		// 				name: "questionAnswers",
		// 				dSource: "QuestionAnswerTable"
		// 			}
		// 		]
		// 	}
		// ]
		const resolvers: { [key: string]: { fields: { name: any, dSource: any }[] } } = {}


		const fileNames = readdirSync(path.join(__dirname, "/../backend/amplify-appsync-files/resolvers"));
		// console.log(fileNames);
		const done: string[] = []

		fileNames.forEach(fileName => {
			const [tableName, field] = fileName.split(".")
			if (done.includes(`${tableName}${field}`)) return;

			let dataSource = "";
			tableDefinitions.forEach((name) => {
				if (field.toLocaleLowerCase().includes(name.toLocaleLowerCase())) { dataSource = `${name}Table` };
			})

			if (field.includes("formBy")) {
				dataSource = "FormDefinitionTable";
			}
			console.log(tableName, dataSource);

			const apiResolver = new appsync.CfnResolver(scope, `${tableName}${field}resolver`, {
				apiId: api.attrApiId,
				fieldName: field,
				typeName: tableName,
				dataSourceName: dataSource,//dataSourceConverter[(field === "questions") ? "question" : (field === "questionAnswers") ? "questionAnswer" : field], // Feels really hacky and bad
				requestMappingTemplateS3Location: apiBucket.s3UrlForObject(`${tableName}.${field}.req.vtl`),
				responseMappingTemplateS3Location: apiBucket.s3UrlForObject(`${tableName}.${field}.res.vtl`)
			});
			done.push(`${tableName}${field}`)
		})
	}
}