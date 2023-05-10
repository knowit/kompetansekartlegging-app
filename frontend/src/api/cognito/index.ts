import { apiGET } from '../client'
import { CognitoUser } from './types'

export const getCognitoUser = async (username: string) =>
  apiGET<CognitoUser>('/cognito/get-user', {
    queryStringParameters: { username },
  })
