import { questionAnswerTestData, testDataUser, userFormTestData } from "./testdata/adminqueries.db.dynamodb";

const questionAnswerTableName = 'QuestionAnswer'
const userFormTableName = 'UserForm'
const userTableName = 'User'
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


// TODO: beforeEach (tøm db først?)
beforeAll(async () => {
  // Add User to db
  await docClient.put({
    TableName: userTableName,
    Item: testDataUser
  })
  .promise()

  // Add UserForms to db
  userFormTestData.map(async (userForm) => {
    await docClient.put({
      TableName: userFormTableName,
      Item: userForm
    })
    .promise()
  })

  // Add QuestionAnswers to db
  questionAnswerTestData.map(async (questionAnswer) => {
    await docClient.put({
      TableName: questionAnswerTableName,
      Item: questionAnswer
    })
    .promise()
  })
  // Ensure all db writes are completed before starting tests
  await new Promise(resolve => setTimeout(resolve, 200))
})

test('DynamoDB has correct number of items', async () => {
  // Also validates testdata in case items have the same id

  // Assert correct number of Users
  const userScan = await docClient.scan({
    TableName: userTableName,
    Select: "COUNT"
  })
  .promise()

  expect(userScan["Count"]).toBe(1)
  expect(userScan["ScannedCount"]).toBe(1)

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


/*
test('should work', async () => {
  await docClient.put({TableName: 'UserForm', Item: {id: '1111', createdAt: '1', owner: 'ola.nordmann@knowit.no'}}).promise()
  const response = await adminDbQueries.getUserFormsForUser('ola.nordmann@knowit.no')
  expect(response["Items"][0]).toEqual({
      id: '1',
      hello: 'world',
    });
})*/
