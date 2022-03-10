import boto3
import json


def set_hosted_ui_identity_providers(client_id):
    app_client_desc = cognito_client.describe_user_pool_client(
        UserPoolId=userpool_id,
        ClientId=client_id
    )

    desc = app_client_desc['UserPoolClient']

    desc["SupportedIdentityProviders"] = ["Google", "AzureAD"]


    # print(app_client_desc)

    response = cognito_client.update_user_pool_client(
        UserPoolId=userpool_id,
        ClientId=client_id,
        ClientName=desc['ClientName'],
        RefreshTokenValidity=desc['RefreshTokenValidity'],
        TokenValidityUnits=desc['TokenValidityUnits'],
        SupportedIdentityProviders=desc['SupportedIdentityProviders'],
        CallbackURLs=desc['CallbackURLs'],
        LogoutURLs=desc['LogoutURLs'],
        AllowedOAuthFlows=desc['AllowedOAuthFlows'],
        AllowedOAuthScopes=desc['AllowedOAuthScopes'],
        AllowedOAuthFlowsUserPoolClient=desc['AllowedOAuthFlowsUserPoolClient'],
        EnableTokenRevocation=desc['EnableTokenRevocation']
    )



with open('ui_params.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['app_client_id', 'iam_user', 'userpool_id']

if not all(key in parameters for key in parameter_keys):
    print(f"saml_params.json must contain the following keys: f{parameter_keys}")
    exit()

userpool_id = parameters['userpool_id']
app_client_id = parameters['app_client_id']
iam_user = parameters['iam_user']

session = boto3.Session(profile_name=iam_user)

cognito_client = session.client('cognito-idp')


if isinstance(app_client_id, list):
    for id in app_client_id:
        set_hosted_ui_identity_providers(id)
else:
    set_hosted_ui_identity_providers(app_client_id)
