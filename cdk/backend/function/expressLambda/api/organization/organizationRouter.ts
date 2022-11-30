import express from "express"
import { sqlQuery } from "../../app"

const router = express.Router()

router.get("/listOrganizations", async (req, res, next) => {
  try {
    const query = "SELECT * FROM organization"
    const { records } = await sqlQuery(query)

    const response = { data: records }

    res.status(200).json(response)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as organizationRouter }
