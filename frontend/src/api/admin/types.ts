import { AdminGetUserResponse } from '@aws-sdk/client-cognito-identity-provider'
import { IUser } from '../groups/types'

export interface IAdminGroup {
  leader: AdminGetUserResponse
  members: UserAnnotated
}

type UserAnnotated = IUser | Omit<AdminGetUserResponse, 'Username'>
