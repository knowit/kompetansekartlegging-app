import express from 'express'
import { IUsername } from '../admin/types'
import { getUserOnRequest } from '../utils'
import { getAnswersByCategories } from './queries'

const router = express.Router()

router.get('/answers-by-categories', async (req, res, next) => {
  try {
    if (req.query.username) {
      next()
      return
    }

    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const response = await getAnswersByCategories(username)

    res.status(200).json({
      status: 'ok',
      message: `🚀 ~ > All question answers by categories for logged in user.`,
      data: response,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get<unknown, unknown, unknown, IUsername>(
  '/answers-by-categories',
  async (req, res, next) => {
    try {
      const { username } = req.query

      if (!username) {
        throw new Error('No username provided.')
      }

      const response = await getAnswersByCategories(username)

      res.status(200).json({
        status: 'ok',
        message: `🚀 ~ > All question answers by categories for '${username}'.`,
        data: response,
      })
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as userRouter }
