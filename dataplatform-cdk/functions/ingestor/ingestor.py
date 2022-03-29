import boto3
import json
import pandas
from os import environ

db_client = boto3.client("dynamodb")
cog_client = boto3.client("cognito-idp")
s3_client = boto3.client("s3")

env = "ksandbox"#environ.get("ENV")
sourceName = "KompetanseStack"#environ.get("SOURCE_NAME")

# tables = ["UserForm", "QuestionAnswer", "Organization", "FormDefinition", "Category", "Question"]

formDefTable = f"FormDefinition-{sourceName}-{env}"
categoryTable = f"Category-{sourceName}-{env}"
questionTable = f"Question-{sourceName}-{env}"
userFormTable = f"UserForm-{sourceName}-{env}"
questionAnswerTable = f"QuestionAnswer-{sourceName}-{env}"

def fetch_org_data(orgid):
    formDefsResponse = db_client.query(
            TableName=formDefTable,
            IndexName="byOrganizationByCreatedAt",
            KeyConditionExpression="organizationID = :org",
            ExpressionAttributeValues={":org": {"S": orgid}},
            Select="ALL_ATTRIBUTES"
        )
    formDefs = []
    for item in formDefsResponse["Items"]:
        attributes = {}
        for key in item.keys():
            attributes[key] = item[key]['S']
        # print(attributes)
        formDefs.append(attributes)

    catResponse = db_client.query(
        TableName=categoryTable,
        IndexName="byFormDefinition",
        KeyConditionExpression="formDefinitionID = :formDef",
        ExpressionAttributeValues={":formDef": {"S": formDefs[0]["id"]}},
    )
    
    categories = []
    for item in catResponse["Items"]:
        attributes = {}
        for key in item.keys():
            attributes[key] = item[key]['S'] if 'S' in item[key].keys() else item[key]['N'] 
        # print(attributes)
        categories.append(attributes)

    questionResponse = db_client.query(
        TableName=questionTable,
        IndexName="byFormDefinition",
        KeyConditionExpression="formDefinitionID = :formDef",
        ExpressionAttributeValues={":formDef": {"S": formDefs[0]["id"]}},
    )
    
    questions = []
    for item in questionResponse["Items"]:
        attributes = {}
        for key in item.keys():
            attributes[key] = item[key]['S'] if 'S' in item[key].keys() else item[key]['N'] 
        # print(attributes)
        questions.append(attributes)

    # print(questions)

    userRes = cog_client.list_users(
        UserPoolId=""
    )

    return formDefs, categories, questions
    


def handler(event, context):
    formDefs = fetch_org_data("knowitobjectnet")
    # print(formDefs)

handler("","")