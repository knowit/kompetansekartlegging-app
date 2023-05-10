import { apiGET } from '../client'
import { IAdminGroup, IUserAnnotated } from './types'

export const getGroup = async (id: string) =>
  apiGET<IAdminGroup>('/admin/get-group', { queryStringParameters: { id } })

export const getAllUsers = async () =>
  apiGET<IUserAnnotated[]>('/admin/get-users')
