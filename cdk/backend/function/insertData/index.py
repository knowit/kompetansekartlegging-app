from urllib import response
import boto3
from os import environ
import pandas as pd
from io import StringIO

s3Resource = boto3.resource("s3")
s3BucketFrom = environ.get("TRANSFORMED_DATA_BUCKET")

dbClient = boto3.client("rds-data")
dbARN = environ.get("DATABASE_ARN")
secretARN = environ.get("SECRET_ARN")
dbName = environ.get("DATABASE_NAME")

def handler(event, context):
    file = getPandasCSVFile("transformed-organization.csv")

    sqlInsertStatment = "INSERT INTO organization (id, createdAt, owner, orgname, identifierAttribute)\nVALUES"
    
    for row in file.itertuples():
        sqlInsertStatment += f"\n('{row.id}','{row.createdAt}','{row.orgname}','','{row.identifierAttribute}'),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)

    response = dbClient.execute_statement(
        resourceArn = dbARN,
        secretArn = secretARN,
        database = dbName,
        sql = sqlInsertStatment
    )

    print(str(response))
    

def getPandasCSVFile(key):
    s3Object = s3Resource.Object(s3BucketFrom, key)
    fileContent = s3Object.get()["Body"].read().decode("utf-8")
    csvString = StringIO(fileContent)
    return pd.read_csv(csvString, sep=",",header=[0])




