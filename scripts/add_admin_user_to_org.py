import boto3
import json
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Add default catalog to organization")
    parser.add_argument('email', help='email : The email to the new admin user')
    parser.add_argument('organization_ID', help='organizationID : This is a string which uniquely identifies the organization')

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    parameter_keys = ['destination_iam_user', 'destination_userpool_id']

    if not all(key in parameters for key in parameter_keys):
        print(f"parameters.json must contain the following keys: f{parameter_keys}")
        exit()

    args = parser.parse_args()
    user_email = args.email
    organization_ID = args.organization_ID

    destination_iam_user = parameters['destination_iam_user']
    destination_session = boto3.Session(profile_name=destination_iam_user)
    cognito_client = destination_session.client('cognito-idp')

    destUserPoolId = parameters['destination_userpool_id']

    userAttributes = [
        {
            'Name': 'email',
            'Value': user_email,
        },
        {
            'Name': 'custom:OrganizationID',
            'Value': organization_ID
        }
    ]
    
    cognito_groups = []

    response = cognito_client.list_groups(
        UserPoolId = destUserPoolId
    )

    for group in response["Groups"]:
        cognito_groups.append(group["GroupName"])

    groupNextToken = None
    if "PaginationToken" in response.keys():
        groupNextToken = response["PaginationToken"]

    while groupNextToken:
        response = cognito_client.list_groups(
            UserPoolId = destUserPoolId
        )

        for group in response["Groups"]:
            cognito_groups.append(group["GroupName"])

        groupNextToken = None
        if "PaginationToken" in response.keys():
            groupNextToken = response["PaginationToken"]

    if not organization_ID in cognito_groups:
        print(f"No organization with the id {organization_ID} exists in Cognito!")
        exit()

    cognito_client.admin_create_user(
        UserPoolId=destUserPoolId,
        Username=user_email,
        MessageAction="SUPPRESS",
        UserAttributes=userAttributes
    )
    
    cognito_client.admin_set_user_password(
        UserPoolId=destUserPoolId,
        Username=user_email,
        Password="NotReal123",
        Permanent=True
    )
    cognito_client.admin_add_user_to_group(
        UserPoolId=destUserPoolId,
        Username=user_email,
        GroupName=f'{organization_ID}'
    )
    cognito_client.admin_add_user_to_group(
        UserPoolId=destUserPoolId,
        Username=user_email,
        GroupName=f'{organization_ID}0admin'
    )
