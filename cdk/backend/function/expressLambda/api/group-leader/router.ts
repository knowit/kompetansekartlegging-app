import express from 'express'
import { getUser } from '../cognito/cognitoActions'
import { getUserOnRequest } from '../utils'
import GroupLeader from './queries'
const router = express.Router()

router.get('/mygroup', async (req, res, next) => {
  try {
    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const membersInMyGroup = await GroupLeader.myGroupMembers({ username })

    if (membersInMyGroup.status !== 'ok') {
      throw new Error('Could not fetch group members')
    }

    // Annotate the members with Cognito User Pool data
    const annotatedMembers = await Promise.all(
      membersInMyGroup.data.map(
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

export { router as groupLeaderRouter }
