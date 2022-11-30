import { SqlParameter } from "@aws-sdk/client-rds-data"
import express from "express"
import { sqlQuery } from "../../app"

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

interface addOrganization {
  id: string,
  orgname: string,
  identifierAttribute: string
}
router.get<unknown, unknown, unknown, addOrganization>("/add", async (req, res, next) => {
  const {id, orgname, identifierAttribute} = req.query
  try {
    const query = "INSERT INTO organization VALUES(:id, :orgname, :identifierAttribute);"
    const parameters: SqlParameter[] = [
      {
        name: "id",
        value: {
          "stringValue": id
        }
      },
      {
        name: "orgname",
        value: {
          "stringValue": orgname
        }
      },
      {
        name: "identifierAttribute",
        value: {
          "stringValue": identifierAttribute
        }
      }
    ]
    const { records } = await sqlQuery(query, parameters)

    const response = { data: records }
    res.status(200).json(response)
  } catch(err) {
    next(err)
    console.error(err)
  }
})

router.get("/remove")

export { router as organizationRouter }
