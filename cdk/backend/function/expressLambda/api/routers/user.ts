import express from 'express'
import { getOrganization, getUserOnRequest } from '../../utils/utils'
import { User } from '../queries'

import GroupLeader from '../queries/group-leader'

const router = express.Router()

router.get('/answers-by-categories', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const user = getUserOnRequest(req)

    if (!user.username) {
      throw new Error('Missing parameters')
    }

    const response = await User.getAnswersByCategories(
      user.username,
      organization
    )

    res.status(200).json({
      status: 'ok',
      message: `🚀 ~ > All question answers by categories for '${user.username}' in organization '${organization}'.`,
      data: response,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get('/answers', async (req, res, next) => {
  try {
    const organization = getOrganization(req)
    const user = getUserOnRequest(req)
    if (!user.username) {
      throw new Error('Missing parameters')
    }

    const response = await GroupLeader.getQuestionAnswersByActiveCatalogAndUser(
      { username: user.username, identifier_attribute: organization }
    )
    res.status(200).json(response)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default router
