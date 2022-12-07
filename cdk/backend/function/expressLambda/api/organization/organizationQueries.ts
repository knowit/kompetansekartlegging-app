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
  let date = new Date()
  let createdAt =
    date.getUTCFullYear() +
    '-' +
    date.getUTCMonth() +
    '-' +
    date.getUTCDay() /*+
    ' ' +
    date.getUTCHours() +
    ':' +
    date.getUTCMinutes() +
    ':' +
    date.getUTCSeconds() */

  console.log('🚀 ~ file: organizationQueries.ts:33 ~ createdAt', createdAt)

  createdAt = '2020-10-10 00:00:00'

  const params: SqlParameter[] = [
    {
      name: 'organizationid',
      value: {
        stringValue: organizationId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'createdat',
      value: {
        stringValue: createdAt,
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

  /*const INSERT_QUERY = `INSERT INTO organization (id, createdat, orgname, identifierattribute) 
  VALUES (:organizationid, CAST(date '${createdAt}' AS TIMESTAMPTZ), :organizationname, :identifierattribute)
  RETURNING *`*/
  const INSERT_QUERY = `INSERT INTO organization (id, createdat, orgname, identifierattribute) 
  VALUES (:organizationid, :createdat, :organizationname, :identifierattribute)
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
