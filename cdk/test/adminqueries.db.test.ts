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
    docClient.scan({TableName: userTableName}).promise(),
    docClient.scan({TableName: userFormTableName}).promise(),
    docClient.scan({TableName: questionAnswerTableName}).promise()
  ])

  await Promise.all([
    users.Items.map(async (user: any) => {
      await docClient.delete({TableName: userTableName, Key: {id: user.id}}).promise()
    }),
    userForms.Items.map(async (userForm: any) => {
      await docClient.delete({TableName: userFormTableName, Key: {id: userForm.id}}).promise()
    }),
    questionAnswers.Items.map(async (qa: any) => {
      await docClient.delete({TableName: questionAnswerTableName, Key: {id: qa.id}}).promise()
    })
  ])
}

const fillDatabase = async () => {
  await Promise.all([
    ...testUsers.map(async (testUser) => {
      await docClient.put({
        TableName: userTableName,
        Item: testUser
      })
      .promise()
    }),

    ...userFormTestData.map(async (userForm) => {
      await docClient.put({
        TableName: userFormTableName,
        Item: userForm
      })
      .promise()
    }),

    ...questionAnswerTestData.map(async (questionAnswer) => {
      await docClient.put({
        TableName: questionAnswerTableName,
        Item: questionAnswer
      })
      .promise()
    }),
  ])
}

test('DynamoDB has correct number of items', async () => {
  // Also validates testdata in case items have the same id

  // Assert correct number of Users
  const userScan = await docClient.scan({
    TableName: userTableName,
    Select: "COUNT"
  })
  .promise()

  expect(userScan["Count"]).toBe(testUsers.length)
  expect(userScan["ScannedCount"]).toBe(testUsers.length)

  // Assert correct number of UserForms
  const userFormScan = await docClient.scan({
    TableName: userFormTableName,
    Select: "COUNT"
  })
  .promise()

  expect(userFormScan["Count"]).toBe(userFormTestData.length)
  expect(userFormScan["ScannedCount"]).toBe(userFormTestData.length)

  // Assert correct number of QuestionAnswers
  const questionAnswerScan = await docClient.scan({
    TableName: questionAnswerTableName,
    Select: "COUNT"
  })
  .promise()

  expect(questionAnswerScan["Count"]).toBe(questionAnswerTestData.length)
  expect(questionAnswerScan["ScannedCount"]).toBe(questionAnswerTestData.length)
})
