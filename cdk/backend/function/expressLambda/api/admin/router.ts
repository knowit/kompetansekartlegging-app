import {
  AdminGetUserResponse,
  UsersListType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider'
import express, { NextFunction, Request, Response } from 'express'
import { getUser, listUsersInGroup } from '../cognito/cognitoActions'
import Group from '../groups/queries'
import { IUser } from '../groups/types'
import { getOrganizations } from '../utils'
import Admin from './queries'
import { GetGroupQuery, IUserAnnotated } from './types'

const router = express.Router()

router.get<unknown, unknown, unknown, GetGroupQuery>(
  '/get-group',
  async (req, res, next) => {
    try {
      const members: IUserAnnotated[] = []
      const { id } = req.query
      const group = await Group.getGroup({ id })
      const groupLeader = await getUser(group.data!.group_leader_username)
      const groupMembers = await Group.listUsersInGroup({ group_id: id })
      console.log(groupMembers.data)
      await Promise.all(
        groupMembers.data!.map(async (user: IUser) => {
          return getUser(user.username).then((member: AdminGetUserResponse) => {
            const newMember = {
              ...user,
              group_leader_username: group.data.group_leader_username,
              cognito_attributes: member.UserAttributes ?? [],
            }
            members.push(newMember)
          })
        })
      )
        .then(() => {
          const result = {
            status: 'ok',
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

// 1. Get organizations for user
// 2. Retrieve cognito users for each organization the user is in
// 3. Get the organizatino id for the organization
// 4. Get all aurora users in the organization
// 5. Iterate over all cognito users and combine them with aurora users on username

router.get<any, any, any, any>(
  '/get-users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { nextToken } = req.body
      const organizations = getOrganizations(req)
      const results = organizations.map(org => {
        return Promise.all([
          Admin.getOrganizationIdFromIdentifierAttribute(org).then(response =>
            Admin.getUsersInOrganization(response.data)
          ),
          listUsersInGroup(org, 25, nextToken),
        ])
          .then(async values => {
            return await annotateUsers(values[0].data, values[1].Users ?? [])
          })
          .then(combinedUsersPromises => {
            return Promise.all(combinedUsersPromises).then(combinedUsers => {
              const response = {
                message: `🚀 ~ > All users in organization ${org}`,
                users: combinedUsers,
              }
              return response
            })
          })
      })
      Promise.all(results)
        .then(values => {
          const response: { message: string[]; data: any[]; status: string } = {
            message: [],
            data: [],
            status: 'ok',
          }
          values.forEach(res => {
            response.message.push(res.message)
            if (res.users) response.data = [...res.users]
          })
          return response
        })
        .then(response => res.status(200).json(response))
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

const annotateUsers = async (users: IUser[], cognitoUsers: UsersListType) => {
  const usersAnnotated = cognitoUsers.map(async cu => {
    const user = users.find(u => u.username === cu.Username)
    let userAnnotated: IUserAnnotated
    if (user) {
      return (userAnnotated = await annotateUserWithGroup(user).then(user => {
        const userAnnotated = {
          ...user,
          cognito_attributes: cu.Attributes ?? [],
        }
        return userAnnotated
      }))
    }
  })
  return usersAnnotated
}

const annotateUserWithGroup = async (user: IUser) => {
  try {
    return await Group.getGroup({ id: user.group_id }).then(response => {
      return {
        ...user,
        group_leader_username: response.data?.group_leader_username ?? '',
      }
    })
  } catch {
    return { ...user, group_leader_username: '' }
  }
}

export { router as adminRouter }
