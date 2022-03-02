import boto3
import json
from hashlib import sha256
import string
import random
import time
import argparse


def add_api_key_to_apigateway(iam_user, api_key, api_key_name, api_key_tags):

    destination_session = boto3.Session(profile_name=iam_user)
    destination_client = destination_session.client('apigateway')

    usage_plan_response = destination_client.get_usage_plans()

    usage_plan_id = [usage_plan['id'] for usage_plan in usage_plan_response['items'] if usage_plan['name'] == 'standard'][0]


    res = destination_client.create_api_key(
            name= api_key_name,
            tags= api_key_tags,
            enabled=True,
            value= api_key
        )
    api_key_id = res['id']

    destination_client.create_usage_plan_key(
        usagePlanId = usage_plan_id,
        keyId = api_key_id,
        keyType = 'API_KEY'
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Add api_key to dynamodb.')
    parser.add_argument('organization_ID', help='organizationID : This is a string which uniquely identifies the organization')
    parser.add_argument('api_key_name', help='api_key_name: Name of the API key')
    parser.add_argument('--apikey',
        help='API_Key: API_Key which can be used to access the api for the organization. If argument is not passed, a key will be generated. Key has to be atleast 20 characters long.')

    with open('parameters.json') as parameters_file:
        parameters = json.load(parameters_file)

    destination_iam_user = parameters['destination_iam_user']

    args = parser.parse_args()

    organization_ID = args.organization_ID
    api_key_name = args.api_key_name

    if args.apikey is None:
        api_key = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase +  string.digits) for _ in range(25))
    elif len(args.apikey) < 20:
        print('apikey has to be atleast 20 characters long!')
        exit()
    else:
        api_key = args.apikey

    add_api_key_to_apigateway(destination_iam_user, api_key, api_key_name, api_key_tags={'organizationID': organization_ID})

    if args.apikey is None:
        print('The generated api_key has the value:', api_key)