jest.useFakeTimers()
import { DynamoDB } from "aws-sdk";
import {
  testUserOla,
  testUserKari,
  testUsers,
  userFormTestData,
  questionAnswerTestData,
} from "./testdata/adminqueries.db.dynamodb";
import dynamoDBTables from "./testdata/dynamodb.tables"

const userTableName = 'User'
const anonymizedUserTableName = 'AnonymizedUser'
const userFormTableName = 'UserForm'
const questionAnswerTableName = 'QuestionAnswer'
process.env['TABLE_MAP'] = JSON.stringify({
  'UserTable': userTableName,
  'AnonymizedUserTable': anonymizedUserTableName,
  'UserFormTable': userFormTableName,
  'QuestionAnswerTable': questionAnswerTableName,
})

const adminDbQueries = require('../backend/function/AdminQueries/db')
const { createHash } = require('crypto')

const dynamoDbConfig = {
  endpoint: 'http://localhost:8000',
  region: 'local',
  credentials: {
    accessKeyId: 'foo',
    secretAccessKey: 'foo'
  }
}

const docClient = new DynamoDB.DocumentClient(dynamoDbConfig)

// Create tables
beforeAll(async () => {
  const dynamoDBClient = new DynamoDB(dynamoDbConfig)
  await Promise.all(
    dynamoDBTables.map(async (table) => {
      return await dynamoDBClient.createTable(table).promise()
    })
  )
})

beforeEach(async () => {
  await emptyDatabaseTables()
  await fillDatabaseTables()
})

const emptyDatabaseTables = async () => {
  const [ users, userForms, questionAnswers ] = await Promise.all([
    docClient.scan({ TableName: userTableName }).promise(),
    docClient.scan({ TableName: userFormTableName }).promise(),
    docClient.scan({ TableName: questionAnswerTableName }).promise()
  ])

  await Promise.all([
    ...users.Items!.map(async (user: any) => {
      return docClient.delete({ TableName: userTableName, Key: {id: user.id} }).promise()
    }),
    ...userForms.Items!.map(async (userForm: any) => {
      return docClient.delete({ TableName: userFormTableName, Key: {id: userForm.id} }).promise()
    }),
    ...questionAnswers.Items!.map(async (qa: any) => {
      return docClient.delete({ TableName: questionAnswerTableName, Key: {id: qa.id} }).promise()
    })
  ])
}

const fillDatabaseTables = async () => {
  await Promise.all([
    ...testUsers.map(async (testUser) => {
      return docClient.put({ TableName: userTableName, Item: testUser }).promise()
    }),
    ...userFormTestData.map(async (userForm) => {
      return docClient.put({ TableName: userFormTableName, Item: userForm }).promise()
    }),
    ...questionAnswerTestData.map(async (questionAnswer) => {
      return docClient.put({ TableName: questionAnswerTableName, Item: questionAnswer }).promise()
    }),
  ])
}

test('DynamoDB has correct number of items', async () => {
  // Also validates testdata in case items have the same id
  // Count items in each table
  const [userScan, userFormScan, questionAnswerScan] = await Promise.all([
    docClient.scan({ TableName: userTableName, Select: "COUNT" }).promise(),
    docClient.scan({ TableName: userFormTableName, Select: "COUNT"}).promise(),
    docClient.scan({ TableName: questionAnswerTableName, Select: "COUNT"}).promise()
  ])

  // Assert correct number of items in each table
  expect(userScan["Count"]).toBe(testUsers.length)
  expect(userScan["ScannedCount"]).toBe(testUsers.length)

  expect(userFormScan["Count"]).toBe(userFormTestData.length)
  expect(userFormScan["ScannedCount"]).toBe(userFormTestData.length)

  expect(questionAnswerScan["Count"]).toBe(questionAnswerTestData.length)
  expect(questionAnswerScan["ScannedCount"]).toBe(questionAnswerTestData.length)
})


test('getUserFormsForUser returns correct number of items', async () => {
  // Get UserForms for testUsers Ola and Kari
  const [userFormsOla, userFormsKari] = await Promise.all([
    adminDbQueries.getUserFormsForUser(testUserOla.id),
    adminDbQueries.getUserFormsForUser(testUserKari.id)
  ])

  // Assert number of UserForms in db matches number of UserForms in testdata
  expect(userFormsOla.length).toBe(userFormTestData.filter((userForm) => userForm.owner == testUserOla.id).length)
  expect(userFormsKari.length).toBe(userFormTestData.filter((userForm) => userForm.owner == testUserKari.id).length)
})


test('getQuestionAnswersByUserFormId returns correct number of items', async () => {
  // Get userForms for testUserOla
  const userForms = await docClient
    .query({
      TableName: userFormTableName,
      IndexName: 'byCreatedAt',
      KeyConditionExpression: '#owner = :username',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':username': testUserOla.id,
      },
    })
    .promise()

    // Get questionAnswers for testUserOlas UserForms
    const questionAnswers = await Promise.all(
      userForms.Items!.map(async (userForm: any) => {
        return await adminDbQueries.getQuestionAnswersByUserFormId(userForm.id)
      })
    )
    // Count number of questionAnswers in db and in testdata for testUserOla
    const qaCountInDb = questionAnswers.map((qaList) => qaList.length).reduce((partialSum, currentSum) => partialSum + currentSum, 0)
    const qaCountInTestData = questionAnswerTestData.filter((qa) => qa.owner == testUserOla.id).length

    expect(qaCountInDb).toBe(qaCountInTestData)
})

test('Anonymizing user completely', async () => {
  const hashedId = createHash('sha256').update(testUserOla.id).digest('hex')

  const makeParams = (keyName: string, value: string) => {
    return {
      Select: "COUNT",
      FilterExpression : `#${keyName} = :value`,
      ExpressionAttributeNames: {
        [`#${keyName}`]: `${keyName}`,
      },
      ExpressionAttributeValues: {
        ':value': value
      }
    }
  }

  const olaOwnerParams = makeParams("owner", testUserOla.id)

  const olaHashOwnerParams = makeParams("owner", hashedId)
  const olaHashIdParams = makeParams("id", hashedId)

  const userScan = await docClient.scan({ 
    TableName: userTableName,
    Select: "COUNT" 
  }).promise()
  
  const userFormScan = await docClient.scan({ 
    TableName: userFormTableName, 
    ...olaOwnerParams 
  }).promise()

  const qaScan = await docClient.scan({ 
    TableName: questionAnswerTableName, 
    ...olaOwnerParams 
  }).promise()

  const userCountBeforeAnon = userScan["Count"] as number
  const userFormCountBeforeAnon = userFormScan["Count"]
  const qaCountBeforeAnon = qaScan["Count"]

  // Anonymize user
  await adminDbQueries.anonymizeUser(testUserOla.id, hashedId, testUserOla.organizationID)

  // Check user was added to the anonymized table with correct id, and is the only one added
  const anonWithHashScan = await docClient.scan({ 
    TableName: anonymizedUserTableName,
    ...olaHashIdParams
  }).promise()

  expect(anonWithHashScan["Count"]).toBe(1)

  const anonScan = await docClient.scan({ 
    TableName: anonymizedUserTableName, 
    Select: "COUNT" })
  .promise()

  expect(anonScan["Count"]).toBe(1)

  // Check that user with original id is not in users table
  const userScanAfterAnon = await docClient.scan({ 
    TableName: userTableName,
    Select: "COUNT",
  }).promise()

  expect(userScanAfterAnon["Count"]).toBe(userCountBeforeAnon - 1)

  // Check that the owner id has been replaced with the hash in UserForm-table
  const userformOlaScan = await docClient.scan({ 
    TableName: userFormTableName,
    ...olaOwnerParams,
  }).promise()

  expect(userformOlaScan["Count"]).toBe(0)

  const userformHashScan = await docClient.scan({
    TableName: userFormTableName, 
    ...olaHashOwnerParams,
  }).promise()
  expect(userformHashScan["Count"]).toBe(userFormCountBeforeAnon)

  // Check that the owner id has been replaced with the hash in QuestionAnswer-table
  const qaOlaScan = await docClient.scan({ 
    TableName: questionAnswerTableName,
    ...olaOwnerParams,
  }).promise()

  expect(qaOlaScan["Count"]).toBe(0)

  const qaHashScan = await docClient.scan({
    TableName: questionAnswerTableName, 
    ...olaHashOwnerParams,
  }).promise()

  expect(qaHashScan["Count"]).toBe(qaCountBeforeAnon)
})

test('Test anonymization on partially completed anonymization of QuestionAnswers', async () => {
  const hashedKari = createHash('sha256').update(testUserKari.id).digest('hex')

  // Get all ids for Kari's answers
  const kariqaidsScan = await docClient.scan({
    TableName: questionAnswerTableName,
    FilterExpression: '#owner = :karid',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    },
    ExpressionAttributeValues: {
      ':karid': testUserKari.id
    }
  }).promise()

  const karinaqaids = kariqaidsScan.Items!.map(i => i.id)

  // Mock incomplete anonymization by anonymizing only one row
  await docClient.update({
    TableName: questionAnswerTableName,
    Key: { id: karinaqaids[0] },
    UpdateExpression: 'SET #owner = :hash',
    ExpressionAttributeNames: { '#owner': 'owner' },
    ExpressionAttributeValues: { ':hash': hashedKari }
  }).promise()

  // Mock incomplete anonymization 
  const incompleteScan = await docClient.scan({
    TableName: questionAnswerTableName,
    FilterExpression: '#owner = :karid',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    },
    ExpressionAttributeValues: {
      ':karid': testUserKari.id
    }
  }).promise()

  expect(incompleteScan["Count"]).toBe(kariqaidsScan["Count"]! - 1)

  // Anonymize 
  await adminDbQueries.anonymizeUser(testUserKari.id, hashedKari, testUserKari.organizationID)

  // Check there that id has been replaced with hash
  const kariqaidsScanAfterAnon = await docClient.scan({
    TableName: questionAnswerTableName,
    FilterExpression: '#owner = :karid',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    },
    ExpressionAttributeValues: {
      ':karid': testUserKari.id
    }
  }).promise()

  expect(kariqaidsScanAfterAnon["Count"]).toBe(0)

  const hashedKariqaidsScanAfterAnon = await docClient.scan({
    TableName: questionAnswerTableName,
    FilterExpression: '#owner = :karid',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    },
    ExpressionAttributeValues: {
      ':karid': hashedKari
    }
  }).promise()

  expect(hashedKariqaidsScanAfterAnon["Count"]).toBe(karinaqaids.length)
})
