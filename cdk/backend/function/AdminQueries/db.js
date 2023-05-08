const { DynamoDB } = require('aws-sdk')

const TableMap = JSON.parse(process.env.TABLE_MAP)

const QUESTION_ANSWER_TABLE_NAME = TableMap['QuestionAnswerTable']
//process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONANSWERTABLE_NAME;
const USER_FORM_TABLE_NAME = TableMap['UserFormTable']
// process.env.API_KOMPETANSEKARTLEGGIN_USERFORMTABLE_NAME;
const QUESTION_TABLE_NAME = TableMap['QuestionTable']
// process.env.API_KOMPETANSEKARTLEGGIN_QUESTIONTABLE_NAME;
const CATEGORY_TABLE_NAME = TableMap['CategoryTable']
// process.env.API_KOMPETANSEKARTLEGGIN_CATEGORYTABLE_NAME;
const FORM_DEFINITION_TABLE_NAME = TableMap['FormDefinitionTable']
// process.env.API_KOMPETANSEKARTLEGGIN_FORMDEFINITIONTABLE_NAME;
const USER_POOL_ID = process.env.USERPOOL
const APIKEYPERMISSION_TABLE_NAME = TableMap['APIKeyPermissionTable']
// process.env.API_KOMPETANSEKARTLEGGIN_APIKEYPERMISSIONTABLE_NAME;
const GROUP_TABLE_NAME = TableMap['GroupTable']
// process.env.API_KOMPETANSEKARTLEGGIN_GROUPTABLE_NAME;
const USER_TABLE_NAME = TableMap['UserTable']
// process.env.API_KOMPETANSEKARTLEGGIN_GROUPTABLE_NAME;

const organizationFilterParameter = ':oid'
const organizationFilterExpression =
'organizationID = ' + organizationFilterParameter
const groupFilterParameter = ':gid'
const groupFilterExpression = 'groupID = ' + groupFilterParameter

const docClient = new DynamoDB.DocumentClient()

const anonymizeUser = async (username, hashedUsername) => {
    //await getAnswersForUser(user, newestFormDef.id, questionMap)
    // DynamoDB: QuestionAnswer.owner

    let allUserFormsForUser = await getUserFormsForUser(username)
    console.log('allUserFormsForUser:')
    console.log(allUserFormsForUser)

    await anonymizeUserformsAndQuestionAnswers(allUserFormsForUser, hashedUsername)
}

async function getUserFormsForUser(username) {
  console.log('Getting user forms for user')

  let result = await docClient
  .query({
    TableName: USER_FORM_TABLE_NAME,
    IndexName: 'byCreatedAt', // nødvendig?
    KeyConditionExpression: '#owner = :username',
    //FilterExpression: '#formDef = :formDef',
    ExpressionAttributeNames: {
      '#owner': 'owner',
    //  '#formDef': 'formDefinitionID',
    },
    ExpressionAttributeValues: {
      ':username': username,
    //  ':formDef': formDefinitionID,
    },
  })
  .promise()

  return result.Items
}

async function anonymizeUserformsAndQuestionAnswers(userforms, hash) {
  console.log('Anonymizing UserForm(s) and QuestionAnswer(s)')
  userforms.map(async (userform) => { // TODO: kanskje ikke async/await
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
    allQuestionAnswers.map((questionAnswer) => {
      questionAnswer
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

//Returns all questions connected to a specific userform
async function getQuestionAnswersByUserformId(userformId) {
  console.log('Getting question answers for ', userformId)
  try {
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
    console.log('QuestionAnswer query result: ', result)
    return result.Items
  } catch (err) {
    throw err
  }
}

module.exports = {
    anonymizeUser
}
