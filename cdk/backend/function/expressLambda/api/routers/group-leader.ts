import express from 'express'
import { Roles, requireRoles } from '../../middlewares/roles'
import { IUsername } from '../../utils/types'
import { getOrganization, getUserOnRequest } from '../../utils/utils'
import {
  addGroupIdToUserAttributes,
  getUser,
  listUsers,
  removeGroupIdFromUserAttributes,
} from '../queries/cognitoActions'
import GroupLeader from '../queries/group-leader'
import Group from '../queries/groups'
const router = express.Router()

router.use(requireRoles([Roles.GROUP_LEADER, Roles.ADMIN]))

/**
 * Get all group members for the group leader
 */
router.get('/my-group', async (req, res, next) => {
  try {
    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const myGroupId = await GroupLeader.myGroup({ username })

    if (myGroupId.status !== 'ok' && !myGroupId.data?.id) {
      throw new Error('Could not fetch group members.')
    }

    const allUsers = await listUsers()
    const members = allUsers.data.Users?.filter(
      user =>
        user.Attributes?.find(attribute => attribute.Name === 'custom:groupId')
          ?.Value == myGroupId!.data!.id
    )

    const annotatedMembers = members?.map(member => {
      const { Username, Attributes, ...rest } = member
      return { ...rest, username: Username, cognitoAttributes: Attributes }
    })

    res.status(200).json({
      status: 'ok',
      message: `🚀 ~ > Group members with cognito info for '${username}'`,
      data: annotatedMembers,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

/**
 * Get the timestamp for a user's last answer
 */
router.get<unknown, unknown, unknown, IUsername>(
  '/last-answer-at',
  async (req, res, next) => {
    try {
      const { username } = req.query

      const response = await GroupLeader.getLatestAnswerTimestamp({ username })

      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

/**
 * Remove a user from the group
 */
router.post<unknown, unknown, unknown, IUsername>(
  '/group/remove-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const requestingUser = getUserOnRequest(req)
      const cognitoUserGroupId = await getUser(username).then(
        response =>
          response.UserAttributes?.find(
            attribute => attribute.Name === 'custom:groupId'
          )?.Value
      )
      let groupLeader
      if (cognitoUserGroupId) {
        const groupData = await Group.getGroup({ id: cognitoUserGroupId })
        groupLeader = groupData.data?.group_leader_username
      }

      if (requestingUser.username !== groupLeader) {
        throw new Error(
          'Cannot remove user from group, user is not in your group'
        )
      }
      const response = await removeGroupIdFromUserAttributes(username)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

// Add a user to my group
router.post<unknown, unknown, unknown, IUsername>(
  '/group/add-user',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const requestingUser = getUserOnRequest(req)
      if (!requestingUser.username) {
        throw new Error('No username found on request')
      }
      const group = await GroupLeader.myGroup({
        username: requestingUser.username,
      })

      if (group.data?.id === undefined) {
        throw new Error('Not authorized to add user to group')
      }
      const response = await addGroupIdToUserAttributes({
        username,
        groupId: group.data.id,
      })
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

// Get question answers in the active catalog for a user
router.get<unknown, unknown, unknown, IUsername>(
  '/question-answers',
  async (req, res, next) => {
    try {
      const { username } = req.query
      const organization = getOrganization(req)
      const response = await GroupLeader.getQuestionAnswersByActiveCatalogAndUser(
        { username: username, identifier_attribute: organization }
      )
      res.status(200).json(response)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as groupLeaderRouter }
