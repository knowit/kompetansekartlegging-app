import express from 'express'
import { getUser } from '../cognito/cognitoActions'
import { getUserOnRequest } from '../utils'
import GroupLeader from './queries'
const router = express.Router()

router.get('/myGroup', async (req, res, next) => {
  try {
    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const membersInMyGroup = await GroupLeader.myGroupMembers({ username })

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
          return { ...member, attributes: UserAttributes }
        }
      )
    )

    res.status(200).json(annotatedMembers)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as groupLeaderRouter }
