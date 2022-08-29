import csv
from os import environ
import boto3
import json

s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')
dynamodb_resource = boto3.resource('dynamodb')

env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")

tableNames = []

formDefTableName = f"FormDefinition-{sourceName}-{env}"
categoryTableName = f"Category-{sourceName}-{env}"
questionTableName = f"Question-{sourceName}-{env}"
userFormTableName = f"UserForm-{sourceName}-{env}"
questionAnswerTableName = f"QuestionAnswer-{sourceName}-{env}"

tableNames.extend([formDefTableName, categoryTableName, questionTableName,
userFormTableName, questionAnswerTableName])

formDefTable = dynamodb_resource.Table(formDefTableName)

OUTPUT_BUCKET = environ.get("EXPORT_TO_DATA_BUCKET")

def handler(event, context):
    
    for table in tableNames:
        TEMP_FILENAME=save_to_csv(table)
        OUTPUT_KEY = f"{table}.csv"
        s3_client.put_object(Bucket=OUTPUT_BUCKET, Key=OUTPUT_KEY, Body=open(TEMP_FILENAME, 'rb')) 

def scan_table(table):
    response = table.scan()
    data = response['Items']

    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])
    
    return data

def save_to_csv(table):
    dynamodb_table = dynamodb_resource.Table(table)
    filename = f"/tmp/{table}.csv" 
    data = scan_table(dynamodb_table)   
    
    with open(filename, 'w') as output_file:
        writer = csv.writer(output_file)
        header = True   

        for item in data:
            # Write header row?
            if header:
                writer.writerow(item.keys())
                header = False

            writer.writerow(item.values())

    return filename




        
        
    

    print("EXPORT COMPLETED!")