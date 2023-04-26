import { apiGET } from '../client'
import { IAdminGroup } from './types'

export const getGroup = async (id: string) =>
  apiGET<IAdminGroup>('/admin/get-group', { queryStringParameters: { id } })
