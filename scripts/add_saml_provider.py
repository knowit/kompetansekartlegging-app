import boto3


import json


with open('saml_params.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['metadata_url', 'iam_user', 'userpool_id']

if not all(key in parameters for key in parameter_keys):
    print(f"saml_params.json must contain the following keys: f{parameter_keys}")
    exit()

userpool_id = parameters['userpool_id']
metadata_url = parameters['metadata_url']
iam_user = parameters['iam_user']

session = boto3.Session(profile_name=iam_user)

cognito_client = session.client('cognito-idp')

response = cognito_client.create_identity_provider(
    UserPoolId=userpool_id,
    ProviderName='AzureAD',
    ProviderType='SAML',
    ProviderDetails={
        'MetadataURL': metadata_url
    },
    AttributeMapping={
        'email': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
        'name': 'http://schemas.microsoft.com/identity/claims/displayname',
        'custom:company': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/company'
    }
)




