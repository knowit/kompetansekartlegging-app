import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'

const listOrganizations = async () => {
  const SELECT_QUERY =
    'SELECT id, orgname, identifierAttribute FROM organization'
  const records = await sqlQuery(SELECT_QUERY)

  return { message: '🚀 ~ > All organizations.', data: records }
}

const addOrganization = async (
  organizationId: string,
  organizationName: string,
  identifierAttribute: string
) => {
  // Denne tar ikke hensyn til norsk tid.
  // Kan evt. gjøre new Date(Date.now() + 60 * 60 * 1000).toISO....
  const timestamp = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace(/\..+/, '')

  const params: SqlParameter[] = [
    {
      name: 'organizationid',
      value: {
        stringValue: organizationId,
      },
    },
    {
      name: 'createdat',
      value: {
        stringValue: timestamp,
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

  const INSERT_QUERY = `INSERT INTO organization (id, createdat, orgname, identifierattribute) 
  VALUES (:organizationid, to_timestamp(:createdat, 'YYYY-MM-DD HH24:MI:SS'), :organizationname, :identifierattribute)
  RETURNING *`
  const records = await sqlQuery(INSERT_QUERY, params)

  return {
    message: `🚀 ~ > Organization '${organizationName}' with the id '${organizationId}' inserted.`,
    data: records,
  }
}

const removeOrganization = async (organizationID: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: organizationID,
      },
    },
  ]

  const DELETE_QUERY = 'DELETE FROM organization WHERE id=:id RETURNING *;'

  const records = await sqlQuery(DELETE_QUERY, params)

  return {
    message: `🚀 ~ > Organization '${organizationID}' is now deleted.`,
    data: records,
  }
}

export default {
  listOrganizations,
  addOrganization,
  removeOrganization,
}
