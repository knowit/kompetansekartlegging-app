from cmath import isnan
from urllib import response
import boto3
from os import environ
import pandas as pd
from io import StringIO
import math

s3Resource = boto3.resource("s3")
s3BucketFrom = environ.get("TRANSFORMED_DATA_BUCKET")

dbClient = boto3.client("rds-data")
dbARN = environ.get("DATABASE_ARN")
secretARN = environ.get("SECRET_ARN")
dbName = environ.get("DATABASE_NAME")

def handler(event, context):
    excuteInsert(organisationSQL, "transformed-organization.csv")

def excuteInsert(sqlTextFunction, fileName):
    file = getPandasCSVFile(fileName)
    sqlInsertStatment = sqlTextFunction(file)
    response = dbClient.execute_statement(
        resourceArn = dbARN,
        secretArn = secretARN,
        database = dbName,
        sql = sqlInsertStatment
    )
    print(f"-----{fileName}-----")
    print(str(response))

def getPandasCSVFile(key):
    s3Object = s3Resource.Object(s3BucketFrom, key)
    fileContent = s3Object.get()["Body"].read().decode("utf-8")
    csvString = StringIO(fileContent)
    return pd.read_csv(csvString, sep=",",header=[0])

def getValueOnSqlFormat(value, isNumber=False):
    if isinstance(value, float) and math.isnan(value): return "NULL"
    if isNumber: return value
    return f"'{value}'"

def organisationSQL(file):
    sqlInsertStatment = "INSERT INTO organization (id, createdAt, owner, orgname, identifierAttribute)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n('{getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.createdAt)},{getValueOnSqlFormat(row.owner)},"\
        f"{getValueOnSqlFormat(row.orgname)},{getValueOnSqlFormat(row.identifierAttribute)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment




