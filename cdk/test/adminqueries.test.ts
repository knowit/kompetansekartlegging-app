import { randomUUID } from 'crypto'
import {
  anonymizedIDAttributeName,
  cognitoIdentityServiceProvider,
  createTables,
  deleteTables,
  docClient,
  emptyDatabaseTables,
  fillDatabaseTable,
  getQuestionAnswersForUser,
  getUserFormsForUser,
  userPoolID,
} from './common'
import {
  olaQuestionAnswersInTestData,
  olaUserFormsInTestData,
  questionAnswerTestData,
  testUserOla,
  testUsers,
  userFormTestData,
} from './testdata/adminqueries.db.dynamodb'
const supertest = require('supertest')

const userTableName = 'User'
const anonymizedUserTableName = 'AnonymizedUser'
const userFormTableName = 'UserForm'
const questionAnswerTableName = 'QuestionAnswer'
process.env['TABLE_MAP'] = JSON.stringify({
  UserTable: userTableName,
  AnonymizedUserTable: anonymizedUserTableName,
  UserFormTable: userFormTableName,
  QuestionAnswerTable: questionAnswerTableName,
})

beforeAll(async () => {
  await createTables()
  /**const pool = await cognitoIdentityServiceProvider.createUserPool({
    PoolName: 'poolname',
    AutoVerifiedAttributes: ['email'],
  }).promise()*/

  await cognitoIdentityServiceProvider
    .addCustomAttributes({
      CustomAttributes: [
        {
          Name: 'anonymizedID',
        },
      ],
      UserPoolId: userPoolID,
    })
    .promise()
})

const { app, server } = require('../backend/function/AdminQueries/app')
const request = supertest(app)

afterAll(async () => {
  await deleteTables()
  await server.close()
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

const assertZeroQuestionAnswersAndUserFormsInDatabaseForUser = async (
  username: string
) => {
  // Assert no UserForms has username as owner
  const userForms = await docClient
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
  expect(userForms.Count).toBe(0)

  // Assert no QuestionAnswers has username as owner
  const questionAnswers = await docClient
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
  expect(questionAnswers.Count).toBe(0)
}

test('DynamoDB has expected number of items', async () => {
  const userFormsOla = await getUserFormsForUser(testUserOla.id)

  expect(userFormsOla.Count).toBe(
    userFormTestData.filter(userForm => userForm.owner == testUserOla.id).length
  )

  const questionAnswersOla = await Promise.all(
    userFormsOla.Items!.map(async (userForm: any) => {
      return await docClient
        .query({
          TableName: questionAnswerTableName,
          IndexName: 'byUserForm',
          KeyConditionExpression: 'userFormID = :userFormId',
          ExpressionAttributeValues: {
            ':userFormId': userForm.id,
          },
          ConsistentRead: false,
        })
        .promise()
    })
  )
  // Count number of questionAnswers in db and in testdata for testUserOla
  const qaCountInDb = questionAnswersOla
    .map(qaList => qaList)
    .reduce((partialSum, currentSum) => partialSum + currentSum.Count!, 0)
  const qaCountInTestData = questionAnswerTestData.filter(
    qa => qa.owner == testUserOla.id
  ).length
  expect(qaCountInDb).toBe(qaCountInTestData)
})

test('Anonymize user happy day scenario', async () => {
  await cognitoIdentityServiceProvider
    .adminCreateUser({
      Username: testUserOla.id,
      UserPoolId: userPoolID,
      DesiredDeliveryMediums: ['EMAIL'],
    })
    .promise()

  // Anonymize testUserOla
  await request
    .post('/anonymizeUser')
    .send({
      username: testUserOla.id,
      orgId: testUserOla.organizationID,
    })
    .expect(200)

  // Assert testUserOlas Cognito user no longer exists
  let userNotFound = false
  try {
    await cognitoIdentityServiceProvider
      .adminGetUser({
        UserPoolId: userPoolID,
        Username: testUserOla.id,
      })
      .promise()
  } catch (e: any) {
    if (e.code === 'UserNotFoundException') {
      userNotFound = true
    }
  }
  expect(userNotFound).toBe(true)

  // Assert that no UserForms or QuestionAnswers has testUserOla.id as owner
  await assertZeroQuestionAnswersAndUserFormsInDatabaseForUser(testUserOla.id)
})

test('Anonymize user second attempt (mock failed first anonymization run)', async () => {
  const olaAnonymizedID = randomUUID()

  // Create Cognito user with anonymizedID attribute
  await cognitoIdentityServiceProvider
    .adminCreateUser({
      Username: testUserOla.id,
      UserPoolId: userPoolID,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: anonymizedIDAttributeName,
          Value: olaAnonymizedID,
        },
      ],
    })
    .promise()

  // Anonymize one of testUserOlas UserForms and its associated QuestionAnswers
  const singleUserFormOla = userFormTestData.find(
    userForm => userForm.owner === testUserOla.id
  )!
  const questionAnswersForSingleUserForm = questionAnswerTestData.filter(
    qa => qa.userFormID === singleUserFormOla!.id
  )

  await Promise.all(
    questionAnswersForSingleUserForm.map(questionAnswer =>
      docClient
        .update({
          TableName: questionAnswerTableName,
          Key: { id: questionAnswer.id },
          UpdateExpression: 'SET #owner = :olaAnonymizedID',
          ExpressionAttributeNames: { '#owner': 'owner' },
          ExpressionAttributeValues: { ':olaAnonymizedID': olaAnonymizedID },
        })
        .promise()
    )
  )

  await docClient
    .update({
      TableName: userFormTableName,
      Key: { id: singleUserFormOla.id },
      UpdateExpression: 'SET #owner = :olaAnonymizedID',
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':olaAnonymizedID': olaAnonymizedID },
    })
    .promise()

  // Assert that only singleUserForm and associated QuestionAnswers were anonymized
  const olaUserFormsInDb = await getUserFormsForUser(testUserOla.id)
  const olaQuestionAnswersInDb = await getQuestionAnswersForUser(testUserOla.id)

  const otherUserFormsOla = olaUserFormsInTestData.filter(
    userForm => userForm != singleUserFormOla
  )
  expect(olaUserFormsInDb.Count).toBe(otherUserFormsOla.length)

  const otherQuestionAnswersOla = olaQuestionAnswersInTestData.filter(
    qa => qa.userFormID != singleUserFormOla.id
  )
  expect(olaQuestionAnswersInDb.Count).toBe(otherQuestionAnswersOla.length)

  // Anonymize testUserOla
  await request
    .post('/anonymizeUser')
    .send({
      username: testUserOla.id,
      orgId: testUserOla.organizationID,
    })
    .expect(200)

  // Assert that no UserForms or QuestionAnswers has testUserOla.id as owner
  await assertZeroQuestionAnswersAndUserFormsInDatabaseForUser(testUserOla.id)

  // Assert that the number of UserForms and QuestionAnswers is equal in db and testdata, for testUserOla
  const olaAnonymizedUserFormsInDb = await getUserFormsForUser(olaAnonymizedID)
  const olaAnonymizedQuestionAnswersInDb = await getQuestionAnswersForUser(
    olaAnonymizedID
  )

  expect(olaAnonymizedUserFormsInDb.Count).toBe(olaUserFormsInTestData.length)
  expect(olaAnonymizedQuestionAnswersInDb.Count).toBe(
    olaQuestionAnswersInTestData.length
  )
})
