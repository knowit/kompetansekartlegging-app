import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'

const listGroups = async () => {
  const query = 'SELECT * FROM "group"'

  return await sqlQuery({ message: '🚀 ~ > All groups.', query })
}

const listUsersInGroup = async (groupId: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'groupId',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT id, groupid FROM "user" WHERE groupid = :groupId'

  return await sqlQuery({
    message: `🚀 ~ > All users in group with id '${groupId}'.`,
    query,
    parameters,
  })
}

const upsert = async (id: string, groupId: string, orgid: string) => {
  const parameters: SqlParameter[] = [
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

  const query = `INSERT INTO "user" (id, groupID, organizationID) 
        VALUES (:id, :groupId, :organizationId) 
        ON CONFLICT (id) 
        DO UPDATE SET groupID = :groupId, organizationID = :organizationId 
        WHERE excluded.id=:id 
        RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > User with id '${id}' is now in group with id '${groupId}'.`,
    query,
    parameters,
  })
}

const deleteUser = async (id: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
    },
  ]
  const query = 'DELETE FROM "user" WHERE id = :id RETURNING *'

  return await sqlQuery({
    message: `🚀 ~ > User with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const createGroup = async (groupLeaderUsername: string, orgId: string) => {
  const generatedGroupId = uuidv4()

  const parameters: SqlParameter[] = [
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

  return await sqlQuery({
    message: `🚀 ~ > Created group with id '${generatedGroupId}' and group leader '${groupLeaderUsername}'.`,
    query,
    parameters,
  })
}

const deleteGroup = async (groupId: string) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'DELETE FROM "group" WHERE id = :id RETURNING *'

  return await sqlQuery({
    message: `🚀 ~ > Group with id '${groupId}' deleted.`,
    query,
    parameters,
  })
}

const updateGroupLeader = async (
  groupId: string,
  groupleaderusername: string
) => {
  const parameters: SqlParameter[] = [
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

  return await sqlQuery({
    message: `🚀 ~ > '${groupleaderusername}' is now leader for group with id '${groupId}'.`,
    query,
    parameters,
  })
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
