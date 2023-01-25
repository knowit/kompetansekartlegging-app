import express from 'express'
import { sqlQuery } from '../../app'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const query = 'debugging'
    const { records } = await sqlQuery(query)

    const response = { data: records }

    // const response = { data: records }
    const response = 'Buggin'
    res.status(200).json(response)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as debugRouter }
