import boto3
import json
from hashlib import sha256
import string
import random
import time
import argparse

def add_api_key_to_dynamodb(organization_ID, api_key, iam_user, graphql_api_id, env):

    table_name = 'APIKeyPermission'

    client_session = boto3.Session(profile_name=iam_user)

    dynamo_client = client_session.resource('dynamodb')

    full_table_name = table_name + '-' + graphql_api_id + '-' + env

    table = dynamo_client.Table(full_table_name)


    api_key_hashed = sha256(api_key.encode('utf-8')).hexdigest()

    id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10)) + str(int(time.time()*1000))

    table.put_item(
        Item={
            "id": id,
            "APIKeyHashed": api_key_hashed,
            "organizationID": organization_ID
        }
    )


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Add api_key to dynamodb')
    parser.add_argument('organization_ID', help='organizationID : This is a string which uniquely identifies the organization')
    parser.add_argument('api_key', help='API_Key: API_Key which can be used to access the api for the organization')


    args = parser.parse_args()

    organization_ID = args.organization_ID
    api_key = args.api_key

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    destination_iam_user = parameters['destination_iam_user']
    destination_graphql_api_id = parameters['destination_graphql_api_id']
    destination_env = parameters['destination_env']


    add_api_key_to_dynamodb(organization_ID, api_key, destination_iam_user, destination_graphql_api_id, destination_env)