import {
  testUserOla,
  testUserKari,
  testUsers,
  userFormTestData,
  questionAnswerTestData
} from "./testdata/adminqueries.db.dynamodb";

const userTableName = 'User'
const userFormTableName = 'UserForm'
const questionAnswerTableName = 'QuestionAnswer'
const tableMap = {
  'QuestionAnswerTable': questionAnswerTableName,
  'UserFormTable': userFormTableName,
  'UserTable': userTableName,
}
process.env['TABLE_MAP'] = JSON.stringify(tableMap)
process.env['AWS_ACCESS_KEY_ID'] = 'accessKeyId'
process.env['AWS_SECRET_ACCESS_KEY'] = 'secretAccessKey'

const {DocumentClient} = require('aws-sdk/clients/dynamodb');
const adminDbQueries = require('../backend/function/AdminQueries/db')

const docClient = new DocumentClient({
  convertEmptyValues: true,
  endpoint: 'localhost:8000',
  sslEnabled: false,
  region: 'local-env',
});


beforeEach(async () => {
  await emptyDatabase()
  await fillDatabase()
})

const emptyDatabase = async () => {
  const [ users, userForms, questionAnswers ] = await Promise.all([
    docClient.scan({ TableName: userTableName }).promise(),
    docClient.scan({ TableName: userFormTableName }).promise(),
    docClient.scan({ TableName: questionAnswerTableName }).promise()
  ])

  await Promise.all([
    ...users.Items.map(async (user: any) => {
      return docClient.delete({ TableName: userTableName, Key: {id: user.id} }).promise()
    }),
    ...userForms.Items.map(async (userForm: any) => {
      return docClient.delete({ TableName: userFormTableName, Key: {id: userForm.id} }).promise()
    }),
    ...questionAnswers.Items.map(async (qa: any) => {
      return docClient.delete({ TableName: questionAnswerTableName, Key: {id: qa.id} }).promise()
    })
  ])
}

const fillDatabase = async () => {
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
      userForms.Items.map(async (userForm: any) => {
        return await adminDbQueries.getQuestionAnswersByUserFormId(userForm.id)
      })
    )
    // Count number of questionAnswers in db and in testdata for testUserOla
    const qaCountInDb = questionAnswers.map((qaList) => qaList.length).reduce((partialSum, currentSum) => partialSum + currentSum, 0)
    const qaCountInTestData = questionAnswerTestData.filter((qa) => qa.owner == testUserOla.id).length

    expect(qaCountInDb).toBe(qaCountInTestData)
})
