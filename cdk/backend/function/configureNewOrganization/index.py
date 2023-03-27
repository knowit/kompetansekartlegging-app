import json
import uuid
import boto3
from datetime import datetime
from os import environ

env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")
userpool_id = environ.get("USER_POOL_ID")
allowedGroup = environ.get("GROUP")
table_names = {
    "FormDefinition": f"FormDefinition-{sourceName}-{env}",
    "Category": f"Category-{sourceName}-{env}",
    "Question": f"Question-{sourceName}-{env}",
}

cognito_client = boto3.client("cognito-idp")
dynamo_client = boto3.client('dynamodb')

def handler(event, context):
    print(event)

    groups = event["requestContext"]["authorizer"]["claims"]["cognito:groups"].split(",")
    if (allowedGroup not in groups):
        print("EXITING: User does not have permissions to perform superadmin tasks")
        exit()

    org_id = event["queryStringParameters"]["organization_id"]
    email = event["queryStringParameters"]["admin_email"]

    create_groups(org_id)

    if user_already_exists(email):
        print(f"User {email} already exists, adding user to groups")
        add_user_to_groups(email, org_id)
    else:
        create_admin_user(org_id, email)

    create_default_form_definition(org_id)

    return {
        'statusCode': 200,
        "headers": {
            "Content-Type": "application/json",
            'Access-Control-Allow-Headers': 'Content-Type',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True
        },
        'body': json.dumps(f"Configured organization with ID '{org_id}'")
    }

def create_groups(orgId):
    groupNamesToCreate = [orgId, f'{orgId}0admin', f'{orgId}0groupLeader']

    for groupName in groupNamesToCreate:
        try:
            cognito_client.create_group(
                UserPoolId=userpool_id,
                GroupName=groupName
            )
            print(f'Group {groupName} created')
        except cognito_client.exceptions.GroupExistsException:
            print(f"Group {groupName} already exists")

def user_already_exists(email):
    try:
        cognito_client.admin_get_user(
            UserPoolId=userpool_id,
            Username=email
        )
        return True
    except cognito_client.exceptions.UserNotFoundException:
        return False

def create_admin_user(org_id, email):
    print("Creating admin user")
    userAttributes = [
        {
            'Name': 'email',
            'Value': email,
        },
        {
            'Name': 'custom:OrganizationID',
            'Value': org_id
        }
    ]

    try:
        cognito_client.admin_create_user(
            UserPoolId = userpool_id,
            Username = email,
            MessageAction = "SUPPRESS",
            UserAttributes = userAttributes
        )
        
        cognito_client.admin_set_user_password(
            UserPoolId = userpool_id,
            Username = email,
            Password = "NotReal123",
            Permanent = True
        )
        add_user_to_groups(email, org_id)
        print(f"Admin user {email} created for orgID {org_id}")

    except Exception as e:
        print((f"Could not create admin user {email} for orgID {org_id}"))
        print(e)

def add_user_to_groups(email, org_id):
    try:
        cognito_client.admin_add_user_to_group(
            UserPoolId = userpool_id,
            Username = email,
            GroupName = f'{org_id}'
        )
        cognito_client.admin_add_user_to_group(
            UserPoolId = userpool_id,
            Username = email,
            GroupName = f'{org_id}0admin'
        )
        print(f"User {email} added to groups")
    except Exception as e:
        print(f"Could not add user {email} to groups")
        print(e)

def create_default_form_definition(org_id):
    org_admins = f"{org_id}0admin"
    default_catalog_label = "Default Catalog"

    if (default_form_definition_already_exists(org_id, default_catalog_label)) :
        print(f"Catalog with label {default_catalog_label} already exists, skipping creation")
    else:
        catalogs_res = dynamo_client.scan(
            TableName = table_names["FormDefinition"],
            FilterExpression = "organizationID = :oid",
            ExpressionAttributeValues = {":oid": {"S" : "knowitobjectnet"}},
            ProjectionExpression = 'id'
        )

        id_of_first_catalog = catalogs_res["Items"][0]["id"]["S"]

        categories_res = dynamo_client.query(
            TableName = table_names["Category"],
            IndexName = "byFormDefinition",
            KeyConditionExpression = "#formDef = :formDef",
            ExpressionAttributeValues = {":formDef": {"S": id_of_first_catalog}},
            ProjectionExpression = "id, description, #text, #index",
            ExpressionAttributeNames = {
                "#formDef": "formDefinitionID",
                "#text": "text",
                "#index": "index"
            }
        )
        dt = f'{datetime.utcnow().isoformat(timespec="milliseconds")}Z'

        catalog = catalogs_res["Items"][0]
        catalog["label"] = "Default Catalog"
        catalog["id"] = uuid.uuid4().__str__()

        categories = []
        questions = []

        for category in categories_res["Items"]:
            questions_res = dynamo_client.query(
                TableName = table_names["Question"],
                IndexName = "byCategory",
                KeyConditionExpression = "#category = :category",
                ExpressionAttributeValues = {":category": {"S": category["id"]["S"]}},
                ProjectionExpression = "id, #text, #index, #type, scaleStart, scaleMiddle, scaleEnd, topic, categoryID",
                ExpressionAttributeNames = {
                    "#category": "categoryID",
                    "#text": "text",
                    "#index": "index",
                    "#type": "type"
                }
            )

            category["id"] = {"S": uuid.uuid4().__str__()}
            category["formDefinitionID"] = {"S": catalog["id"]}
            category["orgAdmins"] = {"S": org_admins}
            category["organizationID"] = {"S": org_id}
            category["createdAt"] = {"S": dt}
            category["updatedAt"] = {"S": dt}
            category["__typename"] = {"S": "Category"}

            for question in questions_res["Items"]:
                question["id"] = {"S": uuid.uuid4().__str__()}
                question["categoryID"] = category["id"]
                question["formDefinitionID"] = {"S": catalog["id"]}
                question["createdAt"] = {"S": dt}
                question["updatedAt"] = {"S": dt}
                question["__typename"] = {"S": "Question"}
                question["orgAdmins"] = {"S": org_admins}
                question["organizationID"] = {"S": org_id}

                questions.append(question)

            categories.append(category)
        
        catalog["orgAdmins"] = org_admins
        catalog["organizationID"] = org_id
        catalog["sortKeyConstant"] = "formDefinitionConstant"
        catalog["createdAt"] = dt
        catalog["__typename"] = "FormDefinition"
        catalog["updatedAt"] = dt
        for key in catalog.keys():
            catalog[key] = {'S': catalog[key]}

        print("Copying catalog...")
        dynamo_client.put_item(
            TableName = table_names["FormDefinition"],
            Item = catalog
        )
        print("Copied Catalog!")

        print("Copying categories...")
        for category in categories:
            dynamo_client.put_item(
                TableName = table_names["Category"],
                Item = category
            )
        print("Copied Categories!")

        print("Copying questions...")
        for question in questions:
            dynamo_client.put_item(
                TableName = table_names["Question"],
                Item = question
            )
        print("Copied Questions!")
        print("Default Catalog created!")

def default_form_definition_already_exists(org_id, default_catalog_label):
    catalogs_res = dynamo_client.scan(
        TableName = table_names["FormDefinition"],
        FilterExpression = "organizationID = :oid AND label = :label",
        ExpressionAttributeValues = {
            ":oid": {"S" : org_id},
            ":label": {"S" : default_catalog_label}
        },
        Select = "COUNT"
    )
    return(catalogs_res["Count"] > 0)
