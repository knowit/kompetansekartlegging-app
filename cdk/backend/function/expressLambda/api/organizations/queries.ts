import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { sqlQuery } from '../../app'
import { createTimestampNow } from '../utils'
import { OrganizationInput, DeleteOrganizationInput } from './types'

const listOrganizations = async () => {
  const query = 'SELECT id, orgname, identifierAttribute FROM organization'

  return await sqlQuery({
    message: '🚀 ~ > All organizations.',
    query,
  })
}

const createOrganization = async ({
  id,
  orgname,
  identifierattribute,
}: OrganizationInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
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
        stringValue: identifierattribute,
      },
    },
  ]

  const query = `INSERT INTO organization (id, createdat, orgname, identifierattribute) 
  VALUES (:id, to_timestamp(:createdat, 'YYYY-MM-DD HH24:MI:SS'), :orgname, :identifierattribute)
  RETURNING *`

  return await sqlQuery({
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
    },
  ]

  const query = 'DELETE FROM organization WHERE id=:id RETURNING *;'

  return await sqlQuery({
    message: `🚀 ~ > Organization '${id}' is now deleted.`,
    query,
    parameters,
  })
}

export default {
  listOrganizations,
  createOrganization,
  deleteOrganization,
}
