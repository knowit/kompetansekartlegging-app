import { randomUUID } from 'crypto'
import {
  testUserOla,
  testUserKari,
  testUsers,
  userFormTestData,
  questionAnswerTestData,
  testUserOlaLastUserFormUpdatedAt,
  olaUserFormsInTestData,
  kariUserFormsInTestData,
  olaQuestionAnswersInTestData,
} from './testdata/dynamodb.items'
import {
  docClient,
  userTableName,
  anonymizedUserTableName,
  userFormTableName,
  questionAnswerTableName,
  getUserFormsForUser,
  getQuestionAnswersForUser,
  fillAllDatabaseTables,
  deleteAllDatabaseTables,
  emptyAllDatabaseTables,
  countItems,
} from './common'

const adminDbQueries = require('../backend/function/AdminQueries/db')

afterAll(async () => {
  await deleteAllDatabaseTables()
})

beforeEach(async () => {
  await emptyAllDatabaseTables()
  await fillAllDatabaseTables()
})

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

test('Test Anonymizing user: happy day scenario', async () => {
  // Set up scan paramters
  const anonymizedID = randomUUID()
  const olaOwnerParams = { keyName: 'owner', value: testUserOla.id }
  const anonymizedOlaIdParams = { keyName: 'id', value: anonymizedID }

  // Count items before anonymizing for comparison
  const userCountBeforeAnon = await countItems(userTableName)
  const userFormCountBeforeAnon = await countItems(
    userFormTableName,
    olaOwnerParams
  )
  const qaCountBeforeAnon = await countItems(
    questionAnswerTableName,
    olaOwnerParams
  )

  // Anonymize user
  await adminDbQueries.anonymizeUser(
    testUserOla.id,
    anonymizedID,
    testUserOla.organizationID
  )

  // Check that we now have one anonymized user (Ola) and one less in Users table
  const anonWithanonymizedIDCount = await countItems(
    anonymizedUserTableName,
    anonymizedOlaIdParams
  )
  expect(anonWithanonymizedIDCount).toBe(1)

  const anonymizedUserCount = await countItems(anonymizedUserTableName)
  expect(anonymizedUserCount).toBe(1)

  const userCountAfterAnon = await countItems(userTableName)
  expect(userCountAfterAnon).toBe(userCountBeforeAnon - 1)

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
  // Set up scan paramters
  const anonymizedID = randomUUID()
  const kariOwnerParams = { keyName: 'owner', value: testUserKari.id }
  const kariAnonymizedParams = { keyName: 'owner', value: anonymizedID }

  // Get all ids for Kari's answers
  const kariIDQAScan = await docClient
    .scan({
      TableName: questionAnswerTableName,
      FilterExpression: '#owner = :kariID',
      ExpressionAttributeNames: {
        '#owner': 'owner',
      },
      ExpressionAttributeValues: {
        ':kariID': testUserKari.id,
      },
    })
    .promise()

  const kariAnswersIDs = kariIDQAScan.Items!.map(i => i.id)
  const kariIDQACount = await countItems(
    questionAnswerTableName,
    kariOwnerParams
  )

  // Mock incomplete anonymization by anonymizing only one row
  await docClient
    .update({
      TableName: questionAnswerTableName,
      Key: { id: kariAnswersIDs[0] },
      UpdateExpression: 'SET #owner = :anonymizedID',
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':anonymizedID': anonymizedID },
    })
    .promise()

  // Find matches for Kari's original id after incomplete anonymization
  const incompleteCount = await countItems(
    questionAnswerTableName,
    kariOwnerParams
  )
  expect(incompleteCount).toBe(kariIDQACount - 1)

  // Anonymize
  await adminDbQueries.anonymizeUser(
    testUserKari.id,
    anonymizedID,
    testUserKari.organizationID
  )

  // Check there that id has been replaced with new id
  // First check instances of original id
  const kariIDQACountAfterAnon = await countItems(
    questionAnswerTableName,
    kariOwnerParams
  )
  expect(kariIDQACountAfterAnon).toBe(0)

  // Then check instances of anonymized id
  const kariAnonymizedIDQACountAfterAnon = await countItems(
    questionAnswerTableName,
    kariAnonymizedParams
  )
  expect(kariAnonymizedIDQACountAfterAnon).toBe(kariAnswersIDs.length)
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
