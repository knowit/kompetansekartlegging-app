from cmath import isnan
import boto3
from os import environ
import pandas as pd
from io import StringIO
import math
import pandas.io.common

s3Resource = boto3.resource("s3")
s3BucketFrom = environ.get("TRANSFORMED_DATA_BUCKET")

dbClient = boto3.client("rds-data")
dbARN = environ.get("DATABASE_ARN")
secretARN = environ.get("SECRET_ARN")
dbName = environ.get("DATABASE_NAME")
env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")


def getFileName(name):
    return f"transformed-{name}-{sourceName}-{env}.csv"


def handler(event, context):
    excuteInsert(organizationSQL, getFileName("Organization"))
    excuteInsert(apiKeyPermissionSQL, getFileName("APIKeyPermission"))
    excuteInsert(formDefinitionSQL, getFileName("FormDefinition"))
    excuteInsert(categorySQL, getFileName("Category"))
    excuteInsert(groupSQL, getFileName("Group"))
    excuteInsert(userSQL, getFileName("User"))
    excuteInsert(questionSQL, getFileName("Question"))
    excuteInsert(userFormSQL, getFileName("UserForm"))
    excuteInsert(questionAnswerSQL, getFileName("QuestionAnswer"))


def excuteInsert(sqlTextFunction, fileName):
    skip = 20
    start = 0
    end = skip

    file = getPandasCSVFile(fileName)

    if len(file) == 0:
        print("File is empty, skipping insert")
        return

    done = False
    while (not done):
        if (end >= len(file)):
            end = len(file) - 1
            done = True
        sqlInsertStatment = sqlTextFunction(file, start, end)
        response = dbClient.execute_statement(
            resourceArn=dbARN,
            secretArn=secretARN,
            database=dbName,
            sql=sqlInsertStatment
        )
        start = end + 1
        end += skip
    print(f"-----{fileName}-----")
    print(str(response))


def getPandasCSVFile(key):
    s3Object = s3Resource.Object(s3BucketFrom, key)
    fileContent = s3Object.get()["Body"].read().decode("utf-8")
    csvString = StringIO(fileContent)
    try:
        csv_content = pd.read_csv(csvString, sep=",", header=[0])
        return csv_content
    except pandas.io.common.EmptyDataError as e:
        print(e + "\n Returning empty list")
        return []


def getValueOnSqlFormat(value, isNumber=False, isUUID=False, isUTC=False):
    if isinstance(value, float) and math.isnan(value) and isNumber:
        return "NULL::REAL"
    if isinstance(value, float) and math.isnan(value):
        return "NULL"
    if isNumber:
        return value
    if isUUID:
        return f"'{value}'::UUID"
    if isUTC:
        return f"'{value}'::TIMESTAMPTZ"
    value = value.replace("'", "''")
    return f"'{value}'"


def organizationSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO organization (id, createdAt, owner, orgname, identifierAttribute)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.createdAt, isUTC=True)},{getValueOnSqlFormat(row.owner)},"\
            f"{getValueOnSqlFormat(row.orgname)},{getValueOnSqlFormat(row.identifierAttribute)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def apiKeyPermissionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO apiKeyPermission (id, APIKeyHashed, organizationID)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.APIKeyHashed)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def formDefinitionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO formDefinition (id, label, createdAt, updatedAt, organizationID)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.label)},{getValueOnSqlFormat(row.createdAt, isUTC=True)}," \
            f"{getValueOnSqlFormat(row.updatedAt, isUTC=True)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def categorySQL(file, start, end):
    sqlInsertStatment = "INSERT INTO category (id, text, description, index, formDefinitionID, organizationID)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.description)}," \
            f"{getValueOnSqlFormat(row.index, isNumber=True)},{getValueOnSqlFormat(row.formDefinitionID, isUUID=True)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += "\n) as x (id, text, description, index, formDefinitionID, organizationID)\nWHERE EXISTS (SELECT 1 FROM formDefinition fd WHERE fd.id = x.formDefinitionID);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def userFormSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO userForm (id, createdAt, updatedAt, owner, formDefinitionID)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.createdAt, isUTC=True)},{getValueOnSqlFormat(row.updatedAt, isUTC=True)}," \
            f"{getValueOnSqlFormat(row.owner)},{getValueOnSqlFormat(row.formDefinitionID, isUUID=True)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, createdAt, updatedAt, owner, formDefinitionID)\nWHERE EXISTS (SELECT 1 FROM formDefinition fd WHERE fd.id = x.formDefinitionID);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO question (id, text, topic, index, formDefinitionID, categoryID, type,scaleStart,scaleMiddle,scaleEnd,organizationID)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.topic)}," \
            f"{getValueOnSqlFormat(row.index, isNumber=True)},{getValueOnSqlFormat(row.formDefinitionID, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.categoryID, isUUID=True)},{getValueOnSqlFormat(row.type)}::questionType," \
            f"{getValueOnSqlFormat(row.scaleStart)},{getValueOnSqlFormat(row.scaleMiddle)}," \
            f"{getValueOnSqlFormat(row.scaleEnd)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, text, topic, index, formDefinitionID, categoryID, type,scaleStart,scaleMiddle,scaleEnd,organizationID)\nWHERE EXISTS (SELECT 1 FROM formDefinition fd WHERE fd.id = x.formDefinitionID);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionAnswerSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO questionAnswer (id, userFormID, questionID, knowledge, motivation, customScaleValue,textValue)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.userFormID, isUUID=True)},{getValueOnSqlFormat(row.questionID, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.knowledge, isNumber=True)},{getValueOnSqlFormat(row.motivation, isNumber=True)}," \
            f"{getValueOnSqlFormat(row.customScaleValue, isNumber=True)},{getValueOnSqlFormat(row.textValue)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, userFormID, questionID, knowledge, motivation, customScaleValue,textValue) WHERE EXISTS (SELECT 1 FROM question q WHERE q.id = x.questionID);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def groupSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO \"group\" (id, organizationID, groupLeaderUsername)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.organizationID)},{getValueOnSqlFormat(row.groupLeaderUsername)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def userSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO \"user\" (id, groupID, organizationID)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.groupID, isUUID=True)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment
