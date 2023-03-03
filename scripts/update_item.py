import boto3
import json

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)


parameter_keys = ['destination_iam_user', 'destination_graphql_api_id', 'destination_env']

destination_iam_user = parameters['destination_iam_user']
destination_graphql_api_id = parameters['destination_graphql_api_id']
destination_env = parameters['destination_env']

destination_client_session = boto3.Session(profile_name=destination_iam_user)

destination_dynamo_client = destination_client_session.resource('dynamodb')

table_name = destination_dynamo_client.Table(f"Organization-KompetanseStack-{destination_env}")
table_name.update_item(
    Key={"id": "knowitobjectnet"},
    UpdateExpression="SET identifierAttribute = :s",
    ExpressionAttributeValues={":s": "Knowit Objectnet AS"},
    ReturnValues = "UPDATED_NEW"
)