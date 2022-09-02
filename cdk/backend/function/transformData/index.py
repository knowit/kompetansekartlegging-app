import boto3
from os import environ
import pandas as pd
from io import StringIO

s3Resource = boto3.resource("s3")
s3BucketFrom = environ.get("EXPORT_BUCKET")
s3BucketTo = environ.get("TRANSFORMED_DATA_BUCKET")
env = environ.get("ENV")
sourceName = environ.get("SOURCE_NAME")
s3 = boto3.resource("s3")

def handler(event, context):
    transform("Organization",appendEmptyColumnsNames=["owner"])
    transform("User")
    transform("APIKeyPermission")
    transform("Category")
    transform("FormDefinition", removeColumns=["sortKeyConstant"])
    transform("Group")
    transform("Question", removeColumns=["qid"]) #what is qid, is either empty or marked with <empty> on dynamoDB
    transform("QuestionAnswer", appendEmptyColumnsNames=["textValue"])
    transform("UserForm")

def getFileName(name):
    return f"{name}-{sourceName}-{env}.csv"

def transform(name, removeColumns=[], appendEmptyColumnsNames=[]):
    key = getFileName(name)
    csvPdFile = getPandasCSVFile(key)
    dropColumns(csvPdFile, removeColumns)
    if appendEmptyColumnsNames:
        csvPdFile = appendEmptyColumns(csvPdFile, appendEmptyColumnsNames)
    csvFile = csvPdFile.to_csv(index=False)
    newFileKey = "transformed-"+ key
    s3.Bucket(s3BucketTo).put_object(Key=newFileKey, Body=csvFile)

def getPandasCSVFile(key):
    s3Object = s3Resource.Object(s3BucketFrom, key)
    fileContent = s3Object.get()["Body"].read().decode("utf-8")
    csvString = StringIO(fileContent)
    return pd.read_csv(csvString, sep=",",header=[0])
    
def dropColumns(csvPdFile,colums = []):
    dropColumns = ["__typename", "orgAdmins", "orgGroupLeaders"]
    dropColumns.extend(colums)
    dropColumns = csvPdFile.filter(dropColumns)
    csvPdFile.drop(dropColumns, inplace=True, axis=1)

def appendEmptyColumns(csvPdFile, columns):
    return csvPdFile.reindex([*csvPdFile.columns, *columns], axis ='columns', fill_value="")
    







