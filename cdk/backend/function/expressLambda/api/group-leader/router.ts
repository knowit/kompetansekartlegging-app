import express from 'express'
import { getUser } from '../cognito/cognitoActions'
import { getUserOnRequest } from '../utils'
import GroupLeader from './queries'
import { GetByUsername } from './types'
const router = express.Router()

const getAnnotatedGroupMembersByGroupLeader = async ({
  username,
}: GetByUsername) => {
  const membersInGroup = await GroupLeader.getGroupMembersByGroupLeader({
    username,
  })

  if (membersInGroup.status !== 'ok') {
    throw new Error('Could not fetch group members')
  }

  if (!membersInGroup.data) {
    throw new Error(
      'No group members found. Perhaps the user is not a group leader?'
    )
  }

  // Annotate the members with Cognito User Pool data
  const annotatedMembers = await Promise.all(
    membersInGroup.data.map(
      async (member: {
        username: string
        group_id: string
        group_leader_username: string
      }) => {
        const { username } = member
        const { UserAttributes } = await getUser(username)
        return { ...member, cognitoAttributes: UserAttributes }
      }
    )
  )

  return annotatedMembers
}

router.get('/mygroup', async (req, res, next) => {
  try {
    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const annotatedMembers = await getAnnotatedGroupMembersByGroupLeader({
      username,
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

router.get<unknown, unknown, unknown, GetByUsername>(
  '/group/:username',
  async (req, res, next) => {
    try {
      const { username } = req.query

      const annotatedMembers = await getAnnotatedGroupMembersByGroupLeader({
        username,
      })

      res.status(200).json({
        status: 'ok',
        message: `🚀 ~ > Group members with cognito info for '${username}'`,
        data: annotatedMembers,
      })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
)

router.get<unknown, unknown, unknown, GetByUsername>(
  '/lastanswerat/:username',
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

export { router as groupLeaderRouter }
