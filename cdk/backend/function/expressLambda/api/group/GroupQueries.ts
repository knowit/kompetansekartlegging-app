import { SqlParameter, TypeHint } from "@aws-sdk/client-rds-data"
import { sqlQuery } from "../../app"

const listGroups = async () => {
  const query = 'SELECT id, groupLeaderUsername FROM "group"'
  const records = await sqlQuery(query)

  return { message: "🚀 ~ > All groups.", data: records }
}

const listUsersInGroup = async (groupId: string) => {
  const params: SqlParameter[] = [
    {
      name: "groupId",
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

const upsert = async (userId: string, groupId: string, orgId: string) => {
  const params: SqlParameter[] = [
    {
      name: "id",
      value: {
        stringValue: userId,
      },
    },
    {
      name: "groupid",
      value: {
        stringValue: groupId,
      },
      typeHint: TypeHint.UUID,
    },
    {
      name: "organizationid",
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
      name: "id",
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

export default {
  listGroups,
  listUsersInGroup,
  upsert,
  deleteUser,
}
