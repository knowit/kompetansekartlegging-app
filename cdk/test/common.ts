import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk'
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

export const createTables = async () => {
  await Promise.all(
    dynamoDBTables.map(async table => {
      return await dynamoDBClient.createTable(table).promise()
    })
  )
}

export const deleteTables = async () => {
  await Promise.all(
    dynamoDBTables.map(async table => {
      return await dynamoDBClient
        .deleteTable({ TableName: table.TableName })
        .promise()
    })
  )
}

export const emptyDatabaseTables = async () => {
  const [
    users,
    userForms,
    questionAnswers,
    anonymizedUsers,
  ] = await Promise.all([
    docClient.scan({ TableName: userTableName }).promise(),
    docClient.scan({ TableName: userFormTableName }).promise(),
    docClient.scan({ TableName: questionAnswerTableName }).promise(),
    docClient.scan({ TableName: anonymizedUserTableName }).promise(),
  ])

  await Promise.all([
    ...users.Items!.map(async (user: any) => {
      return docClient
        .delete({ TableName: userTableName, Key: { id: user.id } })
        .promise()
    }),
    ...userForms.Items!.map(async (userForm: any) => {
      return docClient
        .delete({ TableName: userFormTableName, Key: { id: userForm.id } })
        .promise()
    }),
    ...questionAnswers.Items!.map(async (qa: any) => {
      return docClient
        .delete({ TableName: questionAnswerTableName, Key: { id: qa.id } })
        .promise()
    }),
    ...anonymizedUsers.Items!.map(async (qa: any) => {
      return docClient
        .delete({ TableName: anonymizedUserTableName, Key: { id: qa.id } })
        .promise()
    }),
  ])
}

export const fillDatabaseTable = async (tableName: string, items: Object[]) => {
  await Promise.all(
    items.map(async item =>
      docClient.put({ TableName: tableName, Item: item }).promise()
    )
  )
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
