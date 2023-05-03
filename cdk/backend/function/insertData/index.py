import math
import re
import uuid
from io import StringIO
from os import environ

import boto3
import pandas as pd

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
    executeInsert(create_temp_column)
    executeInsert(create_dummy_data)
    excuteInsert(organizationSQL, getFileName("Organization"))
    excuteInsert(apiKeyPermissionSQL, getFileName("APIKeyPermission"))
    excuteInsert(formDefinitionSQL, getFileName("FormDefinition"))
    excuteInsert(categorySQL, getFileName("Category"))
    excuteInsert(userSQL, getFileName("User"))
    excuteInsert(groupSQL, getFileName("Group"))

    excuteInsert(questionSQL, getFileName("Question"))
    excuteInsert(questionAnswerSQL, getFileName("QuestionAnswer"))

    excuteInsert(add_group_id_to_user, getFileName("User"))
    executeInsert(add_active_catalog_to_organization)

    executeInsert(remove_temp_column)


def excuteInsert(sqlTextFunction, fileName):
    skip = 20
    start = 0
    end = skip

    file = getPandasCSVFile(fileName)

    if len(file) == 0:
        print("File is empty, skipping insert")
        return

    done = False
    while not done:
        if end >= len(file):
            end = len(file) - 1
            done = True
        sqlInsertStatment = sqlTextFunction(file, start, end)
        response = dbClient.execute_statement(
            resourceArn=dbARN,
            secretArn=secretARN,
            database=dbName,
            sql=sqlInsertStatment,
        )
        start = end + 1
        end += skip
    print(f"-----{fileName}-----")
    print(str(response))


def executeInsert(sqlTextFunction):
    sqlInsertStatement = sqlTextFunction()
    response = dbClient.execute_statement(
        resourceArn=dbARN, secretArn=secretARN, database=dbName, sql=sqlInsertStatement
    )

    print(f"----- Inserting manually without a file -----")
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


def create_dummy_data():
    organization_id = str(uuid.uuid4())
    sqlInsertStatement = (
        f"INSERT INTO organization (id, organization_name, identifier_attribute, temp_org_id)\nVALUES "
        f"({getValueOnSqlFormat(organization_id)}, 'dummy', 'dummy', 'dummy') ON CONFLICT (organization_name) DO NOTHING;\n"
    )
    sqlInsertStatement += (
        'INSERT INTO "user" (id, mail, group_id, organization_id)\nVALUES '
        f"({getValueOnSqlFormat(str(uuid.uuid4()))}, 'dummyUser@dummy', NULL, {getValueOnSqlFormat(organization_id)}) "
        "ON CONFLICT (mail) DO NOTHING;"
    )
    return sqlInsertStatement


def organizationSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO organization (id, created_at, organization_name, identifier_attribute, temp_org_id, active_catalog_id)\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(str(uuid.uuid4()))},"
            f"{getValueOnSqlFormat(row.createdAt, isUTC=True)},"
            f"{getValueOnSqlFormat(row.orgname)},{getValueOnSqlFormat(row.identifierAttribute)},"
            f"{getValueOnSqlFormat(row.id)}),"
            f"NULL,"
        )
    sqlInsertStatment = (
        sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + " ON CONFLICT DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def apiKeyPermissionSQL(file, start, end):
    sqlInsertStatment = (
        "INSERT INTO api_key_permission (id, api_key_hashed, organization_id)\nVALUES"
    )
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id)},"
            f"{getValueOnSqlFormat(row.APIKeyHashed)},(SELECT o.id FROM organization o WHERE o.temp_org_id = {getValueOnSqlFormat(row.organizationID)})),"
        )
    sqlInsertStatment = (
        sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + " ON CONFLICT DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def formDefinitionSQL(file, start, end):
    sqlInsertStatment = 'INSERT INTO "catalog" (id, label, created_at, updated_at, organization_id)\nVALUES'
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id, isUUID=True)},"
            f"{getValueOnSqlFormat(row.label)},{getValueOnSqlFormat(row.createdAt, isUTC=True)},"
            f"{getValueOnSqlFormat(row.updatedAt, isUTC=True)},(SELECT o.id FROM organization o WHERE o.temp_org_id = {getValueOnSqlFormat(row.organizationID)})),"
        )
    sqlInsertStatment = (
        sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + " ON CONFLICT DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def categorySQL(file, start, end):
    sqlInsertStatment = "INSERT INTO category (id, text, description, index, catalog_id)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id, isUUID=True)},"
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.description)},"
            f"{getValueOnSqlFormat(row.index, isNumber=True)},{getValueOnSqlFormat(row.formDefinitionID, isUUID=True)}),"
        )
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += (
        ') as x (id, text, description, index, catalog_id)\nWHERE EXISTS (SELECT 1 FROM "catalog" c WHERE c.id = x.catalog_id) '
        "ON CONFLICT DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO question (id, text, topic, index, category_id, type, scale_start, scale_middle, scale_end)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id, isUUID=True)},"
            f"{getValueOnSqlFormat(row.text)},{getValueOnSqlFormat(row.topic)},"
            f"{getValueOnSqlFormat(row.index, isNumber=True)},"
            f"{getValueOnSqlFormat(row.categoryID, isUUID=True)}, (CASE WHEN {getValueOnSqlFormat(camel_to_snake_case(row.type))}='NULL' THEN NULL ELSE {getValueOnSqlFormat(camel_to_snake_case(row.type))}::question_type END),"
            f"{getValueOnSqlFormat(row.scaleStart)},{getValueOnSqlFormat(row.scaleMiddle)},"
            f"{getValueOnSqlFormat(row.scaleEnd)}),"
        )
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, text, topic, index, category_id, type, scale_start, scale_middle, scale_end)\nWHERE EXISTS (SELECT 1 FROM category c WHERE c.id = x.category_id) ON CONFLICT DO NOTHING;"
    print(sqlInsertStatment)
    return sqlInsertStatment


def questionAnswerSQL(file, start, end):
    sqlInsertStatment = "INSERT INTO question_answer (id, question_id, knowledge, motivation, custom_scale_value, text_value, user_username)\nSELECT * FROM (\nVALUES"
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id, isUUID=True)},"
            f"{getValueOnSqlFormat(row.questionID, isUUID=True)},"
            f"{getValueOnSqlFormat(row.knowledge, isNumber=True)},{getValueOnSqlFormat(row.motivation, isNumber=True)},"
            f"{getValueOnSqlFormat(row.customScaleValue, isNumber=True)},{getValueOnSqlFormat(row.textValue)},"
            f"(SELECT COALESCE ((SELECT u.id FROM \"user\" u WHERE u.mail = {getValueOnSqlFormat(row.owner)}),(SELECT du.id FROM \"user\" du WHERE du.mail = {getValueOnSqlFormat('dummyUser@dummy')})))),"
        )
    sqlInsertStatment = sqlInsertStatment.rstrip(sqlInsertStatment[-1])
    sqlInsertStatment += ") as x (id, question_id, knowledge, motivation, custom_scale_value, text_value, user_username) WHERE EXISTS (SELECT 1 FROM question q WHERE q.id = x.question_id) ON CONFLICT DO NOTHING;"
    print(sqlInsertStatment)
    return sqlInsertStatment


def userSQL(file, start, end):
    sqlInsertStatment = (
        'INSERT INTO "user" (id, mail, group_id, organization_id)\nVALUES'
    )
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(str(uuid.uuid4()), isUUID=True)},{getValueOnSqlFormat(row.id)},"
            f"NULL,(SELECT o.id FROM organization o WHERE o.temp_org_id = {getValueOnSqlFormat(row.organizationID)})),"
        )
    sqlInsertStatment = (
        sqlInsertStatment.rstrip(sqlInsertStatment[-1])
        + " ON CONFLICT (mail) DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def groupSQL(file, start, end):
    sqlInsertStatment = (
        'INSERT INTO "group" (id, organization_id, group_leader_id)\nVALUES'
    )
    for row in file.loc[start:end].itertuples():
        sqlInsertStatment += (
            f"\n({getValueOnSqlFormat(row.id, isUUID=True)},"
            f"(SELECT o.id FROM organization o WHERE o.temp_org_id = {getValueOnSqlFormat(row.organizationID)}), (SELECT COALESCE((SELECT u.id FROM \"user\" u WHERE u.mail = {getValueOnSqlFormat(row.groupLeaderUsername)}), (SELECT du.id FROM \"user\" du WHERE du.mail = {getValueOnSqlFormat('dummyUser@dummy')})))),"
        )
    sqlInsertStatment = (
        sqlInsertStatment.rstrip(sqlInsertStatment[-1]) + " ON CONFLICT DO NOTHING;"
    )
    print(sqlInsertStatment)
    return sqlInsertStatment


def add_group_id_to_user(file, start, end):
    sqlUpdateStatement = ""
    for row in file.loc[start:end].itertuples():
        sqlUpdateStatement += f'UPDATE "user"\n SET group_id = {getValueOnSqlFormat(row.groupID)}\nWHERE mail = {getValueOnSqlFormat(row.id)};'
    print(sqlUpdateStatement)
    return sqlUpdateStatement


def add_active_catalog_to_organization():
    sqlUpdateStatement = ""
    sqlUpdateStatement += "UPDATE organization SET active_catalog_id = (SELECT id FROM catalog WHERE organization_id = organization.id ORDER BY created_at DESC LIMIT 1)"
    print(sqlUpdateStatement)
    return sqlUpdateStatement


def create_temp_column():
    return "ALTER TABLE organization ADD COLUMN IF NOT EXISTS temp_org_id VARCHAR(255) NOT NULL;"


def remove_temp_column():
    return "ALTER TABLE organization DROP COLUMN temp_org_id;"


def camel_to_snake_case(s):
    # Split the string into words using a regular expression
    if type(s) != type(""):
        return "NULL"
    words = re.findall(r"[A-Za-z][a-z]*", s)

    # Join the words with underscores and convert to lowercase
    snake_case_string = "_".join(words).lower()

    return snake_case_string
