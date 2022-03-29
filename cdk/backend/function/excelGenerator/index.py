import boto3
from openpyxl import Workbook
from openpyxl.chart.radar_chart import RadarChart

book = Workbook()
dataSheet = book.create_sheet("data")
dataSheet.merge_cells("A1:C1")
dataSheet.merge_cells("A2:C2")
dataSheet.col
for row in range(3, 20):
    for col in range(3, 20):
        dataSheet.cell(row, col, row*col)

from os import environ

db_client = boto3.client("dynamodb")
cog_client = boto3.client("cognito-idp")
s3_client = boto3.client("s3")

env = "ksandbox"#environ.get("ENV")
sourceName = "KompetanseStack"#environ.get("SOURCE_NAME")
userPoolId = "KompetanseStack"#environ.get("USER_POOL_ID")

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
        UserPoolId=userPoolId
    )
    next_token = None
    if ("PaginationToken" in userRes.keys()):
        next_token = userRes["PaginationToken"]
    while next_token:
        userRes = cog_client.list_users(
            UserPoolId=userPoolId,
            PaginationToken=next_token
        )
        next_token = None
        if ("PaginationToken" in userRes.keys()):
            next_token = userRes["PaginationToken"]

    return formDefs, categories, questions

def handler(event, context):
    pass

"""
TODO: Write the rest of the code.
TODO: Figure out how to send an Excel file from Lambda :)
"""