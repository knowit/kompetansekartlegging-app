import express from 'express'
import {
  addGroupIdToUserAttributes,
  getUser,
  listUsers,
  removeGroupIdFromUserAttributes,
} from '../../cognito/cognitoActions'
import Group from '../../groups/queries'
import {
  DeleteGroupInput,
  GetGroupInput,
  UpdateGroupLeaderInput,
} from '../../groups/types'
import Organization from '../../organizations/queries'
import { getOrganizations } from '../../utils'
import { getUsersInGroup } from '../helpers'
import {
  AddUserToGroupBody,
  GetGroupQuery,
  IUsername,
  UserAnnotated,
} from '../types'

const router = express.Router()

// List all groups in organization
router.get('/', async (req, res, next) => {
  if (req.query.id) {
    next()
  } else {
    try {
      const organization = getOrganizations(req)
      const listGroupsResponse = await Group.listGroupsInOrganization({
        organization: organization[0],
      })
      res.status(200).json(listGroupsResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
})

router.get<unknown, unknown, unknown, GetGroupQuery>(
  '/',
  async (req, res, next) => {
    try {
      const members: UserAnnotated[] = []
      const { id } = req.query
      const group = await Group.getGroup({ id })
      const groupLeader = await getUser(group.data!.group_leader_username)
      const groupMembers = await getUsersInGroup(id)

      const annotatedMembers = groupMembers?.map(async user => {
        if (user.Username) {
          const cognitoUser = await getUser(user.Username)
          const { Username, UserAttributes, ...newMember } = {
            ...user,
            ...cognitoUser,
          }
          return {
            ...newMember,
            cognitoAttributes: UserAttributes,
            username: Username,
          } as UserAnnotated
        }
      })
      if (annotatedMembers) {
        Promise.all(annotatedMembers)
          .then(members => {
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
      }
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Create a group
router.post('/', async (req, res, next) => {
  try {
    if (!req.body.group_leader_username) {
      throw new Error('group leader username is required')
    }
    const organization = getOrganizations(req)

    const organization_id = await Organization.getOrganizationByIdentifier({
      identifier_attribute: organization[0],
    })
    const addGroupResponse = await Group.createGroup({
      ...req.body,
      organization_id: organization_id.data?.id,
    })

    res.status(200).json(addGroupResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete a group and remove group id from cognito users in group
router.delete<unknown, unknown, DeleteGroupInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteResponse = await Group.deleteGroup(req.body)
      const groupMembers = await listUsers().then(users =>
        users.Users?.filter(
          user =>
            user.Attributes?.find(
              attribute => attribute.Name === 'custom:groupId'
            )?.Value === req.body.id
        )
      )
      groupMembers?.forEach(async member => {
        if (member.Username) {
          await removeGroupIdFromUserAttributes(member.Username)
        }
      })

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update group leader
router.patch<unknown, unknown, UpdateGroupLeaderInput, GetGroupInput>(
  '/',
  async (req, res, next) => {
    try {
      const updateResponse = await Group.updateGroupLeader(req.query, req.body)

      res.status(200).json(updateResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.post<unknown, unknown, unknown, IUsername>(
  '/remove-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const response = await removeGroupIdFromUserAttributes(username)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

router.post<unknown, unknown, AddUserToGroupBody, IUsername>(
  '/add-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const { group_id } = req.body
      const response = await addGroupIdToUserAttributes({
        username,
        groupId: group_id,
      })
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

export { router as adminGroupsRouter }
