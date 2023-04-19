import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    // res.status(200).json(listGroupsResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as groupLeaderRouter }
