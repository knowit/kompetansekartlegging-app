import { SqlParameter } from "@aws-sdk/client-rds-data"
import express from "express"
import { SqlParameterInput, sqlQuery } from "../../app"

const router = express.Router()

router.get("/list", async (req, res, next) => {
  try {
    const query = "SELECT id, orgname, identifierAttribute FROM organization"
    const response = await sqlQuery(query)

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
      const INSERT_QUERY =
        "INSERT INTO organization(id, createdAt owner, orgname, identifierattribute) VALUES(:id, CAST(date '2020-10-10' AS TIMESTAMPTZ), :owner, :orgname, :identifierAttribute);"

      const response = await sqlQuery(INSERT_QUERY, [
        {
          name: "id",
          value: {
            stringValue: id,
          },
        },
        {
          name: "orgname",
          value: {
            stringValue: orgname,
          },
        },
        {
          name: "identifierAttribute",
          value: {
            stringValue: identifierAttribute,
          },
        },
        {
          name: "owner",
          value: {
            stringValue: "owner",
          },
        },
      ])

      res.status(200).json({
        message: `🚀 ~ > Organization '${userId}' is now in created with owner '${owner}'.`, 
        response,
      })
    } catch (err) {
      next(err)
      console.error(err)
  }
})

router.delete("/remove", async (req, res, next) =>{
  try {
    const query = "DELETE FROM organization WHERE id=:id;"
    
  } catch (err) {
    next(err)
    console.error(err)
    
  }
})

export { router as organizationRouter }
