import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../app'
import {
  DeleteGroupInput,
  DeleteUserInput,
  GetGroupInput,
  GetUsersInput,
  Group,
  GroupInput,
  UpdateGroupLeaderInput,
  User,
  UserInput,
} from './types'

const listGroups = async () => {
  const query = 'SELECT * FROM "group"'

  return await sqlQuery<Group[]>({
    message: '🚀 ~ > All groups.',
    query,
    isArray: true,
  })
}

const listUsersInGroup = async ({ group_id }: GetUsersInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'group_id',
      value: {
        stringValue: group_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM "user" WHERE group_id = :group_id'

  return await sqlQuery<User[]>({
    message: `🚀 ~ > All users in group with id '${group_id}'.`,
    query,
    parameters,
    isArray: true,
  })
}

const getGroup = async ({ id }: GetGroupInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = 'SELECT * FROM "group" WHERE id=:id'

  return await sqlQuery<Group>({
    message: `🚀 ~ > Group with id: ${id}`,
    query,
    parameters,
  })
}

const upsert = async ({ username, group_id, organization_id }: UserInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
    {
      name: 'group_id',
      value: {
        stringValue: group_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organization_id',
      value: {
        stringValue: organization_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `INSERT INTO "user" (username, group_id, organization_id) 
        VALUES (:username, :group_id, :organization_id) 
        ON CONFLICT (username) 
        DO UPDATE SET mail = :mail, group_id = :group_id, organization_id = :organization_id 
        WHERE excluded.username=:username 
        RETURNING *`

  return await sqlQuery<User>({
    message: `🚀 ~ > User with username '${username}' is now in group with id '${group_id}'.`,
    query,
    parameters,
  })
}

const deleteUserFromGroup = async ({ username }: DeleteUserInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'username',
      value: {
        stringValue: username,
      },
    },
  ]
  const query =
    'UPDATE "user" SET group_id=NULL WHERE username = :username RETURNING *'

  return await sqlQuery<User>({
    message: `🚀 ~ > User with username '${username}' deleted.`,
    query,
    parameters,
  })
}

const createGroup = async ({
  group_leader_username,
  organization_id,
}: GroupInput) => {
  const generatedgroup_id = uuidv4()

  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: generatedgroup_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'organization_id',
      value: {
        stringValue: organization_id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'group_leader_username',
      value: {
        stringValue: group_leader_username,
      },
    },
  ]

  const query = `INSERT INTO "group" (id, organization_id, group_leader_username)
  VALUES (:id, :organization_id, :group_leader_username)
  RETURNING *`

  return await sqlQuery<Group>({
    message: `🚀 ~ > Created group with id '${generatedgroup_id}' and group leader '${group_leader_username}'.`,
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

  return await sqlQuery<Group>({
    message: `🚀 ~ > Group with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateGroupLeader = async (
  { id }: GetGroupInput,
  { group_leader_username }: UpdateGroupLeaderInput
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
      name: 'group_leader_username',
      value: {
        stringValue: group_leader_username,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `UPDATE "group"
  SET group_leader_username = :group_leader_username
  WHERE id = :id 
  RETURNING *`

  return await sqlQuery<Group>({
    message: `🚀 ~ > '${group_leader_username}' is now leader for group with id '${id}'.`,
    query,
    parameters,
  })
}

export default {
  upsert,
  deleteUserFromGroup,
  listGroups,
  listUsersInGroup,
  getGroup,
  createGroup,
  deleteGroup,
  updateGroupLeader,
}
