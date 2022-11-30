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
      const query =
        "INSERT INTO organization VALUES(:id, DEFAULT, :owner, :orgname, :identifierAttribute);"

      // Fra SqlParameter-typen så skal key her samsvare med name, og value være value.
      const params: SqlParameterInput = {
        id: { stringValue: id },
        orgname: { stringValue: orgname },
        identifierAttribute: { stringValue: identifierAttribute },
        owner: { stringValue: "owner"}
      }

      const response = await sqlQuery(query, params)

      res.status(200).json(response)
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
