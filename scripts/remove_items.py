# Script for removing all the items from dynamodb in the production environment

import boto3
import json


with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)


parameter_keys = ['destination_iam_user', 'destination_graphql_api_id', 'destination_env']

destination_iam_user = parameters['destination_iam_user']
destination_graphql_api_id = parameters['destination_graphql_api_id']
destination_env = parameters['destination_env']

tablenames = ["User", "UserForm", "Category", "FormDefinition", "Group", "Question", "QuestionAnswer"]

destination_client_session = boto3.Session(profile_name=destination_iam_user)

destination_dynamo_client = destination_client_session.resource('dynamodb')

def truncateTable(tableName):
    table = destination_dynamo_client.Table(tableName)

    #get the table keys
    tableKeyNames = [key.get("AttributeName") for key in table.key_schema]

    #Only retrieve the keys for each item in the table (minimize data transfer)
    projectionExpression = ", ".join('#' + key for key in tableKeyNames)
    expressionAttrNames = {'#'+key: key for key in tableKeyNames}

    counter = 0
    page = table.scan(ProjectionExpression=projectionExpression, ExpressionAttributeNames=expressionAttrNames)
    with table.batch_writer() as batch:
        while page["Count"] > 0:
            counter += page["Count"]
            # Delete items in batches
            for itemKeys in page["Items"]:
                batch.delete_item(Key=itemKeys)
            # Fetch the next page
            if 'LastEvaluatedKey' in page:
                page = table.scan(
                    ProjectionExpression=projectionExpression, ExpressionAttributeNames=expressionAttrNames,
                    ExclusiveStartKey=page['LastEvaluatedKey'])
            else:
                break

for tablename in tablenames:

    full_table_name = tablename + '-' + destination_graphql_api_id + '-' + destination_env
    truncateTable(full_table_name)