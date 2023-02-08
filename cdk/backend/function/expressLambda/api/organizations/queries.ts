import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import { createTimestampNow } from '../utils'

const listOrganizations = async () => {
  const query = 'SELECT id, orgname, identifierAttribute FROM organization'

  return await sqlQuery({
    message: '🚀 ~ > All organizations.',
    query,
  })
}

const addOrganization = async (
  organizationId: string,
  organizationName: string,
  identifierAttribute: string
) => {
  const parameters: SqlParameter[] = [
    {
      name: 'organizationid',
      value: {
        stringValue: organizationId,
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
      name: 'organizationname',
      value: {
        stringValue: organizationName,
      },
    },
    {
      name: 'identifierattribute',
      value: {
        stringValue: identifierAttribute,
      },
    },
  ]

  const query = `INSERT INTO organization (id, createdat, orgname, identifierattribute) 
  VALUES (:organizationid, to_timestamp(:createdat, 'YYYY-MM-DD HH24:MI:SS'), :organizationname, :identifierattribute)
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Organization '${organizationName}' with the id '${organizationId}' inserted.`,
    query,
    parameters,
  })
}

const removeOrganization = async (organizationID: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: organizationID,
      },
    },
  ]

  const query = 'DELETE FROM organization WHERE id=:id RETURNING *;'

  return await sqlQuery({
    message: `🚀 ~ > Organization '${organizationID}' is now deleted.`,
    query,
    parameters,
  })
}

export default {
  listOrganizations,
  addOrganization,
  removeOrganization,
}
