import csv
from os import environ
import boto3
import json

s3_client = boto3.client('s3')
dynamodb_resource = boto3.resource('dynamodb')
lambda_client = boto3.client('lambda')

env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")
triggerFunctionName = environ.get("TRIGGER_FUNCTION")

tableNames = []

def getFileName(name):
    return f"{name}-{sourceName}-{env}"

formDefTableName = getFileName("FormDefinition")
categoryTableName = getFileName("Category")
questionTableName = getFileName("Question")
userFormTableName = getFileName("UserForm")
questionAnswerTableName = getFileName("QuestionAnswer")
apiKeyPermissionTableName = getFileName("APIKeyPermission")
groupTableName = getFileName("Group")
organizationTableName = getFileName("Organization")
userTableName = getFileName("User")

tableNames.extend([formDefTableName, categoryTableName, questionTableName,
userFormTableName, questionAnswerTableName, apiKeyPermissionTableName, groupTableName, organizationTableName, userTableName])

formDefTable = dynamodb_resource.Table(formDefTableName)

OUTPUT_BUCKET = environ.get("EXPORT_TO_DATA_BUCKET")

def handler(event, context):
    
    for table in tableNames:
        TEMP_FILENAME=save_to_csv(table)
        OUTPUT_KEY = f"{table}.csv"
        s3_client.put_object(Bucket=OUTPUT_BUCKET, Key=OUTPUT_KEY, Body=open(TEMP_FILENAME, 'rb')) 
    
    lambda_client.invoke(FunctionName=triggerFunctionName, 
                     InvocationType='Event')

    

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
    allKeys = findAllUniqueKeys(data)
    
    with open(filename, 'w') as output_file:
        writer = csv.writer(output_file)
        header = True   

        for item in data:
            if header:
                writer.writerow(allKeys)
                header = False
            
            values = fillInEmptyValues(item, allKeys)
            writer.writerow(values)
        
    return filename
    
def findAllUniqueKeys(items):
    keys = []
    for item in items:
        keys.extend(item.keys())
    keysSet = set(keys)
    keys = list(keysSet)
    
    return keys
    
def fillInEmptyValues(item, allKeys):
    values = []
    for key in allKeys:
        value = item.get(key, None)
        values.append(value)
    
    return values