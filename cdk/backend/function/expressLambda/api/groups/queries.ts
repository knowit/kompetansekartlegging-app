import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'

const listGroups = async () => {
  const query = 'SELECT * FROM "group"'
  const records = await sqlQuery(query)

  return { message: '🚀 ~ > All groups.', data: records }
}

const listUsersInGroup = async (groupId: string) => {
  const params: SqlParameter[] = [
    {
      name: 'groupId',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT id, groupid FROM "user" WHERE groupid = :groupId'
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > All users in group with id '${groupId}'.`,
    data: records,
  }
}

const upsert = async (id: string, groupId: string, orgid: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
    },
    {
      name: 'groupId',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationId',
      value: {
        stringValue: orgid,
      },
    },
  ]

  const UPSERT_QUERY = `INSERT INTO "user" (id, groupID, organizationID) 
        VALUES (:id, :groupId, :organizationId) 
        ON CONFLICT (id) 
        DO UPDATE SET groupID = :groupId, organizationID = :organizationId 
        WHERE excluded.id=:id 
        RETURNING *`
  const records = await sqlQuery(UPSERT_QUERY, params)

  return {
    message: `🚀 ~ > User with id '${id}' is now in group with id '${groupId}'.`,
    data: records,
  }
}

const deleteUser = async (id: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
    },
  ]
  const query = 'DELETE FROM "user" WHERE id = :id RETURNING *'
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > User with id '${id}' deleted.`,
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
      name: 'organizationId',
      value: {
        stringValue: orgId,
      },
    },
    {
      name: 'groupLeaderUsername',
      value: {
        stringValue: groupLeaderUsername,
      },
    },
  ]

  const query = `INSERT INTO "group" (id, organizationID, groupLeaderUsername)
  VALUES (:id, :organizationId, :groupLeaderUsername)
  RETURNING *`
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Created group with id '${generatedGroupId}' and group leader '${groupLeaderUsername}'.`,
    data: records,
  }
}

const deleteGroup = async (groupId: string) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'DELETE FROM "group" WHERE id = :id RETURNING *'
  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > Group with id '${groupId}' deleted.`,
    data: records,
  }
}

const updateGroupLeader = async (
  groupId: string,
  groupleaderusername: string
) => {
  const params: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'groupLeaderUsername',
      value: {
        stringValue: groupleaderusername,
      },
    },
  ]

  const query = `UPDATE "group"
  SET groupLeaderUsername = :groupLeaderUsername
  WHERE id = :id 
  RETURNING *`

  const records = await sqlQuery(query, params)

  return {
    message: `🚀 ~ > '${groupleaderusername}' is now leader for group with id '${groupId}'.`,
    data: records,
  }
}

export default {
  upsert,
  deleteUser,
  listGroups,
  listUsersInGroup,
  createGroup,
  deleteGroup,
  updateGroupLeader,
}
