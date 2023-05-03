import {
  AdminGetUserResponse,
  AttributeType,
} from '@aws-sdk/client-cognito-identity-provider'
import { IUser } from '../groups/types'

export interface IAdminGroup {
  leader: AdminGetUserResponse
  members: IUserAnnotated
}

export interface IUserAnnotated extends IUser {
  group_leader_username: string
  cognito_attributes: AttributeType[]
}
