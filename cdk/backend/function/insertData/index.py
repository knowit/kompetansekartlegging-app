from cmath import isnan
import sqlite3
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
    excuteInsert(apiKeyPermissionSQL, "transformed-APIKeyPermission.csv")
    excuteInsert(formDefinitionSQL, "transformed-formDefinition.csv")
    excuteInsert(categorySQL, "transformed-category.csv")
    excuteInsert(groupSQL, "transformed-group.csv")
    excuteInsert(userSQL, "transformed-user.csv")
    excuteInsert(questionSQL, "transformed-question.csv")
    excuteInsert(questionAnswerSQL, "transformed-questionAnswer.csv")
    excuteInsert(userFormSQL, "transformed-userForm.csv")

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
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.createdAt)},{getValueOnSqlFormat(row.owner)},"\
        f"{getValueOnSqlFormat(row.orgname)},{getValueOnSqlFormat(row.identifierAttribute)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def apiKeyPermissionSQL(file):
    sqlInsertStatment = "INSERT INTO apiKeyPermission (id, APIKeyHashed, organizationID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.APIKeyHashed)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def formDefinitionSQL(file):
    sqlInsertStatment = "INSERT INTO formDefinition (id, label, createdAt, updatedAt, sortKeyConstant, organizationID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.label)},{getValueOnSqlFormat(row.createdAt)}," \
        f"{getValueOnSqlFormat(row.updatedAt)},'TODO:REMOVE',{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def categorySQL(file):
    sqlInsertStatment = "INSERT INTO category (id, text, description, index, formDefinitionID, organizationID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.description)}," \
        f"{getValueOnSqlFormat(row.index)},{getValueOnSqlFormat(row.formDefinitionID)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment
    
def userFormSQL(file):
    sqlInsertStatment = "INSERT INTO category (id, createdAt, updatedAt, owner, formDefinitionID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.createdAt)},{getValueOnSqlFormat(row.updatedAt)}," \
        f"{getValueOnSqlFormat(row.owner)},{getValueOnSqlFormat(row.formDefinitionID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def questionSQL(file):
    sqlInsertStatment = "INSERT INTO question (id, text, topic, index, formDefinitionID, categoryID, questionType,scaleStart,scaleMiddle,scaleEnd,organizationID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.topic)}," \
        f"{getValueOnSqlFormat(row.index)},{getValueOnSqlFormat(row.formDefinitionID)}," \
        f"{getValueOnSqlFormat(row.categoryID)},{getValueOnSqlFormat(row.type)}," \
        f"{getValueOnSqlFormat(row.scaleStart)},{getValueOnSqlFormat(row.scaleMiddle)}," \
        f"{getValueOnSqlFormat(row.scaleEnd)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionAnswerSQL(file):
    sqlInsertStatment = "INSERT INTO category (id, userFormID, questionID, knowledge, motivation, customScaleValue,textValue)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.userFormID)},{getValueOnSqlFormat(row.questionID)}," \
        f"{getValueOnSqlFormat(row.knowledge)},{getValueOnSqlFormat(row.motivation)}," \
        f"{getValueOnSqlFormat(row.customScaleValue)},{getValueOnSqlFormat(row.textValue)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def groupSQL(file):
    sqlInsertStatment = "INSERT INTO category (id, organizationID, groupLeaderUsername)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.organizationID)},{getValueOnSqlFormat(row.groupLeaderUsername)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment

def userSQL(file):
    sqlInsertStatment = "INSERT INTO category (id, groupID, organizationID)\nVALUES"
    for row in file.itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
        f"{getValueOnSqlFormat(row.groupID)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment



