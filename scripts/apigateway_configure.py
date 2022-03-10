import boto3
import argparse

parser = argparse.ArgumentParser(description='Configure apigateway')
parser.add_argument('iam_user', help='iam_user: Needs to be admin')
parser.add_argument('rest_api_id', help='rest_api_id: Identifier of the api')


args = parser.parse_args()

iam_user = args.iam_user
rest_api_id = args.rest_api_id


session = boto3.Session(profile_name=iam_user)
client = session.client('apigateway')

resources = client.get_resources(
    restApiId=rest_api_id
)["items"]


usp = client.get_usage_plans()

for resource in resources:
    resource_id = resource['id']
    resource_method = 'ANY'

    client.update_method(
        restApiId=rest_api_id,
        resourceId=resource_id,
        httpMethod=resource_method,
        patchOperations=[{
            'op': 'replace',
            'path': '/apiKeyRequired',
            'value': 'true'
        }]
    )

stage = client.get_stages(
    restApiId=rest_api_id
)['item'][0]

stage_name = stage['stageName']
stage_id = stage['deploymentId']

client.create_deployment(
    restApiId=rest_api_id,
    stageName=stage_name
)

client.create_usage_plan(
    name='standard',
    description='The standard usage plan',
    apiStages=[{
        'apiId': rest_api_id,
        'stage': stage_name
    },]
)