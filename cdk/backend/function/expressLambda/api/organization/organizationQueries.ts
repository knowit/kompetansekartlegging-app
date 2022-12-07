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
  orgname: string,
  identifierAttribute: string
) => {
  const params: SqlParameter[] = [
    {
      name: 'organizationID',
      value: {
        stringValue: organizationId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'orgname',
      value: {
        stringValue: orgname,
      },
    },
    {
      name: 'identifierAttribute',
      value: {
        stringValue: identifierAttribute,
      },
    },
  ]
  const INSERT_QUERY =
    "INSERT INTO organization(id, createdAt owner, orgname, identifierattribute) VALUES(:id, CAST(date '2020-10-10' AS TIMESTAMPTZ), DefaultOwner, :orgname, :identifierAttribute);"
  const records = await sqlQuery(INSERT_QUERY, params)

  return {
    message: `🚀 ~ > Organization '${orgname}' with the id '${organizationId}' inserted.`,
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

  const DELETE_QUERY = 'DELETE FROM organization WHERE id=:id;'

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
