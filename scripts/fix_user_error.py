import boto3
import json
import csv
###
#  TO USE: From AWS Console, search in QuestionAnswer for the user with wrong Org and download the result as csv (or select and download selection)
#  Copy CSV file to script directory 
#  SET csvfilename to the result filename
#  Run Script
#  In AWS Console, change orgAdmins and orgGroupLeaders to correct org for user in UserForm table
#  In Cognito, add user to correct org groups and change custom:OrganizationID to correct org 
###


with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['destination_iam_user', 'destination_graphql_api_id', 'destination_env']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

correct_org = ""


destination_iam_user = parameters['destination_iam_user']
destination_graphql_api_id = parameters['destination_graphql_api_id']
destination_env = parameters['destination_env']


tablenames = ["UserForm", "QuestionAnswer"]

destination_client_session = boto3.Session(profile_name=destination_iam_user)
destination_dynamo_client = destination_client_session.client('dynamodb')

csvfilename = ""
f = open(csvfilename)
c = csv.reader(f)
hrow  = ""
items = []
first = True
for row in c:
    if first: 
        first = False
        hrow = row
        continue
    items.append(row)

# print(items)
dynamoItems = []
floatingHeaders = ['knowledge', 'motivation', 'customScaleValue']

for item in items:
    obj = {}
    for i in range(0, len(hrow)):
        if item[i] == '':
            continue
        if hrow[i] == "orgAdmins":
            obj[hrow[i]] = {'S':f'{correct_org}0admin'}
        elif hrow[i] == "orgGroupLeaders":
            obj[hrow[i]] = {'S':f'{correct_org}0groupLeader'}
        else:
            if hrow[i] in floatingHeaders:
                obj[hrow[i]] = {'N': item[i]}
            else:
                obj[hrow[i]] = {'S': item[i]}
    # dynamoItems.append(obj)
    destination_dynamo_client.put_item(
        TableName=f'QuestionAnswer-{destination_graphql_api_id}-{destination_env}',
        Item=obj)
    # print(obj)
print("finished")