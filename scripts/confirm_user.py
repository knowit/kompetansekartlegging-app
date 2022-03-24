import boto3
import json

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['destination_iam_user', 'destination_userpool_id']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

destination_iam_user = parameters['destination_iam_user']
destination_session = boto3.Session(profile_name=destination_iam_user)
destination_cognito_client = destination_session.client('cognito-idp')

destUserPoolId = parameters['destination_userpool_id']
users = [] # Add strings of usernames for users to confirm

for user in users:
    destination_cognito_client.admin_set_user_password(
        UserPoolId=destUserPoolId,
        Username=user,
        Password="NotReal123",
        Permanent=True
    )