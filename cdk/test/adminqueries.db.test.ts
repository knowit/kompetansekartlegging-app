import { randomUUID } from 'crypto'
import {
  testUserOla,
  testUserKari,
  testUsers,
  userFormTestData,
  questionAnswerTestData,
  testUserOlaLastUserFormUpdatedAt,
  kariUserFormsInTestData,
  olaUserFormsInTestData,
  olaQuestionAnswersInTestData,
} from './testdata/adminqueries.db.dynamodb'
import {
  docClient,
  createTables,
  emptyDatabaseTables,
  userTableName,
  anonymizedUserTableName,
  userFormTableName,
  questionAnswerTableName,
  fillDatabaseTable,
  deleteTables,
  getUserFormsForUser,
  getQuestionAnswersForUser,
} from './common'

const adminDbQueries = require('../backend/function/AdminQueries/db')

beforeAll(async () => {
  await createTables()
})

afterAll(async () => {
  await deleteTables()
})

beforeEach(async () => {
  await emptyDatabaseTables()
  await fillDatabaseTables()
})

const fillDatabaseTables = async () => {
  await Promise.all([
    fillDatabaseTable(userTableName, testUsers),
    fillDatabaseTable(userFormTableName, userFormTestData),
    fillDatabaseTable(questionAnswerTableName, questionAnswerTestData),
  ])
}

test('DynamoDB has correct number of items', async () => {
  // Also validates testdata in case items have the same id
  // Count items in each table
  const [userScan, userFormScan, questionAnswerScan] = await Promise.all([
    docClient.scan({ TableName: userTableName, Select: 'COUNT' }).promise(),
    docClient.scan({ TableName: userFormTableName, Select: 'COUNT' }).promise(),
    docClient
      .scan({ TableName: questionAnswerTableName, Select: 'COUNT' })
      .promise(),
  ])

  // Assert correct number of items in each table
  expect(userScan['Count']).toBe(testUsers.length)
  expect(userScan['ScannedCount']).toBe(testUsers.length)

  expect(userFormScan['Count']).toBe(userFormTestData.length)
  expect(userFormScan['ScannedCount']).toBe(userFormTestData.length)

  expect(questionAnswerScan['Count']).toBe(questionAnswerTestData.length)
  expect(questionAnswerScan['ScannedCount']).toBe(questionAnswerTestData.length)
})

test('getUserFormsForUser returns correct number of items', async () => {
  // Get UserForms for testUsers Ola and Kari
  const [userFormsOla, userFormsKari] = await Promise.all([
    adminDbQueries.getUserFormsForUser(testUserOla.id),
    adminDbQueries.getUserFormsForUser(testUserKari.id),
  ])

  // Assert number of UserForms in db matches number of UserForms in testdata
  expect(userFormsOla.length).toBe(olaUserFormsInTestData.length)
  expect(userFormsKari.length).toBe(kariUserFormsInTestData.length)
})

test('getQuestionAnswersByUserFormId returns correct number of items', async () => {
  // Get userForms for testUserOla
  const userForms = await getUserFormsForUser(testUserOla.id)

  // Get questionAnswers for testUserOlas UserForms
  const questionAnswers = await Promise.all(
    userForms.Items!.map(async (userForm: any) => {
      return await adminDbQueries.getQuestionAnswersByUserFormId(userForm.id)
    })
  )
  // Count number of questionAnswers in db and in testdata for testUserOla
  const qaCountInDb = questionAnswers
    .map(qaList => qaList.length)
    .reduce((partialSum, currentSum) => partialSum + currentSum, 0)

  expect(qaCountInDb).toBe(olaQuestionAnswersInTestData.length)
})

test('Test Anonymizing user: sunny day scenario', async () => {
  const anonymizedID = randomUUID()

  const makeParams = (keyName: string, value: string) => {
    return {
      Select: 'COUNT',
      FilterExpression: `#${keyName} = :value`,
      ExpressionAttributeNames: {
        [`#${keyName}`]: `${keyName}`,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
    }
  }

  const olaOwnerParams = makeParams('owner', testUserOla.id)
  const anonymizedOlaOwnerParams = makeParams('owner', anonymizedID)
  const anonymizedOlaIdParams = makeParams('id', anonymizedID)

  const userScan = await docClient
    .scan({
      TableName: userTableName,
      Select: 'COUNT',
    })
    .promise()

  const userFormScan = await docClient
    .scan({
      TableName: userFormTableName,
      ...olaOwnerParams,
    })
    .promise()

  const qaScan = await docClient
    .scan({
      TableName: questionAnswerTableName,
      ...olaOwnerParams,
    })
    .promise()

  const userCountBeforeAnon = userScan['Count'] as number
  const userFormCountBeforeAnon = userFormScan['Count']
  const qaCountBeforeAnon = qaScan['Count']

  // Anonymize user
  await adminDbQueries.anonymizeUser(
    testUserOla.id,
    anonymizedID,
    testUserOla.organizationID
  )

  // Check user was added to the anonymized table with correct id, and is the only one added
  const anonWithanonymizedIDScan = await docClient
    .scan({
      TableName: anonymizedUserTableName,
      ...anonymizedOlaIdParams,
    })
    .promise()

  expect(anonWithanonymizedIDScan['Count']).toBe(1)

  const anonUserScan = await docClient
    .scan({
      TableName: anonymizedUserTableName,
      Select: 'COUNT',
    })
    .promise()

  expect(anonUserScan['Count']).toBe(1)

  // Check that user with Ola's original id is not in users table
  const userScanAfterAnon = await docClient
    .scan({
      TableName: userTableName,
      Select: 'COUNT',
    })
    .promise()

  expect(userScanAfterAnon['Count']).toBe(userCountBeforeAnon - 1)

  // Check that the owner id has been replaced with the new id in UserForm-table
  const userformOlaScan = await getUserFormsForUser(testUserOla.id)

  expect(userformOlaScan['Count']).toBe(0)

  const userformanonymizedIDScan = await getUserFormsForUser(anonymizedID)

  expect(userformanonymizedIDScan['Count']).toBe(userFormCountBeforeAnon)

  // Check that the owner id has been replaced with the new id in QuestionAnswer-table
  const qaOlaScan = await getUserFormsForUser(testUserOla.id)

  expect(qaOlaScan['Count']).toBe(0)

  const qaanonymizedIDScan = await getQuestionAnswersForUser(anonymizedID)

  expect(qaanonymizedIDScan['Count']).toBe(qaCountBeforeAnon)
})

test('Test anonymization on partially completed anonymization of QuestionAnswers', async () => {
  const anonymizedID = randomUUID()

  // Get all ids for Kari's answers
  const kIdQAScan = await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :karid',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':karid': testUserKari.id,
      },
    })
    .promise()

  const kIds = kIdQAScan.Items!.map(i => i.id)

  // Mock incomplete anonymization by anonymizing only one row
  await docClient
    .update({
      TableName: questionAnswerTableName,
      Key: { id: kIds[0] },
      UpdateExpression: 'SET #owner = :anonymizedID',
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':anonymizedID': anonymizedID },
    })
    .promise()

  // Find matches for Kari's original id after incomplete anonymization
  const incompleteScan = await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :karid',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':karid': testUserKari.id,
      },
    })
    .promise()

  expect(incompleteScan['Count']).toBe(kIdQAScan['Count']! - 1)

  // Anonymize
  await adminDbQueries.anonymizeUser(
    testUserKari.id,
    anonymizedID,
    testUserKari.organizationID
  )

  // Check there that id has been replaced with new id
  const kIdQAScanAfterAnon = await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :karid',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':karid': testUserKari.id,
      },
    })
    .promise()

  expect(kIdQAScanAfterAnon['Count']).toBe(0)

  const anonymizedkIdQAScanAfterAnon = await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :anonymizedID',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':anonymizedID': anonymizedID,
      },
    })
    .promise()

  expect(anonymizedkIdQAScanAfterAnon['Count']).toBe(kIds.length)
})

test('AnonymizedUserTable lastAnswerAt matches users last UserForm updatedAt', async () => {
  // Anonymize testUserOla
  await adminDbQueries.anonymizeUser(
    testUserOla.id,
    randomUUID(),
    testUserOla.organizationID
  )

  // Get anonymized user
  const anonymizedUsersScan = await docClient
    .scan({
      TableName: anonymizedUserTableName,
    })
    .promise()

  // Assert only one user has been anonymized,
  // and that lastAnswerAt matches testUserOlas last UserForm updatedAt
  expect(anonymizedUsersScan.Count).toBe(1)
  expect(anonymizedUsersScan.Items![0].lastAnswerAt).toBe(
    testUserOlaLastUserFormUpdatedAt
  )
})
