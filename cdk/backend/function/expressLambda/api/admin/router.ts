import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider'
import express from 'express'
import { getUser } from '../cognito/cognitoActions'
import Group from '../groups/queries'
import { User } from '../groups/types'
import { GetGroupQuery } from './types'

const router = express.Router()

router.get<unknown, unknown, unknown, GetGroupQuery>(
  '/get-group',
  async (req, res, next) => {
    try {
      const members: AdminGetUserResponse[] = []
      const { id } = req.query
      const group = await Group.getGroup({ id })
      const groupLeader = await getUser(group.data.group_leader_username)
      const groupMembers = await Group.listUsersInGroup({ group_id: id })
      console.log(groupMembers.data)
      await Promise.all(
        groupMembers.data.map(async (user: User) => {
          return getUser(user.username).then((member: AdminGetUserResponse) => {
            members.push(member)
          })
        })
      )
        .then(() => {
          const result = {
            message: `🚀 ~ > Admin info on group with id ${id}`,
            data: {
              leader: groupLeader,
              members: members,
            },
          }
          return result
        })
        .then(result => res.status(200).json(result))
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as adminRouter }
