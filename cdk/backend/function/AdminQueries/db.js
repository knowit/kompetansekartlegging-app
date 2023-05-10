const { DynamoDB } = require('aws-sdk')

const TableMap = JSON.parse(process.env.TABLE_MAP)
const QUESTION_ANSWER_TABLE_NAME = TableMap['QuestionAnswerTable']
const USER_FORM_TABLE_NAME = TableMap['UserFormTable']
const USER_TABLE_NAME = TableMap['UserTable']

const docClient = new DynamoDB.DocumentClient()

const anonymizeUser = async (username, hashedUsername) => {
  const userFormsForUser = await getUserFormsForUser(username)

  userFormsForUser.map(async (userForm) => {
    console.log('Anonymizing UserForm with ID: ', userForm.id)
    docClient
    .update({
      TableName: USER_FORM_TABLE_NAME,
      Key: { id : userForm.id },
      UpdateExpression: "SET #owner = :hash",
      ExpressionAttributeNames: { '#owner': 'owner' },
      ExpressionAttributeValues: { ':hash': hashedUsername }
    })
    .promise()

    const allQuestionAnswers = await getQuestionAnswersByUserFormId(userForm.id)

    console.log('Anonymizing QuestionAnswers for UserForm with ID: ', userForm.id)
    allQuestionAnswers.map((questionAnswer) => {
      docClient
      .update({
        TableName: QUESTION_ANSWER_TABLE_NAME,
        Key: { id: questionAnswer.id },
        UpdateExpression: 'SET #owner = :hash',
        ExpressionAttributeNames: { '#owner': 'owner' },
        ExpressionAttributeValues: { ':hash': hashedUsername }
      })
      .promise()
    })
  })
}

const getUserFormsForUser = async (username) => {
  console.log('Getting UserForms for user')

  const result = await docClient
  .query({
    TableName: USER_FORM_TABLE_NAME,
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

  return result.Items
}

const getQuestionAnswersByUserFormId = async (userFormId) => {
  console.log('Getting QuestionAnswers for UserForm with ID: ', userFormId)

  const result = await docClient
    .query({
      TableName: QUESTION_ANSWER_TABLE_NAME,
      IndexName: 'byUserForm',
      KeyConditionExpression: 'userFormID = :userFormId',
      ExpressionAttributeValues: {
        ':userFormId': userFormId,
      },
      ConsistentRead: false,
    })
    .promise()

  return result.Items
}

module.exports = {
    anonymizeUser
}