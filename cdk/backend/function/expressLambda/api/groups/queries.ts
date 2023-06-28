import { SqlParameter, TypeHint } from '@aws-sdk/client-rds-data'
import { v4 as uuidv4 } from 'uuid'
import { sqlQuery } from '../../utils/sql'
import {
  GroupId,
  GroupInput,
  GroupLeaderInput,
  IGroup,
  OrganizationIdentifierAttribute,
} from '../../utils/types'

const listGroups = async () => {
  const query = 'SELECT * FROM "group"'

  return await sqlQuery<IGroup[]>({
    message: '🚀 ~ > All groups.',
    query,
    isArray: true,
  })
}

const listGroupsInOrganization = async ({
  identifier_attribute,
}: OrganizationIdentifierAttribute) => {
  const parameters: SqlParameter[] = [
    {
      name: 'identifier_attribute',
      value: {
        stringValue: identifier_attribute,
      },
    },
  ]

  const query =
    'SELECT g.id, g.organization_id, g.group_leader_username FROM "group" g JOIN organization o ON g.organization_id = o.id WHERE o.identifier_attribute = :identifier_attribute'

  return await sqlQuery<IGroup[]>({
    message: `🚀 ~ > All groups in organization '${identifier_attribute}'.`,
    query,
    parameters,
    isArray: true,
  })
}

const getGroup = async ({ id }: GroupId) => {
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

  return await sqlQuery<IGroup>({
    message: `🚀 ~ > Group with id: ${id}`,
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

  return await sqlQuery<IGroup>({
    message: `🚀 ~ > Created group with id '${generatedgroup_id}' and group leader '${group_leader_username}'.`,
    query,
    parameters,
  })
}

const deleteGroup = async ({ id }: GroupId) => {
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

  return await sqlQuery<IGroup>({
    message: `🚀 ~ > Group with id '${id}' deleted.`,
    query,
    parameters,
  })
}

const updateGroupLeader = async (
  { id }: GroupId,
  { group_leader_username }: GroupLeaderInput
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
    },
  ]

  const query = `UPDATE "group"
  SET group_leader_username = :group_leader_username
  WHERE id = :id 
  RETURNING *`

  return await sqlQuery<IGroup>({
    message: `🚀 ~ > '${group_leader_username}' is now leader for group with id '${id}'.`,
    query,
    parameters,
  })
}

export default {
  listGroups,
  listGroupsInOrganization,
  getGroup,
  createGroup,
  deleteGroup,
  updateGroupLeader,
}
