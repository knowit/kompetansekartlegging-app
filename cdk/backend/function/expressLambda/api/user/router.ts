import express from 'express'
import { getAnswersByCategories } from './queries'

const router = express.Router()

router.get<
  unknown,
  unknown,
  unknown,
  { username: string; identifier_attribute: string }
>('/answers-by-categories', async (req, res, next) => {
  try {
    const { username, identifier_attribute } = req.query

    if (!(username && identifier_attribute)) {
      throw new Error('Missing parameters')
    }

    const response = await getAnswersByCategories(
      username,
      identifier_attribute
    )

    res.status(200).json({
      status: 'ok',
      message: `🚀 ~ > All question answers by categories for '${username}' in organization '${identifier_attribute}'.`,
      data: response,
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as userRouter }
