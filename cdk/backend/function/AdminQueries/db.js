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
  const userFormsForUser = await getUserFormsForUser(username)

  /* Find the most recently updated userform to approximate
     anonymization date without using personally identifiable data */
  const sortedByUpdated = userFormsForUser.sort(
    (a, b) => -a.updatedAt.localeCompare(b.updatedAt)
  )
  const lastUpdatedAt = sortedByUpdated[0]?.updatedAt ?? null

  console.log('Adding user to AnonymizedUser table')
  // Put will overwrite the old item if the key exists
  // That way, the only case where promise throws is on error
  await docClient
    .put({
      TableName: ANON_USER_TABLE_NAME,
      Item: {
        id: anonymizedID,
        organizationID: orgId,
        lastAnswerAt: lastUpdatedAt,
      },
    })
    .promise()

  await anonymizeQuestionAnswers(userFormsForUser, anonymizedID)
  await anonymizeUserForms(userFormsForUser, anonymizedID)

  console.log('Deleting user from User table')
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
    })
    .promise()

  return result.Items
}

// ANONYMIZATION

/* Since transactWrite() only does it in batches of 25 
this helper function anonymizes the owner by taking in a list
and partitioning it into 25 item batches. Each batch is then made into a Promise
and then returned with all other batches in a Promise.all()
reducing it into a single then-able Promise
*/
const batchAnonymizeOwner = (list, tableName, anonymizedID) => {
  let transactionItems = []

  for (let i = 0; i < list.length; i += 25) {
    const partition = list.slice(i, i + 25)

    const updateItems = partition.map(item => {
      return {
        Update: {
          TableName: tableName,
          Key: { id: item.id },
          UpdateExpression: 'SET #owner = :anonymizedID',
          ExpressionAttributeNames: { '#owner': 'owner' },
          ExpressionAttributeValues: { ':anonymizedID': anonymizedID },
        },
      }
    })

    const partitionTransaction = docClient
      .transactWrite({ TransactItems: updateItems })
      .promise()

    transactionItems.push(partitionTransaction)
  }
  return Promise.all(transactionItems)
}

const anonymizeQuestionAnswers = async (userForms, anonymizedID) => {
  const userFormUpdates = userForms.map(async userForm => {
    const questionAnswers = await getQuestionAnswersByUserFormId(userForm.id)
    console.log(
      'Anonymizing QuestionAnswers for UserForm with ID: ',
      userForm.id
    )
    return batchAnonymizeOwner(
      questionAnswers,
      QUESTION_ANSWER_TABLE_NAME,
      anonymizedID
    )
  })
  await Promise.all(userFormUpdates)
}

const anonymizeUserForms = async (userForms, anonymizedID) => {
  await batchAnonymizeOwner(userForms, USER_FORM_TABLE_NAME, anonymizedID)
}

module.exports = {
  anonymizeUser,
  getUserFormsForUser,
  getQuestionAnswersByUserFormId,
}
