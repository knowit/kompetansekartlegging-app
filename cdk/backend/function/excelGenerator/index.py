
from io import BytesIO
import json
from tempfile import NamedTemporaryFile
import boto3
from openpyxl import Workbook
from openpyxl.styles import Alignment, PatternFill, Color, Border
from openpyxl.chart.radar_chart import RadarChart
from openpyxl.utils import get_column_letter
from openpyxl.writer.excel import save_virtual_workbook
from dateutil import parser
from datetime import datetime
import base64
# book = Workbook()
# dataSheet = book.create_sheet("data")
# dataSheet.merge_cells("A1:C1")
# dataSheet.merge_cells("A2:C2")
# dataSheet.col
# for row in range(3, 20):
#     for col in range(3, 20):
#         dataSheet.cell(row, col, row*col)

from os import environ

db_client = boto3.client("dynamodb")
cog_client = boto3.client("cognito-idp")
s3_client = boto3.client("s3")

env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")
userPoolId = environ.get("USER_POOL_ID")
bucketName = environ.get("EXCEL_BUCKET")

# tables = ["UserForm", "QuestionAnswer", "Organization", "FormDefinition", "Category", "Question"]

formDefTable = f"FormDefinition-{sourceName}-{env}"
categoryTable = f"Category-{sourceName}-{env}"
questionTable = f"Question-{sourceName}-{env}"
userFormTable = f"UserForm-{sourceName}-{env}"
questionAnswerTable = f"QuestionAnswer-{sourceName}-{env}"

def sortByCreatedAt(obj):
    return parser.parse(obj["createdAt"])

def fetch_user_answers(username, formDef):
    userFormRes = db_client.query(
        TableName=userFormTable,
        IndexName="byCreatedAt",
        KeyConditionExpression="#owner = :username",
        FilterExpression="formDefinitionID=:formdef",
        ExpressionAttributeNames= {
            "#owner": "owner"
        },
        ExpressionAttributeValues={
            ":username": {"S": username},
            ":formdef": {"S": formDef}
        },
    )
    userForms = []
    for userForm in userFormRes["Items"]:
        attributes = {}
        for key in userForm.keys():
            attributes[key] = userForm[key]['S'] if 'S' in userForm[key].keys() else userForm[key]['N']
        userForms.append(attributes)

    userForms.sort(key=sortByCreatedAt, reverse=True)
    if len(userForms) <= 0: return {"userFormId":"", "answers":{}}
    currentUserForm = userForms[0]

    answerRes = db_client.query(
        TableName=questionAnswerTable,
        IndexName="byUserForm",
        KeyConditionExpression="userFormID = :userFormId",
        ExpressionAttributeValues={
            ":userFormId": {"S": currentUserForm["id"]}
        },
    )
    answers = {}
    for answer in answerRes["Items"]:
        attributes = {}
        for key in answer.keys():
            attributes[key] = answer[key][list(answer[key].keys())[0]]# if 'S' in answer[key].keys() elif '' in answer[key].keys() answer[key]['N']
        answers[attributes["questionID"]] = attributes

    return {"userFormId": currentUserForm["id"], "answers": answers}


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

    currentFormDef = formDefs[0]["id"]

    catResponse = db_client.query(
        TableName=categoryTable,
        IndexName="byFormDefinition",
        KeyConditionExpression="formDefinitionID = :formDef",
        ExpressionAttributeValues={":formDef": {"S": currentFormDef}},
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
        Select="ALL_ATTRIBUTES",
        KeyConditionExpression="formDefinitionID = :formDef",
        ExpressionAttributeValues={":formDef": {"S": currentFormDef}},
    )

    questions = []
    for item in questionResponse["Items"]:
        attributes = {}
        for key in item.keys():
            attributes[key] = item[key]['S'] if 'S' in item[key].keys() else item[key]['N'] 
        # print(attributes)
        questions.append(attributes)

    users = []
    userRes = cog_client.list_users_in_group(
        UserPoolId=userPoolId,
        GroupName=orgid
    )
    for user in userRes["Users"]:
        attributes = {}
        for attribute in user["Attributes"]:
            attributes[attribute["Name"]] = attribute["Value"]
        user["Attributes"] = attributes
        users.append(user)

    next_token = None
    if ("NextToken" in userRes.keys()):
        next_token = userRes["NextToken"]
    while next_token:
        userRes = cog_client.list_users_in_group(
            UserPoolId=userPoolId,
            GroupName=orgid,
            NextToken=next_token
        )
        for user in userRes["Users"]:
            attributes = {}
            for attribute in user["Attributes"]:
                attributes[attribute["Name"]] = attribute["Value"]
            user["Attributes"] = attributes
            users.append(user)
        next_token = None
        if ("NextToken" in userRes.keys()):
            next_token = userRes["NextToken"]
    mappedUsers = []
    for user in users:
        userAnswers = fetch_user_answers(user["Username"], currentFormDef)
        mappedUsers.append({"username": user["Username"], "email": user["Attributes"]["email"], "answers": userAnswers["answers"], "userFormId": userAnswers["userFormId"]})

    return formDefs, categories, questions, mappedUsers

def handler(event, context):
    print(event)
    groups = event["requestContext"]["authorizer"]["claims"]["cognito:groups"].split(",")
    isAdmin = False
    orgid = ""
    print("Hello", groups)
    for group in groups:
        print(group)
        roles = group.split("0")
        if len(roles) > 1 and roles[1] == "admin":
            isAdmin = True
            orgid = roles[0]
    
    if isAdmin:
        print("User is admin")
        book = make_workbook(orgid)
        with NamedTemporaryFile(mode="w+b") as temp:
            book.save(temp.name)
            temp.seek(0)
            # stream = temp.read()
            key = f"{orgid}_report.xlsx"
            s3_client.put_object(Bucket=bucketName, Key=key, Body=temp, ACL='public-read')
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/vnd.ms-excel",
                    'Access-Control-Allow-Headers': 'Content-Type',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True
                },
                "body": f"https://{bucketName}.s3.amazonaws.com/{key}"
            }
    return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/vnd.ms-excel",
                    'Access-Control-Allow-Headers': 'Content-Type',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": True
                },
                "body": json.dumps("User is not Admin")}

def make_workbook(orgid):
    formDefs, categories, questions, users = fetch_org_data(orgid)
    book = Workbook()
    questions.sort(key=lambda x: x["categoryID"])

    data_sheet = book.active
    data_sheet.title = "data"

    aggregateSheet = book.create_sheet("Aggergates")
    # aggregateSheet.sheet_state = "hidden"

    questionBlockStart = 4 #Excel is 1 indexed... :/

    questionCategoryMap = {}
    for question in questions:
        if not question["categoryID"] in questionCategoryMap.keys():
            questionCategoryMap[question["categoryID"]] = []
        questionCategoryMap[question["categoryID"]].append(question)


    col = questionBlockStart
    # for row in range(0, len(questions)):
    grayColor = Color(rgb="000000", tint=0.6)

    cell = data_sheet.cell(1, questionBlockStart, "Kompetanse")
    cell.fill = PatternFill(patternType="solid", fgColor=grayColor)
    cell.alignment = Alignment(horizontal="center")
    data_sheet.merge_cells(start_row=1, end_row=1, start_column=questionBlockStart, end_column=questionBlockStart+len(questions)-1)

    cell = data_sheet.cell(1, questionBlockStart + len(questions), "Motivasjon")
    cell.fill = PatternFill(patternType="solid", fgColor=grayColor)
    cell.alignment = Alignment(horizontal="center")
    data_sheet.merge_cells(start_row=1, end_row=1, start_column=questionBlockStart + len(questions), end_column=questionBlockStart + len(questions) + len(questions) - 1)

    questionPositions = {}
    userStartRow = 5
    aggCol = questionBlockStart

    for category in categories:
        categoryColor = Color(rgb="AAAAFF", tint=0.2)
        questionColor = Color(rgb="AAAAFF", tint=0.5)
        cell = data_sheet.cell(2, col, category["text"])
        cell.alignment = Alignment(horizontal="center")
        cell.fill = PatternFill(patternType= "solid",fgColor=categoryColor)
        data_sheet.merge_cells(start_row=2, end_row=2, start_column=col, end_column=col + len(questionCategoryMap[category["id"]])-1)

        cell = data_sheet.cell(2, col + len(questions), category["text"])
        cell.alignment = Alignment(horizontal="center")
        cell.fill = PatternFill(patternType= "solid",fgColor=categoryColor)
        data_sheet.merge_cells(start_row=2, end_row=2, start_column=col+len(questions), end_column=col + len(questions) + len(questionCategoryMap[category["id"]])-1)
        
        cell = aggregateSheet.cell(userStartRow + 5, aggCol, category["text"])
        cell.alignment = Alignment(horizontal="center")
        cell.fill = PatternFill(patternType= "solid",fgColor=categoryColor)
        aggregateSheet.merge_cells(start_row=userStartRow + 5, end_row=userStartRow + 5, start_column=aggCol, end_column=aggCol + 3)

        cell = aggregateSheet.cell(userStartRow + 6, aggCol    , "Average")
        cell.fill = PatternFill(patternType= "solid",fgColor=grayColor)
        cell = aggregateSheet.cell(userStartRow + 6, aggCol + 1, "Median")
        cell.fill = PatternFill(patternType= "solid",fgColor=grayColor)
        cell = aggregateSheet.cell(userStartRow + 6, aggCol + 2, "Percentile (95)")
        cell.fill = PatternFill(patternType= "solid",fgColor=grayColor)
        cell = aggregateSheet.cell(userStartRow + 6, aggCol + 3, "Max")
        cell.fill = PatternFill(patternType= "solid",fgColor=grayColor)
        aggCol += 4


        for question in questionCategoryMap[category["id"]]:
            data_sheet.column_dimensions[get_column_letter(col)].width = 4
            data_sheet.column_dimensions[get_column_letter(col + len(questions))].width = 4

            cell = data_sheet.cell(3, col, question["topic"])
            cell.alignment = Alignment(text_rotation=90)
            cell.fill = PatternFill(patternType= "solid",fgColor=questionColor)
            cell.border = Border(outline=True)
            # col += 1
            cell = data_sheet.cell(3, col + len(questions), question["topic"])
            cell.alignment = Alignment(text_rotation=90)
            cell.fill = PatternFill(patternType= "solid",fgColor=questionColor) 
            cell.border = Border(outline=True)

            cell = data_sheet.cell(4, col, question["id"])
            cell.fill = PatternFill(patternType= "solid",fgColor=grayColor)
            cell.border = Border(outline=True)
            # col += 1
            cell = data_sheet.cell(4, col + len(questions), question["id"])
            cell.fill = PatternFill(patternType= "solid",fgColor=grayColor) 
            cell.border = Border(outline=True)

            questionPositions[question["id"]] = (col, col+len(questions))
            col += 1


    row = userStartRow
    for user in users:
        if not user["answers"].keys(): continue
        cell = data_sheet.cell(row, 1, user["username"])
        data_sheet.merge_cells(start_row=row, end_row=row, start_column=1, end_column=3)
        for question in questions:
            answer = user["answers"][question["id"]]
            if "knowledge" in answer.keys():
                cell = data_sheet.cell(row, questionPositions[question["id"]][0], float(answer["knowledge"]))
                cell.fill = PatternFill(patternType= "solid",fgColor=Color(rgb="AAAAFF", tint=(1 - float(answer["knowledge"])/5.0)), bgColor="aa000000")
            if "motivation" in answer.keys():
                cell = data_sheet.cell(row, questionPositions[question["id"]][1], float(answer["motivation"]))
                cell.fill = PatternFill(patternType= "solid",fgColor=Color(rgb="AAAAFF", tint=(1 - float(answer["motivation"])/5.0)))
            if "type" in question.keys() and question["type"] == "customScaleLabels":
                cell = data_sheet.cell(row, questionPositions[question["id"]][0], float(answer["customScaleValue"]))
                cell.fill = PatternFill(patternType= "solid",fgColor=Color(rgb="AAAAFF", tint=(1 - float(answer["customScaleValue"])/5.0)), bgColor="aa000000")
                cell = data_sheet.cell(row, questionPositions[question["id"]][1], float(answer["customScaleValue"]))
                cell.fill = PatternFill(patternType= "solid",fgColor=Color(rgb="AAAAFF", tint=(1 - float(answer["customScaleValue"])/5.0)))

        catCol = questionBlockStart
        aggCol = questionBlockStart
        aggregateSheet.cell(row + 7, aggCol - 1, user["username"])
        for category in categories:
            endCol = catCol + len(questionCategoryMap[category["id"]]) - 1
            aggregateSheet.cell(row + 7, aggCol, f"=AVERAGE({data_sheet.title}!${get_column_letter(catCol)}{row}:${get_column_letter(endCol)}{row})")
            aggregateSheet.cell(row + 7, aggCol + 1, f"=MEDIAN({data_sheet.title}!${get_column_letter(catCol)}{row}:${get_column_letter(endCol)}{row})")
            aggregateSheet.cell(row + 7, aggCol + 2, f"=PERCENTILE({data_sheet.title}!${get_column_letter(catCol)}{row}:${get_column_letter(endCol)}{row}, 0.95)")
            aggregateSheet.cell(row + 7, aggCol + 3, f"=MAX({data_sheet.title}!${get_column_letter(catCol)}{row}:${get_column_letter(endCol)}{row})")
            catCol += len(questionCategoryMap[category["id"]])
            aggCol += 4

        row += 1

    aggregateSheet.cell(3, 3, f"Average")
    aggregateSheet.cell(4, 3, f"Median")
    for question in questions:
        knowledgePos = questionPositions[question['id']][0]
        motivationPos = questionPositions[question['id']][1]
        aggregateSheet.cell(2, knowledgePos, f"{question['text']}")
        aggregateSheet.cell(2, motivationPos, f"{question['text']}")
        aggregateSheet.cell(3, knowledgePos, f"=AVERAGE({data_sheet.title}!${get_column_letter(knowledgePos)}{userStartRow}:${get_column_letter(knowledgePos)}{row})")
        aggregateSheet.cell(3, motivationPos, f"=AVERAGE({data_sheet.title}!${get_column_letter(motivationPos)}{userStartRow}:${get_column_letter(motivationPos)}{row})")
        aggregateSheet.cell(4, knowledgePos, f"=MEDIAN({data_sheet.title}!${get_column_letter(knowledgePos)}{userStartRow}:${get_column_letter(knowledgePos)}{row})")
        aggregateSheet.cell(4, motivationPos, f"=MEDIAN({data_sheet.title}!${get_column_letter(motivationPos)}{userStartRow}:${get_column_letter(motivationPos)}{row})")

    chartSheet = book.create_sheet("Charts")
    return book
    # book.save("test.xlsx")

# result = handler({
#      'requestContext': {'resourceId': 'dapfk0rz91',
#  'authorizer': {'claims': {'sub': '2eba70a5-76cb-4a37-945d-1fd26cc6b138',
#  'cognito:groups': 'knowitobjectnet0groupLeader,knowitobjectnet0admin,knowitobjectnet,admin',}}}
# }, "")
# print(result)

# f = open("t.xlsx", "w")
# f.write(str(result["body"]))
# f.close()


# later = datetime.now()
# make_workbook("knowitobjectnet")
# print(datetime.now() - later)
"""
TODO: Write the rest of the code.
TODO: Figure out how to send an Excel file from Lambda :)
"""