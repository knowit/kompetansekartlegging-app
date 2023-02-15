import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import {
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  GroupInput,
  UpdateGroupLeaderInput,
  UserInput,
} from './types'

const listGroups = async () => {
  const query = 'SELECT * FROM "group"'

  return await sqlQuery({ message: '🚀 ~ > All groups.', query })
}

const listUsersInGroup = async ({ groupid }: GetUsersInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'groupid',
      value: {
        stringValue: groupid,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT id, groupid FROM "user" WHERE groupid = :groupid'

  return await sqlQuery({
    message: `🚀 ~ > All users in group with id '${groupid}'.`,
    query,
    parameters,
  })
}

const upsert = async ({ id, groupid, organizationid }: UserInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
    },
    {
      name: 'groupid',
      value: {
        stringValue: groupid,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organizationid',
      value: {
        stringValue: organizationid,
      },
    },
  ]

  const query = `INSERT INTO "user" (id, groupid, organizationid) 
        VALUES (:id, :groupid, :organizationid) 
        ON CONFLICT (id) 
        DO UPDATE SET groupid = :groupid, organizationid = :organizationid 
        WHERE excluded.id=:id 
        RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > User with id '${id}' is now in group with id '${groupid}'.`,
    query,
    parameters,
  })
}

const deleteUser = async ({ id }: DeleteUserInput) => {
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

const createGroup = async ({
  groupleaderusername,
  organizationid,
}: GroupInput) => {
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
      name: 'organizationid',
      value: {
        stringValue: organizationid,
      },
    },
    {
      name: 'groupleaderusername',
      value: {
        stringValue: groupleaderusername,
      },
    },
  ]

  const query = `INSERT INTO "group" (id, organizationid, groupleaderusername)
  VALUES (:id, :organizationid, :groupleaderusername)
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Created group with id '${generatedGroupId}' and group leader '${groupleaderusername}'.`,
    query,
    parameters,
  })
}

const deleteGroup = async ({ id }: DeleteGroupInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]
  const query = 'DELETE FROM "group" WHERE id = :id RETURNING *'

  return await sqlQuery({
    message: `🚀 ~ > Group with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateGroupLeader = async (
  { id }: GetGroupInput,
  { groupleaderusername }: UpdateGroupLeaderInput
) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'groupleaderusername',
      value: {
        stringValue: groupleaderusername,
      },
    },
  ]

  const query = `UPDATE "group"
  SET groupleaderusername = :groupleaderusername
  WHERE id = :id 
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > '${groupleaderusername}' is now leader for group with id '${id}'.`,
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
