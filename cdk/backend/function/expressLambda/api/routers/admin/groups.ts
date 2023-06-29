import express from 'express'
import { getUsersInGroup } from '../../../utils/adminHelpers'
import {
  AddUserToGroupQuery,
  CategoryId,
  GroupId,
  GroupLeaderInput,
  IUsername,
} from '../../../utils/types'
import { getOrganization } from '../../../utils/utils'
import {
  addGroupIdToUserAttributes,
  getUser,
  listUsers,
  removeGroupIdFromUserAttributes,
} from '../../queries/cognitoActions'
import Group from '../../queries/groups'
import Organization from '../../queries/organizations'

const router = express.Router()

// List all groups in organization
router.get('/', async (req, res, next) => {
  if (req.query.id) {
    next()
  } else {
    try {
      const organization = getOrganization(req)
      const listGroupsResponse = await Group.listGroupsInOrganization({
        identifier_attribute: organization,
      })
      res.status(200).json(listGroupsResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
})

router.get<unknown, unknown, unknown, GroupId>('/', async (req, res, next) => {
  try {
    const { id } = req.query
    const group = await Group.getGroup({ id })
    const groupLeader = await getUser(group.data!.group_leader_username)
    const groupMembers = await getUsersInGroup(id)

    const result = {
      status: 'ok',
      message: `🚀 ~ > Admin info on group with id ${id}`,
      data: {
        leader: groupLeader,
        members: groupMembers,
      },
    }
    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Create a group
router.post<unknown, unknown, GroupLeaderInput>('/', async (req, res, next) => {
  try {
    const organization = getOrganization<GroupLeaderInput>(req)

    const organization_id = await Organization.getOrganizationByIdentifier({
      identifier_attribute: organization,
    })
    if (organization_id.data?.id === undefined) {
      throw new Error('Organization not found')
    }
    const addGroupResponse = await Group.createGroup({
      ...req.body,
      organization_id: organization_id.data.id,
    })

    res.status(200).json(addGroupResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Delete a group and remove group id from cognito users in group
router.delete<unknown, unknown, CategoryId>('/', async (req, res, next) => {
  try {
    const deleteResponse = await Group.deleteGroup(req.body)
    const groupMembers = await listUsers().then(users =>
      users.data.Users?.filter(
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
})

// Update group leader
router.patch<unknown, unknown, GroupLeaderInput, GroupId>(
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

router.post<unknown, unknown, unknown, AddUserToGroupQuery>(
  '/add-user',
  async (req, res, next) => {
    try {
      const { username, group_id } = req.query
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
