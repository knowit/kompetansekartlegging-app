import boto3
import json
import datetime
from dateutil import parser

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['source_iam_user', 'source_graphql_api_id', 'source_env', 'destination_iam_user', 'destination_graphql_api_id', 'destination_env', 'source_userpool_id']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

source_graphql_api_id = parameters['source_graphql_api_id']
source_env = parameters['source_env']
source_iam_user = parameters['source_iam_user']
source_userpool_id = parameters['source_userpool_id']

destination_iam_user = parameters['destination_iam_user']
destination_graphql_api_id = parameters['destination_graphql_api_id']
destination_env = parameters['destination_env']


# tablenames = ["User", "UserForm", "Category", "FormDefinition", "Group", "Question", "QuestionAnswer", "Organization", "APIKeyPermission"]

source_client_session = boto3.Session(profile_name=source_iam_user)
destination_client_session = boto3.Session(profile_name=destination_iam_user)

source_dynamo_client = source_client_session.client('dynamodb')
destination_dynamo_client = destination_client_session.client('dynamodb')
source_cognito_client = source_client_session.client("cognito-idp")

datefilter = parser.parse('2022-02-02T12:30:00z')#(2022, 2, 2, 12, 30, 0) # 2022-02-02T12:30:00z

username_to_email = {}

cognito_response = source_cognito_client.list_users(
    UserPoolId = source_userpool_id
)
next_token = None
for user in cognito_response['Users']:
    email = [item for item in user['Attributes'] if item['Name'] == 'email'][0]['Value']
    username_to_email[user["Username"]] = email

if 'PaginationToken' in cognito_response.keys():
    next_token = cognito_response['PaginationToken']

while next_token:
    cognito_response = source_cognito_client.list_users(
        UserPoolId = source_userpool_id,
        PaginationToken = next_token
    )

    for user in cognito_response['Users']:
        email = [item for item in user['Attributes'] if item['Name'] == 'email'][0]['Value']
        username_to_email[user["Username"]] = email

    next_token = None
    if 'PaginationToken' in cognito_response.keys():
        next_token = cognito_response['PaginationToken']

orgItems = {
    "orgAdmins": "knowitobjectnet0admin",
    "orgGroupLeaders": "knowitobjectnet0groupLeader",
    "organizationID": "knowitobjectnet"
}

tables = [
    {
        "name": "User",
        "ownerAttribute": ["id"],
        "orgitems": ["orgAdmins", "orgGroupLeaders", "organizationID"]
    },
    {
        "name": "UserForm",
        "ownerAttribute": ["owner"],
        "orgitems": ["orgAdmins", "orgGroupLeaders"]
    },
    {
        "name": "Category",
        "ownerAttribute": [],
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "FormDefinition",
        "ownerAttribute": [],
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "Group",
        "ownerAttribute": ["groupLeaderUsername"],
        "orgitems": ["orgAdmins", "orgGroupLeaders", "organizationID"]
    },
    {
        "name": "Question",
        "ownerAttribute": [],
        "orgitems": ["orgAdmins", "organizationID"]
    },
    {
        "name": "QuestionAnswer",
        "ownerAttribute": ["owner"],
        "orgitems": ["orgAdmins", "orgGroupLeaders"]
    }
]

# count = 0
benchmark = datetime.datetime.now()
for table in tables:
    dynamopaginator = source_dynamo_client.get_paginator('scan')
    source_tabname = table['name'] + '-' + source_graphql_api_id + '-' + source_env
    destination_tabname = table['name'] + '-' + destination_graphql_api_id + '-' + destination_env
    dynamoresponse = dynamopaginator.paginate(
        TableName = source_tabname,
        Select = 'ALL_ATTRIBUTES',
        ReturnConsumedCapacity = 'NONE',
        ConsistentRead = True
    )
    bulkWrite = {}
    bulkWrite[destination_tabname] = []
    for page in dynamoresponse:
        for item in page['Items']:
            itemUpdatedAt = item['updatedAt']['S']
            itemCreatedAt = item['createdAt']['S']
            dateUpdatedAt = parser.parse(itemUpdatedAt)
            dateCreatedAt = parser.parse(itemCreatedAt)
            # if (dateUpdatedAt > datefilter or dateCreatedAt > datefilter):
            for attribute in table['ownerAttribute']:
                if (item[attribute]['S'] in username_to_email.keys()):
                    item[attribute] = {'S': username_to_email[item[attribute]['S']]}
            for tableItem in table["orgitems"]:
                item[tableItem] = { "S": orgItems[tableItem] }
            bulkWrite[destination_tabname].append({
                'PutRequest': {
                    'Item': item
                }
            })
            if len(bulkWrite[destination_tabname]) == 25:
                response = destination_dynamo_client.batch_write_item(RequestItems=bulkWrite)
                if "UnprocessedItems" in response.keys() and len(response["UnprocessedItems"]) > 0:
                    response = destination_dynamo_client.batch_write_item(RequestItems=response["UnprocessedItems"])
                bulkWrite[destination_tabname] = []
            # count += 1
                # destination_dynamo_client.put_item(
                #     TableName = destination_tabname,
                #     Item = item
                # )
            # destination_dynamo_client.put_item(
            #     TableName = destination_tabname,
            #     Item = item
            # )
    if len(bulkWrite[destination_tabname]) > 0: # There might be some items left to write at the end :)
        response = destination_dynamo_client.batch_write_item(RequestItems=bulkWrite)
        if "UnprocessedItems" in response.keys() and len(response["UnprocessedItems"]) > 0:
            response = destination_dynamo_client.batch_write_item(RequestItems=response["UnprocessedItems"])
        bulkWrite[destination_tabname] = []
    
    print(f"Finished migrating table {table['name']}")
print(f"Finished migrating database. Finished in: {datetime.datetime.now() - benchmark}")