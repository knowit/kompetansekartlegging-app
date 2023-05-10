import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

import { API, Auth, Hub } from 'aws-amplify'
import awsconfig from '../exports'

// * Moved from App.tsx
const userBranch = import.meta.env.VITE_USER_BRANCH

switch (userBranch) {
  case 'master':
    awsconfig.oauth.domain = 'auth.kompetanse.knowit.no'
    break
  case 'dev':
    awsconfig.oauth.domain = 'auth.dev.kompetanse.knowit.no'
    break
  default:
    break
}

awsconfig.oauth.redirectSignIn = `${window.location.origin}/`
awsconfig.oauth.redirectSignOut = `${window.location.origin}/`

API.configure(awsconfig)
Auth.configure(awsconfig)

Hub.listen(/.*/, (data) => {
  console.log('Hub listening to all messages: ', data)
  if (data.payload.event === 'signIn_failure') {
    const message = data.payload.data.message
    if (message.includes('Google') && !message.includes('organization')) {
      Auth.federatedSignIn({
        customProvider: CognitoHostedUIIdentityProvider.Google,
      })
    } else if (
      message.includes('AzureAD') &&
      !message.includes('organization')
    ) {
      // console.log("Failure in the membrane");
      Auth.federatedSignIn({
        customProvider: 'AzureAD',
      })
    }
    // Auth.federatedSignIn();
  }
})
