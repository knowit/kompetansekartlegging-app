from datetime import datetime
from datetime import timezone
import boto3
import json
import requests
import uuid
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Add default catalog to organization")
    parser.add_argument('organization_ID', help='organizationID : This is a string which uniquely identifies the organization')

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    parameter_keys = ['api_key', 'destination_iam_user', 'destination_graphql_api_id', 'destination_env']

    if not all(key in parameters for key in parameter_keys):
        print(f"parameters.json must contain the following keys: f{parameter_keys}")
        exit()

    api_key=parameters['api_key']
    destination_iam_user = parameters['destination_iam_user']
    destination_graphql_api_id = parameters['destination_graphql_api_id']
    destination_env = parameters['destination_env']

    args = parser.parse_args()
    organization_ID = args.organization_ID

    if organization_ID == None:
        print("You need to specify an organizationID")
        exit()

    orgId = organization_ID
    orgAdmins = f"{orgId}0admin"

    catalogs = requests.get("https://api.kompetanse.knowit.no/catalogs", headers={
        'X-Api-Key':api_key,
        'accept-encoding':'json'
    }).json()

    catagories_url = f"https://api.kompetanse.knowit.no/catalogs/{catalogs[0]['id']}/categories"
    res = requests.get(catagories_url, headers={
        'X-Api-Key':api_key,
        'accept-encoding':'json'
    })

    categories_json = res.json()
    dt = f'{datetime.utcnow().isoformat(timespec="milliseconds")}Z'

    catalog = catalogs[0]
    catalog["label"] = "Default Katalog"
    catalog["id"] = uuid.uuid4().__str__()

    categories = []
    questions = []

    for category in categories_json:
        category_url = catagories_url + f"/{category['id']}/questions"

        category["id"] = uuid.uuid4().__str__()
        category["formDefinitionID"] = catalog["id"]
        
        questions_res = requests.get(category_url, headers={
            'X-Api-Key':api_key,
            'accept-encoding':'json'
        })

        questions_json = questions_res.json()
        for question in questions_json:
            question["id"] = uuid.uuid4().__str__()
            question["categoryID"] = category["id"]
            question["formDefinitionID"] = catalog["id"]
            question["createdAt"] = dt
            question["updatedAt"] = dt
            question["__typename"] = "Question"
            question["orgAdmins"] = orgAdmins
            question["organizationID"] = orgId
            for key in question.keys():
                if key == "index":
                    question[key] = {'N': str(question[key])}
                else:
                    question[key] = {'S': question[key]} 
            questions.append(question)

        category["orgAdmins"] = orgAdmins
        category["organizationID"] = orgId
        category["createdAt"] = dt
        category["updatedAt"] = dt
        category["__typename"] = "Category"
        for key in category.keys():
            if key == "index":
                category[key] = {'N': str(category[key])}
            else:
                category[key] = {'S': category[key]} 

        categories.append(category)


    catalog["orgAdmins"] = orgAdmins
    catalog["organizationID"] = orgId
    catalog["sortKeyConstant"] = "formDefinitionConstant"
    catalog["createdAt"] = dt
    catalog["__typename"] = "FormDefinition"
    catalog["updatedAt"] = dt
    for key in catalog.keys():
        catalog[key] = {'S': catalog[key]} 

    destination_client_session = boto3.Session(profile_name=destination_iam_user)
    dynamo_client = destination_client_session.client('dynamodb')

    formDefTable = f'FormDefinition-{destination_graphql_api_id}-{destination_env}'
    categoryTable = f'Category-{destination_graphql_api_id}-{destination_env}'
    questionTable = f'Question-{destination_graphql_api_id}-{destination_env}'

    print("Copying catalog...")
    res = dynamo_client.put_item(
        TableName = formDefTable,
        Item = catalog
    )
    print("Copied Catalog!")

    print("Copying categories...")
    for category in categories:
        dynamo_client.put_item(
            TableName = categoryTable,
            Item = category
        )
    print("Copied Categories!")

    print("Copying questions...")
    for question in questions:
        dynamo_client.put_item(
            TableName = questionTable,
            Item = question
        )
    print("Copied Questions!")
    print("Finished")