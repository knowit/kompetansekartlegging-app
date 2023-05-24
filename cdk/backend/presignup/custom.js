const CognitoIdentityServiceProvider = require('aws-sdk/clients/cognitoidentityserviceprovider')
const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminUpdateUserAttributesCommand,
} = require('@aws-sdk/client-cognito-identity-provider')

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const tableMap = JSON.parse(process.env.TABLE_MAP)

// Should probably be environment variables, but haven't figured how to fix it with amplify so far, without
// some hacky editing of the cloud-formation template
const OrganizationConstants = {
  TableName: 'Organization',
  IndexName: 'byIdentifierAttribute',
  IdentifierAttribute: 'identifierAttribute',
}

const isDeveloperLogin = event => {
  return event['request']['userAttributes']['identities'] === undefined
}

const getIdentifierValue = event => {
  const identities = JSON.parse(
    event['request']['userAttributes']['identities']
  )
  const providerName = identities[0]['providerName']
  return providerName
}

const getOrganizationID = identifierAttributeValue =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const params = {
      TableName: tableMap[`${OrganizationConstants['TableName']}Table`], //OrganizationConstants["TableName"]+'-'+process.env.API_KOMPETANSEKARTLEGGIN_GRAPHQLAPIIDOUTPUT+"-"+process.env.ENV,
      IndexName: OrganizationConstants['IndexName'],
      KeyConditionExpression:
        OrganizationConstants['IdentifierAttribute'] + ' = :iA',
      ExpressionAttributeValues: { ':iA': identifierAttributeValue },
      ProjectionExpression: 'id',
      Select: 'SPECIFIC_ATTRIBUTES',
    }
    console.log(params)
    try {
      const data = await docClient.query(params).promise()
      console.log(data)
      if (data.Count >= 1) {
        const organizationID = data['Items'][0]['id']
        resolve(organizationID)
      } else {
        reject(
          'Could not find any item with the the identifier attribute:',
          identifierAttributeValue
        )
      }
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })

const cognitoIdp = new CognitoIdentityServiceProvider()
const getUserByEmail = async (userPoolId, email) => {
  const params = {
    UserPoolId: userPoolId,
    Filter: `email = "${email}"`,
  }
  return cognitoIdp.listUsers(params).promise()
}

const adminConfirmUserEmail = async (userPoolId, email) => {
  return cognitoIdp
    .adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      UserPoolId: userPoolId,
      Username: email,
    })
    .promise()
}

const adminSetUserPassword = async (userPoolId, email) => {
  const params = {
    Password: generatePassword(),
    UserPoolId: userPoolId,
    Username: email,
    Permanent: true,
  }
  return cognitoIdp.adminSetUserPassword(params).promise()
}

function generatePassword() {
  return `${Math.random() // Generate random number, eg: 0.123456
    .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
    .slice(-8)}42` // Cut off last 8 characters : "yo82mvyr" and add a number, because the cognito password policy requires a number
}

const linkProviderToUser = async (
  username,
  userPoolId,
  providerName,
  providerUserId
) => {
  const params = {
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: 'Cognito',
    },
    SourceUser: {
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: providerUserId,
      ProviderName: providerName,
    },
    UserPoolId: userPoolId,
  }
  const result = await new Promise((resolve, reject) => {
    cognitoIdp.adminLinkProviderForUser(params, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })

  return result
}

exports.handler = async (event, context, callback) => {
  // insert code to be executed by your lambda trigger
  console.log('PreSignUpTriggered', event)
  if (event.triggerSource === 'PreSignUp_ExternalProvider') {
    console.log(event)
    const userRs = await getUserByEmail(
      event.userPoolId,
      event.request.userAttributes.email
    )
    if (userRs && userRs.Users.length > 0) {
      const splitUserName = event.userName.split('_')
      const providerName = splitUserName[0]
      let providerUserId = splitUserName.slice(1).join('_')
      await linkProviderToUser(
        event.request.userAttributes.email,
        event.userPoolId,
        providerName,
        providerUserId
      )
    } else {
      let attributes = []
      Object.keys(event.request.userAttributes).forEach(key => {
        if (key === 'identities' || key === 'sub' || key.includes('cognito:'))
          return
        attributes.push({ Name: key, Value: event.request.userAttributes[key] })
      })
      if (event.userName != event.request.userAttributes.email) {
        const userEmail = event.request.userAttributes.email

        const splitUserName = event.userName.split('_')
        const providerName = splitUserName[0]
        let providerUserId = splitUserName.slice(1).join('_')
        let organizationID = ''
        let orgIdentifier = providerName
        if (event.request.userAttributes['custom:company'])
          orgIdentifier = event.request.userAttributes['custom:company']
        try {
          organizationID = await getOrganizationID(orgIdentifier)
        } catch (err) {
          throw `Could not find a valid organization for ${orgIdentifier}`
        }
        console.log('Creating new Cognito User Pool user', attributes)
        console.log(
          await new Promise((resolve, reject) => {
            cognitoIdp.adminCreateUser(
              {
                MessageAction: 'SUPPRESS',
                Username: event.request.userAttributes.email,
                UserAttributes: attributes,
                UserPoolId: event.userPoolId,
              },
              (err, data) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(data)
                }
              }
            )
          })
        )
        // const [ providerName, providerUserId ] = event.userName.split('_');
        await linkProviderToUser(
          userEmail,
          event.userPoolId,
          providerName,
          providerUserId
        )

        await adminSetUserPassword(event.userPoolId, userEmail) // Set user to confirmed
        event.response.autoVerifyEmail = true
        event.response.autoConfirmUser = true

        const client = new CognitoIdentityProviderClient({
          region: event['region'],
        })

        // const identifierAttributeValue = getIdentifierValue(event);
        // TODO: Change providerName to appropriate attribute

        const user_to_group_command = new AdminAddUserToGroupCommand({
          UserPoolId: event['userPoolId'],
          Username: userEmail,
          GroupName: organizationID,
        })

        const update_user_attribute_command = new AdminUpdateUserAttributesCommand(
          {
            Username: userEmail,
            UserPoolId: event['userPoolId'],
            UserAttributes: [
              {
                Name: 'custom:OrganizationID',
                Value: organizationID,
              },
            ],
          }
        )

        try {
          const [
            response_user_group,
            response_custom_attribute,
          ] = await Promise.all([
            client.send(user_to_group_command),
            client.send(update_user_attribute_command),
          ])
          console.log('response user_to_group', response_user_group)
          console.log('response custom_attribute', response_custom_attribute)
        } catch (err) {
          console.log('error', err)
        } finally {
          callback(null, event)
        }
      } else {
        console.log('user not found, added new cognito user to userPool.')
      }
    }
  }

  callback(null, event)
}
