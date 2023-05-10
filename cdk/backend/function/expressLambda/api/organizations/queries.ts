import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import { createTimestampNow } from '../utils'
import {
  DeleteOrganizationInput,
  GetOrganizationInput,
  Organization,
  OrganizationInput,
} from './types'

const listOrganizations = async () => {
  const query = 'SELECT * FROM organization'

  return await sqlQuery<Organization[]>({
    message: '🚀 ~ > All organizations.',
    query,
    isArray: true,
  })
}

const getOrganization = async ({ id }: GetOrganizationInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM organization WHERE id = :id'

  return await sqlQuery<Organization>({
    message: `🚀 ~ > Organization with id ${id}`,
    query,
    parameters,
  })
}

const createOrganization = async ({
  orgname,
  identifier_attribute,
}: OrganizationInput) => {
  const id = uuidv4()

  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'createdat',
      value: {
        stringValue: createTimestampNow(),
      },
      typeHint: TypeHint.TIMESTAMP,
    },
    {
      name: 'orgname',
      value: {
        stringValue: orgname,
      },
    },
    {
      name: 'identifierattribute',
      value: {
        stringValue: identifier_attribute,
      },
    },
  ]

  const query = `INSERT INTO organization (id, created_at, organization_name, identifier_attribute) 
  VALUES (:id, to_timestamp(:createdat, 'YYYY-MM-DD HH24:MI:SS'), :orgname, :identifierattribute)
  RETURNING *`

  return await sqlQuery<Organization>({
    message: `🚀 ~ > Organization '${orgname}' with the id '${id}' inserted.`,
    query,
    parameters,
  })
}

const deleteOrganization = async ({ id }: DeleteOrganizationInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'DELETE FROM organization WHERE id=:id RETURNING *;'

  return await sqlQuery<Organization>({
    message: `🚀 ~ > Organization '${id}' is now deleted.`,
    query,
    parameters,
  })
}

export default {
  listOrganizations,
  getOrganization,
  createOrganization,
  deleteOrganization,
}
