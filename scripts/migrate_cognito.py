import boto3
import json

source_iam_user = ''
source_session = boto3.Session(profile_name=source_iam_user)
source_client = source_session.client('cognito-idp')
sourceUserPoolId = ""

destination_iam_user = 'KompetanseProdB'
destination_session = boto3.Session(profile_name=destination_iam_user)
destination_cognito_client = destination_session.client('cognito-idp')
# destination_dynamo_client = destination_session.client('dynamodb')
# destination_table_id = "" 
# destination_env = ""
destUserPoolId = ""

def migrate_user(user):
    userGroups = source_client.admin_list_groups_for_user(
        UserPoolId=sourceUserPoolId,
        Username=user["Username"]
    )
    userName = user["Username"]

    # isGroupLeader = any([group["GroupName"] == "groupLeader" for group in userGroups["Groups"]])
    # if isGroupLeader:
    #     print(f"{userName} IsGroupLeader!")
    # isAdmin = any([group["GroupName"] == "groupLeader" for group in userGroups["Groups"]])
    # if isAdmin:
    #     print(f"{userName} IsAdmin!")

    userAttributes = [item for item in user['Attributes'] if item['Name'] != 'sub' and item['Name'] != 'identities']
    email = [item for item in user['Attributes'] if item['Name'] == 'email'][0]['Value']
    # userAttributes.append({"Name": "custom:OrganizationID", "Value": "knowitobjectnet"})
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

            destination_cognito_client.admin_add_user_to_group(
                UserPoolId=destUserPoolId,
                Username=email,
                GroupName="knowitobjectnet"
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