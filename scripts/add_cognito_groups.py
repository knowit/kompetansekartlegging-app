import boto3
import json
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Add default catalog to organization")
    parser.add_argument('organization_ID', help='organizationID : This is a string which uniquely identifies the organization')

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    parameter_keys = ['destination_iam_user', 'destination_userpool_id']

    if not all(key in parameters for key in parameter_keys):
        print(f"parameters.json must contain the following keys: f{parameter_keys}")
        exit()

    args = parser.parse_args()
    organization_ID = args.organization_ID

    destination_iam_user = parameters['destination_iam_user']
    destination_session = boto3.Session(profile_name=destination_iam_user)
    cognito_client = destination_session.client('cognito-idp')

    destUserPoolId = parameters['destination_userpool_id']
    
    cognito_client.create_group(
        UserPoolId=destUserPoolId,
        GroupName=organization_ID
    )

    cognito_client.create_group(
        UserPoolId=destUserPoolId,
        GroupName=f'{organization_ID}0admin'
    )

    cognito_client.create_group(
        UserPoolId=destUserPoolId,
        GroupName=f'{organization_ID}0groupLeader'
    )