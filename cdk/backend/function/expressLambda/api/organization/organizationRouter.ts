import { SqlParameter, TypeHint } from "@aws-sdk/client-rds-data"
import express from "express"
import { sqlQuery } from "../../app"

const router = express.Router()

router.get("/list", async (_req, res, next) => {
  try {
    const SELECT_QUERY = "SELECT id, orgname, identifierAttribute FROM organization"
    const response = await sqlQuery(SELECT_QUERY)

    res.status(200).json({
      message: `🚀 ~ > All organizations selected.`, 
      response,
    })  } catch (err) {
    next(err)
    console.error(err)
  }
})

interface addOrganizationParams {
  id: string
  orgname: string
  identifierAttribute: string
  owner: string
}

router.post<unknown, unknown, addOrganizationParams>(
  "/add",
  async (req, res, next) => {
    const { id, orgname, identifierAttribute } = req.body
    let owner = "DefaultOwner"
    try {
      const INSERT_QUERY =
        "INSERT INTO organization(id, createdAt owner, orgname, identifierattribute) VALUES(:id, CAST(date '2020-10-10' AS TIMESTAMPTZ), :owner, :orgname, :identifierAttribute);"

      const response = await sqlQuery(INSERT_QUERY, [
        {
          name: "id",
          value: {
            stringValue: id,
          },
          typeHint: TypeHint.UUID,
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
            stringValue: owner,
          },
          typeHint: TypeHint.UUID,
        },
      ])

      res.status(200).json({
        message: `🚀 ~ > Organization '${id}' is now in created with owner '${owner}'.`, 
        response,
      })
    } catch (err) {
      next(err)
      console.error(err)
  }
})

router.delete("/remove", 
async (req, res, next) =>{
  const { id } = req.body
    try {
    const DELETE_QUERY = "DELETE FROM organization WHERE id=:id;"
    const response = await sqlQuery(DELETE_QUERY, [
      {
        name: "id",
        value: {
          stringValue: id,
        }
      },
    ])
    res.status(200).json({
      message: `🚀 ~ > Organization '${id}' is now deleted.`, 
      response,
    })
  } catch (err) {
    next(err)
    console.error(err)
    
  }
})

export { router as organizationRouter }
