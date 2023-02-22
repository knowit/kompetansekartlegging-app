import boto3
from os import environ
import pandas as pd
from io import StringIO
import math
import uuid

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
    except Exception as e:
        print(e)
        print("Returning empty list: " + key)
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
    sqlInsertStatment = "INSERT INTO organization (id, created_at, organization_name, identifier_attribute)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.createdAt, isUTC=True)},"\
            f"{getValueOnSqlFormat(row.orgname)},{getValueOnSqlFormat(row.identifierAttribute)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def apiKeyPermissionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO api_key_permission (id, api_key_hashed, organization_id)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.APIKeyHashed)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def formDefinitionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO \"catalog\" (id, label, created_at, updated_at, organization_id)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.label)},{getValueOnSqlFormat(row.createdAt, isUTC=True)}," \
            f"{getValueOnSqlFormat(row.updatedAt, isUTC=True)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def categorySQL(file, start, end):
    sqlInsertStatment = "INSERT INTO category (id, text, description, index, catalog_id)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.description)}," \
            f"{getValueOnSqlFormat(row.index, isNumber=True)},{getValueOnSqlFormat(row.formDefinitionID, isUUID=True)},"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += "\n) as x (id, text, description, index, catalog_id)\nWHERE EXISTS (SELECT 1 FROM \"catalog\" c WHERE c.id = x.catalog_id);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO question (id, text, topic, index, category_id, type, scale_start, scale_middle, scale_end)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.topic)}," \
            f"{getValueOnSqlFormat(row.index, isNumber=True)}," \
            f"{getValueOnSqlFormat(row.categoryID, isUUID=True)},{getValueOnSqlFormat(row.type)}::question_type," \
            f"{getValueOnSqlFormat(row.scaleStart)},{getValueOnSqlFormat(row.scaleMiddle)}," \
            f"{getValueOnSqlFormat(row.scaleEnd)},"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, text, topic, index, category_id, type, scale_start, scale_middle, scale_end)\nWHERE EXISTS (SELECT 1 FROM category c WHERE c.id = x.category_id);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionAnswerSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO question_answer (id, question_id, knowledge, motivation, custom_scale_value, text_value)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.questionID, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.knowledge, isNumber=True)},{getValueOnSqlFormat(row.motivation, isNumber=True)}," \
            f"{getValueOnSqlFormat(row.customScaleValue, isNumber=True)},{getValueOnSqlFormat(row.textValue)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, question_id, knowledge, motivation, custom_scale_value, text_value) WHERE EXISTS (SELECT 1 FROM question q WHERE q.id = x.question_id);"
    print(sqlInsertStatment)
    return sqlInsertStatment


def groupSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO \"group\" (id, organization_id, group_leader_id)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(row.id, isUUID=True)}," \
            f"{getValueOnSqlFormat(row.organizationID)},{getValueOnSqlFormat(row.groupLeaderUsername)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment


def userSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO \"user\" (id, mail, group_id, organization_id)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += f"\n({getValueOnSqlFormat(str(uuid.uuid4()), isUUID=True)},{getValueOnSqlFormat(row.id)}," \
            f"{getValueOnSqlFormat(row.groupID, isUUID=True)},{getValueOnSqlFormat(row.organizationID)}),"
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + ";"
    print(sqlInsertStatment)
    return sqlInsertStatment
