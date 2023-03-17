import json
from os import environ
import boto3

#import botocore.exceptions
#for key, value in sorted(botocore.exceptions.__dict__.items()):
#    if isinstance(value, type):
#        print(key)

userPoolId = environ.get("USER_POOL_ID")
cognito_client = boto3.client("cognito-idp")

def handler(event, context):
    print(event)
    org_id = event["queryStringParameters"]["organization_id"]
    email = event["queryStringParameters"]["admin_email"]

    create_groups(org_id)

    if user_already_exists(email):
        print(f"User {email} already exists, adding to groups")
        add_user_to_admin_groups(email, org_id)
    else:
        create_admin_user(org_id, email)

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
                UserPoolId=userPoolId,
                GroupName=groupName
            )
            print(f'Group {groupName} created')
        except cognito_client.exceptions.GroupExistsException:
            print(f"Group {groupName} already exists")

def user_already_exists(email):
    try:
        cognito_client.admin_get_user(
            UserPoolId=userPoolId,
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
    """
    cognito_groups = []

    response = cognito_client.list_groups(
        UserPoolId = userPoolId
    )

    for group in response["Groups"]:
        cognito_groups.append(group["GroupName"])

    groupNextToken = None
    if "PaginationToken" in response.keys():
        groupNextToken = response["PaginationToken"]

    while groupNextToken:
        response = cognito_client.list_groups(
            UserPoolId = userPoolId
        )

        for group in response["Groups"]:
            cognito_groups.append(group["GroupName"])

        groupNextToken = None
        if "PaginationToken" in response.keys():
            groupNextToken = response["PaginationToken"]

    if not org_id in cognito_groups:
        print(f"No organization with the id {org_id} exists in Cognito!")
        exit()
    """

    try:
        cognito_client.admin_create_user(
            UserPoolId=userPoolId,
            Username=email,
            MessageAction="SUPPRESS",
            UserAttributes=userAttributes
        )
        
        cognito_client.admin_set_user_password(
            UserPoolId=userPoolId,
            Username=email,
            Password="NotReal123",
            Permanent=True
        )

        add_user_to_admin_groups(email, org_id)

        print(f"Admin user {email} created for orgID {org_id}")

    except Exception as e:
        print((f"Could not create admin user {email} for orgID {org_id}"))
        print(e)

def add_user_to_admin_groups(email, org_id):
    cognito_client.admin_add_user_to_group(
        UserPoolId=userPoolId,
        Username=email,
        GroupName=f'{org_id}'
    )
    cognito_client.admin_add_user_to_group(
        UserPoolId=userPoolId,
        Username=email,
        GroupName=f'{org_id}0admin'
    )
    print(f"User {email} added to admin groups")