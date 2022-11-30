import { SqlParameter } from "@aws-sdk/client-rds-data"
import express from "express"
import { SqlParameterInput, sqlQuery } from "../../app"

const router = express.Router()

router.get("/list", async (req, res, next) => {
  try {
    const query = "SELECT id, orgname, identifierAttribute FROM organization"
    const { records } = await sqlQuery(query)

    const response = { data: records }

    res.status(200).json(response)
  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface addOrganizationParams {
  id: string
  orgname: string
  identifierAttribute: string
}

router.post<unknown, unknown, addOrganizationParams>(
  "/add",
  async (req, res, next) => {
    const { id, orgname, identifierAttribute } = req.body
    try {
      const query =
        "INSERT INTO organization VALUES(:id, :orgname, :identifierAttribute);"

      // Fra SqlParameter-typen så skal key her samsvare med name, og value være value.
      const params: SqlParameterInput = {
        id: { stringValue: id },
        orgname: { stringValue: orgname },
        identifierAttribute: { stringValue: identifierAttribute },
      }

      const { records } = await sqlQuery(query, params)

      const response = { data: records }
      res.status(200).json(response)
    } catch (err) {
      next(err)
      console.error(err)
    }
  }
)

router.get("/remove")

export { router as organizationRouter }
