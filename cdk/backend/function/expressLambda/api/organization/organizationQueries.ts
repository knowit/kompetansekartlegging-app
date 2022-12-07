import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'

const listOrganizations = async () => {
  const query = 'SELECT id, orgname, identifierAttribute FROM organization'
  const records = await sqlQuery(query)

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
    {
      name: 'owner',
      value: {
        stringValue: owner,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query =
    "INSERT INTO organization(id, createdAt owner, orgname, identifierattribute) VALUES(:id, CAST(date '2020-10-10' AS TIMESTAMPTZ), DefaultOwner, :orgname, :identifierAttribute);"
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > All users in group with id '${groupId}'.`,
    data: records,
  }
}

const upsert = async (userId: string, groupId: string, orgId: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: userId,
      },
    },
    {
      name: 'groupid',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationid',
      value: {
        stringValue: orgId,
      },
    },
  ]

  const UPSERT_QUERY = `INSERT INTO "user" (id, groupid, organizationid) 
        VALUES (:id, :groupid, :organizationid) 
        ON CONFLICT (id) 
        DO UPDATE SET groupid = :groupid, organizationid = :organizationid 
        WHERE excluded.id=:id 
        RETURNING *`
  const records = await sqlQuery(UPSERT_QUERY, params)

  return {
    message: `🚀 ~ > User with id '${userId}' is now in group with id '${groupId}'.`,
    data: records,
  }
}

const deleteUser = async (userId: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: userId,
      },
    },
  ]
  const query = 'DELETE FROM "user" WHERE id = :id RETURNING *'
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > User with id '${userId}' deleted.`,
    data: records,
  }
}

const createGroup = async (groupLeaderUsername: string, orgId: string) => {
  const generatedGroupId = uuidv4()

  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: generatedGroupId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationid',
      value: {
        stringValue: orgId,
      },
    },
    {
      name: 'groupleaderusername',
      value: {
        stringValue: groupLeaderUsername,
      },
    },
  ]

  const query = `INSERT INTO "group" (id, organizationid, groupleaderusername)
  VALUES (:id, :organizationid, :groupleaderusername)
  RETURNING *`
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Created group with id '${generatedGroupId}' and group leader '${groupLeaderUsername}'.`,
    data: records,
  }
}

export default {
  listOrganizations,
  upsert,
  deleteUser,
  listUsersInGroup,
  createGroup,
}
