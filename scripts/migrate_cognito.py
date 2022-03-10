import boto3
import json

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ['source_iam_user', 'source_userpool_id', 'destination_iam_user', 'destination_userpool_id']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

source_iam_user = parameters['source_iam_user']
source_session = boto3.Session(profile_name=source_iam_user)
source_client = source_session.client('cognito-idp')
sourceUserPoolId = parameters['source_userpool_id']

destination_iam_user = parameters['destination_iam_user']
destination_session = boto3.Session(profile_name=destination_iam_user)
destination_cognito_client = destination_session.client('cognito-idp')

destUserPoolId = parameters['destination_userpool_id']

def migrate_user(user):
    userGroups = source_client.admin_list_groups_for_user(
        UserPoolId=sourceUserPoolId,
        Username=user["Username"]
    )
    userName = user["Username"]

    userAttributes = [item for item in user['Attributes'] if item['Name'] != 'sub' and item['Name'] != 'identities']
    email = [item for item in user['Attributes'] if item['Name'] == 'email'][0]['Value']
    
    if email == userName:
        try:
            destination_cognito_client.admin_create_user(
                UserPoolId=destUserPoolId,
                Username=email,
                MessageAction="SUPPRESS",
                UserAttributes=userAttributes
            )

            destination_cognito_client.admin_set_user_password(
                UserPoolId=destUserPoolId,
                Username=email,
                Password="NotReal123",
                Permanent=True
            )

            for group in userGroups["Groups"]:
                destination_cognito_client.admin_add_user_to_group(
                    UserPoolId=destUserPoolId,
                    Username=email,
                    GroupName=group["GroupName"]
                )
                
            # if isAdmin:
            #     destination_cognito_client.admin_add_user_to_group(
            #         UserPoolId=destUserPoolId,
            #         Username=email,
            #         GroupName="knowitobjectnet0admin"
            #     )
        except:
            print("Error when creating user")
        return userName, email



# response = source_client.admin_get_user(
#     UserPoolId=sourceUserPoolId,
#     Username='Google_104475194586241570827'
# )

cognito_groups = []

response = source_client.list_groups(
    UserPoolId = sourceUserPoolId
)

for group in response["Groups"]:
    cognito_groups.append(group["GroupName"])

groupNextToken = None
if "PaginationToken" in response.keys():
    groupNextToken = response["PaginationToken"]

while groupNextToken:
    response = source_client.list_groups(
        UserPoolId = sourceUserPoolId
    )

    for group in response["Groups"]:
        cognito_groups.append(group["GroupName"])

    groupNextToken = None
    if "PaginationToken" in response.keys():
        groupNextToken = response["PaginationToken"]

# print(cognito_groups)
# exit()
for group in cognito_groups:
    if "eu-central-1" in group:
        continue
    # print(group)
    # exit()
    destination_cognito_client.create_group(
        UserPoolId=destUserPoolId,
        GroupName=group,
    )

response = source_client.list_users(
    UserPoolId = sourceUserPoolId
)

# usernameToEmail = {}

next_token = None
if "PaginationToken" in response.keys():
    next_token = response["PaginationToken"]

for user in response["Users"]:
    #userName, email = 
    migrate_user(user)
    # usernameToEmail[userName] = email

while next_token:
    response = source_client.list_users(
        UserPoolId = sourceUserPoolId,
        PaginationToken = next_token
    )
    for user in response["Users"]:
        #userName, email = 
        migrate_user(user)
        # usernameToEmail[userName] = email

    next_token = None
    if "PaginationToken" in response.keys():
        next_token = response["PaginationToken"]