import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk'
import {
  questionAnswerTestData,
  testUsers,
  userFormTestData,
} from './testdata/dynamodb.items'
import dynamoDBTables from './testdata/dynamodb.tables'

export const userTableName = 'User'
export const anonymizedUserTableName = 'AnonymizedUser'
export const userFormTableName = 'UserForm'
export const questionAnswerTableName = 'QuestionAnswer'

process.env['TABLE_MAP'] = JSON.stringify({
  UserTable: userTableName,
  AnonymizedUserTable: anonymizedUserTableName,
  UserFormTable: userFormTableName,
  QuestionAnswerTable: questionAnswerTableName,
})

const dynamoDbConfig = {
  endpoint: 'http://localhost:8000',
  region: 'local',
  credentials: {
    accessKeyId: 'foo',
    secretAccessKey: 'foo',
  },
}

export const dynamoDBClient = new DynamoDB(dynamoDbConfig)
export const docClient = new DynamoDB.DocumentClient(dynamoDbConfig)

export const userPoolID = 'id'
export const anonymizedIDAttributeName = 'custom:anonymizedID'
process.env['USERPOOL'] = userPoolID
process.env['ANONYMIZED_ID_ATTRIBUTE_NAME'] = anonymizedIDAttributeName
export const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(
  {
    region: 'local',
    endpoint: 'http://localhost:9229',
    credentials: {
      accessKeyId: 'foo',
      secretAccessKey: 'foo',
    },
  }
)

export const createCognitoUser = async (username: string) => {
  await cognitoIdentityServiceProvider
    .adminCreateUser({
      Username: username,
      UserPoolId: userPoolID,
      DesiredDeliveryMediums: ['EMAIL'],
    })
    .promise()
}

export const createAllDatabaseTables = async () => {
  await Promise.all(
    dynamoDBTables.map(table => dynamoDBClient.createTable(table).promise())
  )
}

export const deleteAllDatabaseTables = async () => {
  const tables = await dynamoDBClient.listTables().promise()
  if (tables.TableNames) {
    await Promise.all(
      tables.TableNames.map(tableName =>
        dynamoDBClient.deleteTable({ TableName: tableName }).promise()
      )
    )
  }
}

export const emptyDatabaseTable = async (tableName: string) => {
  const scan = await docClient.scan({ TableName: tableName }).promise()

  if (scan.Items) {
    await Promise.all(
      scan.Items.map(item =>
        docClient
          .delete({ TableName: tableName, Key: { id: item.id } })
          .promise()
      )
    )
  }
}

export const emptyAllDatabaseTables = async () => {
  // Delete and recreate tables (cleaner than scanning each table and then deleting items)
  await deleteAllDatabaseTables()
  await createAllDatabaseTables()
}

export const fillDatabaseTable = async (tableName: string, items: Object[]) => {
  await Promise.all(
    items.map(item =>
      docClient.put({ TableName: tableName, Item: item }).promise()
    )
  )
}

export const fillAllDatabaseTables = async () => {
  await Promise.all([
    fillDatabaseTable(userTableName, testUsers),
    fillDatabaseTable(userFormTableName, userFormTestData),
    fillDatabaseTable(questionAnswerTableName, questionAnswerTestData),
  ])
}

export const getUserFormsForUser = async (username: string) => {
  return await docClient
    .query({
      TableName: userFormTableName,
      IndexName: 'byCreatedAt',
      KeyConditionExpression: '#owner = :username',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    })
    .promise()
}

export const getQuestionAnswersForUser = async (username: string) => {
  return await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :username',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    })
    .promise()
}

export const countItems = async (
  tableName: string,
  params?: { [key: string]: string | { [key: string]: string } }
) => {
  if (params) {
    params = {
      ...params,
      FilterExpression: `#${params.keyName} = :value`,
      ExpressionAttributeNames: {
        [`#${params.keyName}`]: `${params.keyName}`,
      },
      ExpressionAttributeValues: {
        ':value': `${params.value}`,
      },
    }
  } else {
    params = {}
  }

  const scan = await docClient
    .scan({
      TableName: tableName,
      Select: 'COUNT',
      ...params,
    })
    .promise()

  return scan['Count'] as number
}
