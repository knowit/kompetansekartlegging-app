# Script for migrating database from one organization to multi-org
import boto3
import json


with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['source_iam_user', 'destination_iam_user', 'destination_graphql_api_id', 'destination_env']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

# source_graphql_api_id = 'uzksv2pimzhptdrxsv2igytjvi'
# source_env = 'prod'
source_graphql_api_id = '3hic5nngffevtfafcd62sdoece'
source_env = 'dev'
source_iam_user = parameters['source_iam_user']

destination_iam_user = parameters['destination_iam_user']
destination_graphql_api_id = parameters['destination_graphql_api_id']
destination_env = parameters['destination_env']

source_session = boto3.Session(profile_name=source_iam_user)
destination_session = boto3.Session(profile_name=destination_iam_user)

source_dynamo_client = source_session.client('dynamodb')
destination_dynamo_client = destination_session.client('dynamodb')


orgItems = {
    "orgAdmins": "knowitobjectnet0admin",
    "orgGroupLeaders": "knowitobjectnet0groupLeader",
    "organizationID": "knowitobjectnet"
}

tables = [
    {
        "name": "User",
        "orgitems": ["orgAdmins", "orgGroupLeaders", "organizationID"]
    },
    {
        "name": "UserForm",
        "orgitems": ["orgAdmins", "orgGroupLeaders"]
    },
    {
        "name": "Category",
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "FormDefinition",
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "Group",
        "orgitems": ["orgAdmins", "orgGroupLeaders", "organizationID"]
    },
    {
        "name": "Question",
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "QuestionAnswer",
        "orgitems": ["orgAdmins", "orgGroupLeaders"]
    }
]

for table in tables:
    dynamopaginator = source_dynamo_client.get_paginator('scan')
    source_tabname = table["name"] + '-' + source_graphql_api_id + '-' + source_env
    destination_tabname = table["name"] + '-' + destination_graphql_api_id + '-' + destination_env
    dynamoresponse = dynamopaginator.paginate(
        TableName = source_tabname,
        Select = 'ALL_ATTRIBUTES',
        ReturnConsumedCapacity = 'NONE',
        ConsistentRead = True
    )
    for page in dynamoresponse:
        for item in page['Items']:
            # item['orgAdmins'] = 'knowitobjectnet0admin'
            # item['orgGroupLeaders'] = 'knowitobjectnet0groupLeader'
            # item['organizationID'] = 'knowitobjectnet'
            for tableItem in table["orgitems"]:
                item[tableItem] = { "S": orgItems[tableItem] }
            destination_dynamo_client.put_item(
                TableName = destination_tabname,
                Item = item
            )