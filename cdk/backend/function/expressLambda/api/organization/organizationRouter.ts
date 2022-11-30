import express from "express"
import { sqlQuery } from "../../app"

const router = express.Router()

router.get("/listOrganizations", async (req, res, next) => {
  try {
    const query = "SELECT * FROM organization"
    const response = await sqlQuery(query)

    res.status(200).json(response)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

export { router as organizationRouter }
