import json
import profile
import random
import uuid

import boto3

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ["destination_userpool_id",
                  'destination_iam_user', 'destination_env']

if not all(key in parameters for key in parameter_keys):
    print(
        f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

profile_name = parameters["destination_iam_user"]
env = parameters["destination_env"]
userpoolId = parameters["destination_userpool_id"]

session = boto3.Session(profile_name=profile_name)
dynamoclient = session.client("dynamodb")
cognitoclient = session.client("cognito-idp")

orgid = "testorg"

dynamoclient.put_item(
    TableName=f"Organization-KompetanseStack-{env}",
    Item={
        "id": {"S": orgid},
        "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
        "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
        "identifierAttribute": {"S": "testorg"},
        "orgname": {"S": "Test organisasjon"}
    }
)

apiKeyPermission = {
    "id": {"S": str(uuid.uuid4())},
    "APIKeyHashed": {"S": "some_random_value"},
    "organizationID": {"S": orgid}
}

dynamoclient.put_item(
    TableName=f"APIKeyPermission-KompetanseStack-{env}",
    Item=apiKeyPermission
)

formDefID = str(uuid.uuid4())
formDefinition = {
    "id": {"S": formDefID},
    "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
    "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
    "label": {"S": "Test katalog"},
    "organizationID": {"S": orgid},
    "orgAdmins": {"S": f"{orgid}0admin"},
    "sortKeyConstant": {"S": "formDefinitionConstant"}
}

categories = [
    {
        "id": {"S": str(uuid.uuid4())},
        "text": {"S": "Category 1"},
        "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
        "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
        "description": {"S": "Some description"},
        "organizationID": {"S": orgid},
        "orgAdmins": {"S": f"{orgid}0admin"},
        "formDefinitionID": {"S": formDefID},
        "index": {"N": "1"}
    },
    {
        "id": {"S": str(uuid.uuid4())},
        "text": {"S": "Category 2"},
        "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
        "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
        "description": {"S": "Some description"},
        "organizationID": {"S": orgid},
        "orgAdmins": {"S": f"{orgid}0admin"},
        "index": {"N": "2"},
        "formDefinitionID": {"S": formDefID}
    },
    {
        "id": {"S": str(uuid.uuid4())},
        "text": {"S": "Category 3"},
        "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
        "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
        "description": {"S": "Some description"},
        "organizationID": {"S": orgid},
        "orgAdmins": {"S": f"{orgid}0admin"},
        "index": {"N": "3"},
        "formDefinitionID": {"S": formDefID}
    }
]
numberOfQuestions = [10, 12, 9]
questions = []

currentQuestion = 1
for catindex, category in enumerate(categories):
    for qi in range(numberOfQuestions[catindex]):
        question = {
            "id": {"S": str(uuid.uuid4())},
            "categoryID": {"S": category["id"]["S"]},
            "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
            "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
            "formDefinitionID": {"S": formDefID},
            "index": {"N": str(currentQuestion)},
            "text": {"S": f"Test Spørsmål nr {currentQuestion}"},
            "type": {"S": "knowledgeMotivation"},
            "topic": {"S": f"Test spørsmål {currentQuestion}"},
            "organizationID": {"S": orgid},
            "orgAdmins": {"S": f"{orgid}0admin"}

        }
        questions.append(question)
        currentQuestion += 1

questions.append({
    "id": {"S": str(uuid.uuid4())},
    "categoryID": {"S": category["id"]["S"]},
    "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
    "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
    "formDefinitionID": {"S": formDefID},
    "index": {"N": str(currentQuestion)},
    "text": {"S": f"Test Spørsmål nr {currentQuestion}"},
    "type": {"S": "customScaleLabels"},
    "topic": {"S": "Test Custom Label"},
    "scaleEnd": {"S": "Det er på tide!"},
    "scaleMiddle": {"S": ""},
    "scaleStart": {"S": "Helt uaktuelt"},
    "organizationID": {"S": orgid},
    "orgAdmins": {"S": f"{orgid}0admin"}
})

dynamoclient.put_item(
    TableName=f"FormDefinition-KompetanseStack-{env}",
    Item=formDefinition
)

for category in categories:
    dynamoclient.put_item(
        TableName=f"Category-KompetanseStack-{env}",
        Item=category
    )

for question in questions:
    dynamoclient.put_item(
        TableName=f"Question-KompetanseStack-{env}",
        Item=question
    )

try:
    cognitoclient.create_group(
        GroupName=orgid,
        UserPoolId=userpoolId
    )
    cognitoclient.create_group(
        GroupName=f"{orgid}0admin",
        UserPoolId=userpoolId
    )
    cognitoclient.create_group(
        GroupName=f"{orgid}0groupLeader",
        UserPoolId=userpoolId
    )
except:
    print("Could not create cognito groups, either due to missing permissions or they already exists")

testUsers = ["tester1@test", "tester2@test", "tester3@test"]

groupId = str(uuid.uuid4())
group = {
    "id": {"S": groupId},
    "groupLeaderUsername": {"S": "tester1@test"},
    "organizationID": {"S": orgid},
    "orgAdmins": {"S": f"{orgid}0admin"},
    "orgGroupLeaders": {"S": f"{orgid}0groupLeader"},
}

dynamoclient.put_item(
    TableName=f"Group-KompetanseStack-{env}",
    Item=group
)

for user in testUsers:
    try:
        cognitoclient.admin_create_user(
            UserPoolId=userpoolId,
            Username=user,
            UserAttributes=[
                {"Name": "custom:OrganizationID", "Value": orgid},
                {"Name": "name", "Value": user}
            ],
            MessageAction="SUPPRESS",
        )
    except:
        print(
            "Could not create user", user
        )
    try:
        cognitoclient.admin_add_user_to_group(
            UserPoolId=userpoolId,
            Username=user,
            GroupName=orgid
        )
    except:
        print("Could not add user", user,
              "to testorg group, either due to them already being in it or some other error")
    cognitoclient.admin_set_user_password(
        UserPoolId=userpoolId,
        Username=user,
        Password="tester123",
        Permanent=True
    )
    userInput = {
        "id": {"S": user},
        "groupID": {"S": groupId},
        "organizationID": {"S": orgid},
        "orgAdmins": {"S": f"{orgid}0admin"},
        "orgGroupLeaders": {"S": f"{orgid}0groupLeader"},
    }
    dynamoclient.put_item(
        TableName=f"User-KompetanseStack-{env}",
        Item=userInput
    )

    userformId = str(uuid.uuid4())
    userform = {
        "id": {"S": userformId},
        "formDefinitionID": {"S": formDefID},
        "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
        "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
        "orgAdmins": {"S": f"{orgid}0admin"},
        "orgGroupLeaders": {"S": f"{orgid}0groupLeader"},
        "owner": {"S": user}
    }
    questionAnswers = []
    for question in questions:
        qa = {
            "id": {"S": str(uuid.uuid4())},
            "createdAt": {"S": "2022-10-10T12:00:00.000Z"},
            "updatedAt": {"S": "2022-10-10T12:00:00.000Z"},
            "orgAdmins": {"S": f"{orgid}0admin"},
            "orgGroupLeaders": {"S": f"{orgid}0groupLeader"},
            "owner": {"S": user},
            "userFormID": {"S": userformId},
            "questionID": {"S": question["id"]["S"]}
        }

        if question["type"]["S"] == "knowledgeMotivation":
            qa["knowledge"] = {"N": str(random.uniform(0.0, 5.0))}
            qa["motivation"] = {"N": str(random.uniform(0.0, 5.0))}
        else:
            qa["customScaleValue"] = {"N": str(random.uniform(0.0, 5.0))}
        questionAnswers.append(qa)

    dynamoclient.put_item(
        TableName=f"UserForm-KompetanseStack-{env}",
        Item=userform
    )
    for qa in questionAnswers:
        dynamoclient.put_item(
            TableName=f"QuestionAnswer-KompetanseStack-{env}",
            Item=qa
        )
