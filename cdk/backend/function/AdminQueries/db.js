const { DynamoDB } = require('aws-sdk')

const TableMap = JSON.parse(process.env.TABLE_MAP)
const QUESTION_ANSWER_TABLE_NAME = TableMap['QuestionAnswerTable']
const USER_FORM_TABLE_NAME = TableMap['UserFormTable']
const USER_TABLE_NAME = TableMap['UserTable']

const docClient = new DynamoDB.DocumentClient()

const anonymizeUser = async (username, hashedUsername) => {
    const userFormsForUser = await getUserFormsForUser(username)

    console.log('Anonymizing UserForm(s)')
    userFormsForUser.map(async (userform) => { // TODO: kanskje ikke async/await
      await docClient
      .update({
        TableName: USER_FORM_TABLE_NAME,
        Key: { id : userform.id },
        UpdateExpression: "SET #owner = :hash",
        ExpressionAttributeNames: { '#owner': 'owner' },
        ExpressionAttributeValues: { ':hash': hash }
      })
      .promise()
  
      const allQuestionAnswers = await getQuestionAnswersByUserformId(userform.id)
      console.log(allQuestionAnswers)
      console.log('Anonymizing QuestionAnswer(s)')
      allQuestionAnswers.map(async (questionAnswer) => { // TODO: kanskje ikke async/await
        await docClient
        .update({
          TableName: QUESTION_ANSWER_TABLE_NAME,
          Key: { id: questionAnswer.id },
          UpdateExpression: 'SET #owner = :hash',
          ExpressionAttributeNames: { '#owner': 'owner' },
          ExpressionAttributeValues: { ':hash': hash }
        })
        .promise()
      })
    })
}

async function getUserFormsForUser(username) {
  console.log('Getting user forms for user')

  let result = await docClient
  .query({
    TableName: USER_FORM_TABLE_NAME,
    IndexName: 'byCreatedAt', // nødvendig?
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

//Returns all questions connected to a specific userform
async function getQuestionAnswersByUserformId(userformId) {
  console.log('Getting question answers for ', userformId)

  let result = await docClient
    .query({
      TableName: QUESTION_ANSWER_TABLE_NAME,
      IndexName: 'byUserForm',
      KeyConditionExpression: 'userFormID = :userFormId',
      ExpressionAttributeValues: {
        ':userFormId': userformId,
      },
      ConsistentRead: false,
    })
    .promise()

  return result.Items
}

module.exports = {
    anonymizeUser
}
