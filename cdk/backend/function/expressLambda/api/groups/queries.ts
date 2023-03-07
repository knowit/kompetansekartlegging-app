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

  return await sqlQuery({
    message: `🚀 ~ > All users in group with id '${group_id}'.`,
    query,
    parameters,
  })
}

const upsert = async ({ id, mail, group_id, organization_id }: UserInput) => {
  const parameters: SqlParameter[] = [
    {
      name: 'id',
      value: {
        stringValue: id,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: 'mail',
      value: {
        stringValue: mail,
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

  const query = `INSERT INTO "user" (id, mail, group_id, organization_id) 
        VALUES (:id, :mail, :group_id, :organization_id) 
        ON CONFLICT (id) 
        DO UPDATE SET mail = :mail, group_id = :group_id, organization_id = :organization_id 
        WHERE excluded.id=:id 
        RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > User with id '${id}' is now in group with id '${group_id}'.`,
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
      typeHint: TypeHint.UUID,
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
  group_leader_id,
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
      name: 'group_leader_id',
      value: {
        stringValue: group_leader_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `INSERT INTO "group" (id, organization_id, group_leader_id)
  VALUES (:id, :organization_id, :group_leader_id)
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > Created group with id '${generatedgroup_id}' and group leader '${group_leader_id}'.`,
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
  { group_leader_id }: UpdateGroupLeaderInput
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
      name: 'group_leader_id',
      value: {
        stringValue: group_leader_id,
      },
      typeHint: TypeHint.UUID,
    },
  ]

  const query = `UPDATE "group"
  SET group_leader_id = :group_leader_id
  WHERE id = :id 
  RETURNING *`

  return await sqlQuery({
    message: `🚀 ~ > '${group_leader_id}' is now leader for group with id '${id}'.`,
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
