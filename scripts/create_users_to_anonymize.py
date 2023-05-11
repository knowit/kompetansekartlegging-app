import random
import boto3
import json
import random
import string

with open('parameters.json') as parameters_file:
    parameters = json.load(parameters_file)

parameter_keys = ["destination_userpool_id", 'destination_iam_user', 'destination_env']

if not all(key in parameters for key in parameter_keys):
    print(f"parameters.json must contain the following keys: f{parameter_keys}")
    exit()

profile_name = parameters["destination_iam_user"]
env = parameters["destination_env"]
userpoolId = parameters["destination_userpool_id"]

session = boto3.Session(profile_name=profile_name)
dynamoclient = session.client("dynamodb")
cognitoclient = session.client("cognito-idp")

orgid = "testorg"

def random_char(char_num):
       return ''.join(random.choice(string.ascii_letters) for _ in range(char_num))


testUsers1 = ["anon1@test", "anon2@test", "anon3@test", "anon4@test", "anon5@test"]
testUsers2 = [random_char(7)+"@anonme.com" for i in range(5)]
testUsers = testUsers1 + testUsers2

for user in testUsers: 
    try:
        cognitoclient.admin_create_user(
            UserPoolId=userpoolId,
            Username=user,
            UserAttributes=[
                {"Name": "custom:OrganizationID", "Value": orgid},
                {"Name": "name", "Value": user}
            ],
            MessageAction="SUPPRESS",
        )
    except:
        print(
            "Could not create user", user
        )
    try:
        cognitoclient.admin_add_user_to_group(
            UserPoolId=userpoolId,
            Username=user,
            GroupName=orgid
        )
    except:
        print("Could not add user", user, "to testorg group, either due to them already being in it or some other error")
    cognitoclient.admin_set_user_password(
        UserPoolId=userpoolId,
        Username=user,
        Password="tester123",
        Permanent=True
    )