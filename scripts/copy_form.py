import datetime as dt
import json
import uuid
import boto3
import argparse

def scan(client, tablename, filterexpression, filterattributes=None, filtervalues=None):
    items = []
    res = {}
    keywordargs = {}
    if filterattributes != None:
        keywordargs["ExpressionAttributeNames"] = filterattributes
    if filtervalues != None:
        keywordargs["ExpressionAttributeValues"] = filtervalues
    res = client.scan(
        TableName=tablename,
        FilterExpression=filterexpression,
        **keywordargs
    )
    for item in res["Items"]:
        items.append(item)
    
    lastkeyscanned = None 
    if "LastEvaluatedKey" in res.keys():
        lastkeyscanned = res["LastEvaluatedKey"]
    while lastkeyscanned:
        res = client.scan(
                TableName=tablename,
                FilterExpression=filterexpression,
                ExclusiveStartKey = lastkeyscanned,
                **keywordargs
        )
        for item in res["Items"]:
            items.append(item)
        
        lastkeyscanned = None 
        if "LastEvaluatedKey" in res.keys():
            lastkeyscanned = res["LastEvaluatedKey"]

    return items

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Add api_key to dynamodb.')
    parser.add_argument('--form_id', help='form_id : The unique id for the form you wish to copy', required=True)
    parser.add_argument('--new_name', help='new_name: The new name given to the copy of the formdefinition', required=True)

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    parameter_keys = ['destination_iam_user', 'destination_graphql_api_id', 'destination_env']
    if not all(key in parameters for key in parameter_keys):
        print(f"parameters.json must contain the following keys: {parameter_keys}")
        exit()
    args = parser.parse_args()

    destination_iam_user = parameters['destination_iam_user']
    print("Starting session for profile:", destination_iam_user)
    session = boto3.Session(profile_name=destination_iam_user, region_name="eu-central-1")
    client = session.client("dynamodb")

    tablePostfix = f"{parameters['destination_graphql_api_id']}-{parameters['destination_env']}"


    formdefid = args.form_id # ID of desired form definition
    newFormDefinitionName = args.new_name # Display label for new form definition

    originalFormDefinition = client.get_item(
        TableName=f"FormDefinition-{tablePostfix}",
        Key={
            "id": {
                "S": formdefid
            }
        }
    )

    print("searching through", f"Category-{tablePostfix}")
    categories = scan(client, f"Category-{tablePostfix}", f"formDefinitionID = :formdefid", filtervalues={
        ":formdefid": {"S": formdefid}
    })
    print(f"Found number of categories: {len(categories)}")

    print("searching through", f"Question-{tablePostfix}")
    questions = scan(client, tablename=f"Question-{tablePostfix}", filterexpression="formDefinitionID = :formdefid", filtervalues={
            ":formdefid": {"S": formdefid}
        })

    print(f"Found number of questions: {len(questions)}")

    print("searching through", f"UserForm-{tablePostfix}")

    userFormItems = scan(client, tablename=f"UserForm-{tablePostfix}", filterexpression="formDefinitionID = :formdefid", filtervalues={
            ":formdefid": {"S": formdefid}
        })

    userForms = {}

    for item in userFormItems:
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
        for index, id in enumerate(userFormIds[i:min(i+50, len(userFormIds))]):
            expressionValues[f":form{index}"] = {
                "S": id
            }
        userFormChunks.append(expressionValues)

    print(f"Found number of user forms: {len(userFormIds)}")

    questionAnswers = []
    print("searching through", f"QuestionAnswer-{tablePostfix}")
    for idChunk in userFormChunks: 
        expressionFilterList = ", ".join(idChunk.keys())
        expressionFilter = f"userFormID IN ({expressionFilterList})"

        qa_res = scan(client, tablename=f"QuestionAnswer-{tablePostfix}", filterexpression=expressionFilter, filtervalues=idChunk)
        questionAnswers.extend(qa_res)
        print("Found more QAs")

    print("QAs found:", len(questionAnswers))

    newFormDefinitionId = str(uuid.uuid4())

    newFormDefinition = originalFormDefinition["Item"].copy()
    newFormDefinition["copiedFrom"] = originalFormDefinition["Item"]["id"]
    newFormDefinition["id"] = {"S": newFormDefinitionId}
    newFormDefinition["label"] = {"S": newFormDefinitionName}
    newFormDefinition["createdAt"] = {"S": "1970-01-01T00:00:00.000Z"}


    categoryID_map = {}
    newCategories = []
    for category in categories:
        newCategoryID = str(uuid.uuid4())
        categoryID_map[category["id"]["S"]] = newCategoryID
        newCategory = category.copy()
        newCategory["formDefinitionID"] = {"S": newFormDefinitionId}
        newCategory["copiedFrom"] = category["id"]
        newCategory["id"] = {"S": newCategoryID}
        newCategories.append(newCategory)


    questionID_map = {}
    newQuestions = []
    for question in questions:
        newQuestionID = str(uuid.uuid4())
        questionID_map[question["id"]["S"]] = newQuestionID
        newQuestion = question.copy()
        newQuestion["formDefinitionID"] = {"S": newFormDefinitionId}
        newQuestion["categoryID"] = {"S": categoryID_map[question["categoryID"]["S"]]}
        newQuestion["copiedFrom"] = question["id"]
        newQuestion["id"] = {"S": newQuestionID}
        newQuestions.append(newQuestion)

    userFormId_map = {}

    newUserForms = []
    for userFormKey in userForms.keys():
        userForm = userForms[userFormKey]
        newUserFormID = str(uuid.uuid4())
        userFormId_map[userForm["id"]["S"]] = newUserFormID
        newUserForm = userForm.copy()
        newUserForm["formDefinitionID"] = {"S": newFormDefinitionId}
        newUserForm["id"] = {"S": newUserFormID}
        newUserForms.append(newUserForm)

    newQuestionAnswers = []
    for questionAnswer in questionAnswers:
        newQuestionAnswer = questionAnswer.copy()
        userFormId = questionAnswer["userFormID"]["S"]
        questionId = questionAnswer["questionID"]["S"]
        newQuestionAnswer["userFormID"] = {"S": userFormId_map[userFormId]}
        if questionId in questionID_map.keys():
            newQuestionAnswer["questionID"] = {"S": questionID_map[questionId]}
        newQuestionAnswer["id"] = {"S": str(uuid.uuid4())}
        newQuestionAnswers.append(newQuestionAnswer)

    print(f"New categories: {len(newCategories)}")
    print(f"New questions: {len(newQuestions)}")
    print(f"New user forms: {len(newUserForms)}")
    print(f"New question answers: {len(newQuestionAnswers)}")


    print("Writing new FormDefinition...")
    response = client.transact_write_items(
        TransactItems=[{
            "Put": {
                "Item": newFormDefinition,
                "TableName": f"FormDefinition-{tablePostfix}"
            }
        }]
    )

    print("Writing new Categories...")
    newCategoryBatches = []
    for i in range(0, len(newCategories), 25):
        batchCategories = newCategories[i:min(i+25, len(newCategories))]
        batch = [{
            "Put": {
                "Item": cat,
                "TableName": f"Category-{tablePostfix}"
            }
            } for cat in batchCategories]
        newCategoryBatches.append(batch)
        
    for batch in newCategoryBatches:
        response = client.transact_write_items(
            TransactItems=batch
        )

    print("Writing new Questions...")
    newQuestionBatches = []
    for i in range(0, len(newQuestions), 25):
        batchQuestions = newQuestions[i:min(i+25, len(newQuestions))]
        batch = [{
            "Put": {
                "Item": quest,
                "TableName": f"Question-{tablePostfix}"
            }
            } for quest in batchQuestions]
        newQuestionBatches.append(batch)
        
    for batch in newQuestionBatches:
        response = client.transact_write_items(
            TransactItems=batch
        )
        
    print("Writing new User Forms...")
    newUserFormBatches = []
    for i in range(0, len(newUserForms), 25):
        batchUserForms = newUserForms[i:min(i+25, len(newUserForms))]
        batch = [{
            "Put": {
                "Item": uform,
                "TableName": f"UserForm-{tablePostfix}"
            }
            } for uform in batchUserForms]
        newUserFormBatches.append(batch)
        
    for batch in newUserFormBatches:
        response = client.transact_write_items(
            TransactItems=batch
        )

    print("Writing new Question Answers... (This will take time...)")
    newQuestionAnswerBatches = []
    for i in range(0, len(newQuestionAnswers), 25):
        batchQuestionAnswers = newQuestionAnswers[i:min(i+25, len(newQuestionAnswers))]
        batch = [{
            "Put": {
                "Item": uform,
                "TableName": f"QuestionAnswer-{tablePostfix}"
            }
            } for uform in batchQuestionAnswers]
        newQuestionAnswerBatches.append(batch)
        
    for batch in newQuestionAnswerBatches:
        response = client.transact_write_items(
            TransactItems=batch
        )
        
    print(f"Finished copying form! New FormDef ID is: {newFormDefinitionId}")