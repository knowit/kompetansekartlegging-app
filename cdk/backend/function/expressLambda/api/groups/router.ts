import express from 'express'
import Group from './queries'

const router = express.Router()

// List all groups with groupLeaderUsername
router.get('/', async (req, res, next) => {
  try {
    const listGroupsResponse = await Group.listGroups()

    res.status(200).json(listGroupsResponse)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as groupRouter }
