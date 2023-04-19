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
      console.log(group.data)
      const groupLeader = await getUser(group.data.group_leader_username)
      const groupMembers = await Group.listUsersInGroup({ group_id: id })
      console.log(groupMembers.data)
      groupMembers.data.forEach(async (user: User) => {
        const cognitoUser = await getUser(user.username)
        members.push(cognitoUser)
      })

      const result = {
        message: `🚀 ~ > Admin info on group with id ${id}`,
        data: {
          leader: groupLeader,
          members: members,
        },
      }
      res.status(200).json(result)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as adminRouter }
