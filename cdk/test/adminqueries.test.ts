import { randomUUID } from 'crypto'
import {
  anonymizedIDAttributeName,
  cognitoIdentityServiceProvider,
  createAllDatabaseTables,
  createCognitoUser,
  deleteAllDatabaseTables,
  docClient,
  emptyAllDatabaseTables,
  fillDatabaseTable,
  getQuestionAnswersForUser,
  getUserFormsForUser,
  questionAnswerTableName,
  userFormTableName,
  userPoolID,
  userTableName,
} from './common'
import {
  olaQuestionAnswersInTestData,
  olaUserFormsInTestData,
  testUserOla,
} from './testdata/dynamodb.items'
const supertest = require('supertest')

const { server } = require('../backend/function/AdminQueries/app')
const request = supertest(server)

beforeAll(async () => {
  await createAllDatabaseTables()
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

afterAll(async () => {
  await deleteAllDatabaseTables()
  await server.close()
})

beforeEach(async () => {
  await emptyAllDatabaseTables()
  await Promise.all([
    fillDatabaseTable(userTableName, [testUserOla]),
    fillDatabaseTable(userFormTableName, olaUserFormsInTestData),
    fillDatabaseTable(questionAnswerTableName, olaQuestionAnswersInTestData),
  ])
})

const assertUserWasAnonymizedProperly = async (username: string) => {
  const user = await docClient
    .query({
      TableName: userTableName,
      KeyConditionExpression: '#id = :username',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':username': username,
      },
    })
    .promise()
  const userForms = await getUserFormsForUser(username)
  const questionAnswers = await getQuestionAnswersForUser(username)

  expect(user.Count).toBe(0)
  expect(userForms.Count).toBe(0)
  expect(questionAnswers.Count).toBe(0)

  // Assert testUserOlas Cognito user no longer exists
  let userNotFound = false

  // prettier-ignore
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
}

test('DynamoDB has all of testUserOlas items', async () => {
  const userFormsOla = await getUserFormsForUser(testUserOla.id)

  expect(userFormsOla.Count).toBe(olaUserFormsInTestData.length)

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

  expect(qaCountInDb).toBe(olaQuestionAnswersInTestData.length)
})

test('Anonymize user happy day scenario', async () => {
  await createCognitoUser(testUserOla.id)

  // Anonymize testUserOla
  await request
    .post('/anonymizeUser')
    .send({
      username: testUserOla.id,
      orgId: testUserOla.organizationID,
    })
    .expect(200)

  await assertUserWasAnonymizedProperly(testUserOla.id)
})

test('Anonymize partially anonymized user', async () => {
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

  // Anonymize testUserOlas QuestionAnswers for a single UserForm
  const singleUserFormOla = olaUserFormsInTestData[0]
  const questionAnswersForSingleUserForm = olaQuestionAnswersInTestData.filter(
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

  // Assert that only QuestionAnswers associated with singleUserForm were anonymized
  const olaUserFormsInDb = await getUserFormsForUser(testUserOla.id)
  const olaQuestionAnswersInDb = await getQuestionAnswersForUser(testUserOla.id)

  expect(olaUserFormsInDb.Count).toBe(olaUserFormsInTestData.length)

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

  await assertUserWasAnonymizedProperly(testUserOla.id)

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
