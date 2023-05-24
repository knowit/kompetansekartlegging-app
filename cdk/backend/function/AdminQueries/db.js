const { DynamoDB } = require('aws-sdk')

const TableMap = JSON.parse(process.env.TABLE_MAP)
const QUESTION_ANSWER_TABLE_NAME = TableMap['QuestionAnswerTable']
const USER_FORM_TABLE_NAME = TableMap['UserFormTable']
const USER_TABLE_NAME = TableMap['UserTable']
const ANON_USER_TABLE_NAME = TableMap['AnonymizedUserTable']

const isTest = process.env.JEST_WORKER_ID
const docClient = new DynamoDB.DocumentClient({
  ...(isTest && {
    convertEmptyValues: true,
    endpoint: 'http://localhost:8000',
    region: 'local',
    credentials: {
      accessKeyId: 'foo',
      secretAccessKey: 'foo',
    },
  }),
})

const anonymizeUser = async (username, anonymizedID, orgId) => {
  // Put will overwrite the old item if the key exists
  // That way, the only case where promise throws is on error
  const userFormsForUser = await getUserFormsForUser(username)
  const sortedByUpdated = userFormsForUser.sort(
    (a, b) => -a.updatedAt.localeCompare(b.updatedAt)
  )
  const lastUpdated = sortedByUpdated[0]

  console.log('Adding user to AnonymizedUser table')
  await docClient
    .put({
      TableName: ANON_USER_TABLE_NAME,
      Item: {
        id: anonymizedID,
        organizationID: orgId,
        lastAnswerAt: lastUpdated.updatedAt,
      },
    })
    .promise()

  await anonymizeQuestionAnswers(userFormsForUser, anonymizedID)
  await anonymizeUserForms(userFormsForUser, anonymizedID)

  console.log('Finally deleting user from User table')
  await docClient
    .delete({
      TableName: USER_TABLE_NAME,
      Key: { id: username },
    })
    .promise()
}

const getUserFormsForUser = async username => {
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

const getQuestionAnswersByUserFormId = async userFormId => {
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

const anonymizeQuestionAnswers = async (userForms, anonymizedID) => {
  await Promise.all(
    userForms.map(async userForm => {
      const questionAnswers = await getQuestionAnswersByUserFormId(userForm.id)

      console.log(
        'Anonymizing QuestionAnswers for UserForm with ID: ',
        userForm.id
      )
      return questionAnswers.map(async questionAnswer =>
        docClient
          .update({
            TableName: QUESTION_ANSWER_TABLE_NAME,
            Key: { id: questionAnswer.id },
            UpdateExpression: 'SET #owner = :anonymizedID',
            ExpressionAttributeNames: { '#owner': 'owner' },
            ExpressionAttributeValues: { ':anonymizedID': anonymizedID },
          })
          .promise()
      )
    })
  )
}

const anonymizeUserForms = async (userForms, anonymizedID) => {
  await Promise.all(
    userForms.map(async userForm => {
      console.log('Anonymizing UserForm with ID: ', userForm.id)
      return docClient
        .update({
          TableName: USER_FORM_TABLE_NAME,
          Key: { id: userForm.id },
          UpdateExpression: 'SET #owner = :anonymizedID',
          ExpressionAttributeNames: { '#owner': 'owner' },
          ExpressionAttributeValues: { ':anonymizedID': anonymizedID },
        })
        .promise()
    })
  )
}

module.exports = {
  anonymizeUser,
  getUserFormsForUser,
  getQuestionAnswersByUserFormId,
}
