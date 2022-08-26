import boto3
from os import environ

def handler(event, context):
    dbARN = environ.get("DATABASE_ARN")
    secretARN = environ.get("SECRET_ARN")
    dbName = environ.get("DATABASE_NAME")
    print("Initializing the database...")

    with open("schema.sql", "r") as f:
        sql_sqript = f.read().rstrip("\n")

    #print(sql_sqript)

    db_client = boto3.client('rds-data')

    response = db_client.execute_statement(
        resourceArn = dbARN,
        secretArn = secretARN,
        database = dbName,
        sql = sql_sqript
    )

    print(str(response))

    
