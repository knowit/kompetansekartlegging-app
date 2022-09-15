import datetime as dt
import json
import uuid
import boto3


with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['destination_iam_user', 'destination_graphql_api_id', 'destination_env']
if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: {parameter_keys}")
    exit()

destination_iam_user = parameters['destination_iam_user']
print("Starting session for profile:", destination_iam_user)
session = boto3.Session(profile_name=destination_iam_user, region_name="eu-central-1")
client = session.client("dynamodb")

tablePostfix = f"{parameters['destination_graphql_api_id']}-{parameters['destination_env']}"

formdefid = "8b1e2be3-0ff6-438c-9cfb-97f1f423a81a"

originalFormDefinition = client.get_item(
    TableName=f"FormDefinition-{tablePostfix}",
    Key={
        "id": {
            "S": formdefid
        }
    }
)

print("searching through", f"Category-{tablePostfix}")
categories_res = client.scan(
    TableName=f"Category-{tablePostfix}",
    FilterExpression="#formDefinitionID = :formdefid",
    ExpressionAttributeNames={
        "#formDefinitionID": "formDefinitionID"
    },
    ExpressionAttributeValues= {
        ":formdefid": {"S": formdefid}
    }
)

print("Found stuffs")
print("searching through", f"Question-{tablePostfix}")
question_res = client.scan(
    TableName=f"Question-{tablePostfix}",
    FilterExpression="#formDefinitionID = :formdefid",
    ExpressionAttributeNames={
        "#formDefinitionID": "formDefinitionID"
    },
    ExpressionAttributeValues= {
        ":formdefid": {"S": formdefid}
    }
)
print("Found stuffs")
print("searching through", f"UserForm-{tablePostfix}")
userForm_res = client.scan(
    TableName=f"UserForm-{tablePostfix}",
    FilterExpression="#formDefinitionID = :formdefid",
    ExpressionAttributeNames={
        "#formDefinitionID": "formDefinitionID"
    },
    ExpressionAttributeValues= {
        ":formdefid": {"S": formdefid}
    }
)

userForms = {}

for item in userForm_res["Items"]:
    if item["owner"]["S"] in userForms.keys():
        newItemCreatedAt = item["createdAt"]["S"][:-1]
        oldItemCreatedAt = userForms[item["owner"]["S"]]["createdAt"]["S"][:-1]
        if dt.datetime.fromisoformat(newItemCreatedAt) > dt.datetime.fromisoformat(oldItemCreatedAt):
            userForms[item["owner"]["S"]] = item
    else:
        userForms[item["owner"]["S"]] = item

userFormIds = [userForms[userFormKey]['id']['S'] for userFormKey in userForms.keys()]

userFormChunks = []
for i in range(0, len(userFormIds), 50):
    expressionValues = {}
    for index, id in enumerate(userFormIds[i:min(i+50, len(userFormIds)-1)]):
        expressionValues[f":form{index}"] = {
            "S": id
        }
    userFormChunks.append(expressionValues)


questionAnswers = []
print("Found stuffs")
print("searching through", f"QuestionAnswer-{tablePostfix}")
for idChunk in userFormChunks: 
    expressionFilterList = ", ".join(idChunk.keys())
    expressionFilter = f"userFormID IN ({expressionFilterList})"

    qa_res = client.scan(
        TableName=f"QuestionAnswer-{tablePostfix}",
        FilterExpression=expressionFilter,
        ExpressionAttributeValues=idChunk
    )
    questionAnswers.extend(qa_res["Items"])
    lastkeyscanned = None 
    if "LastEvaluatedKey" in qa_res.keys():
        lastkeyscanned = qa_res["LastEvaluatedKey"]
    while lastkeyscanned:
        qa_res = client.scan(
            TableName=f"QuestionAnswer-{tablePostfix}",
            FilterExpression=expressionFilter,
            ExclusiveStartKey = lastkeyscanned,
            ExpressionAttributeValues=idChunk
        )
        lastkeyscanned = None 
        questionAnswers.extend(qa_res["Items"])
        if "LastEvaluatedKey" in qa_res.keys():
            lastkeyscanned = qa_res["LastEvaluatedKey"]
    print("Found more QAs")

print("QAs found:", len(questionAnswers))

newFormDefinitionId = uuid.uuid4()
# TODO: Give new IDs to items + new name to form?
