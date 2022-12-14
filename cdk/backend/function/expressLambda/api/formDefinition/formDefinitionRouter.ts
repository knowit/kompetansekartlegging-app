import express from 'express'
import FormDefinition from './formDefinitionQueries'

const router = express.Router()

router.get('/list', async (req, res, next) => {
  try {
    const listResponse = await FormDefinition.listFormDefinitions()

    res.status(200).json(listResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface CreateBodyParams {
  name: string
  organizationID: string
}

// Add user to group (essentialy creates/updates a user with groupid)
router.post<unknown, unknown, CreateBodyParams>(
  '/create',
  async (req, res, next) => {
    try {
      const createResponse = await FormDefinition.createFormDefinition({
        ...req.body,
      })

      res.status(200).json(createResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface DelReqParams {
  id: string
}

router.delete<unknown, unknown, unknown, DelReqParams>(
  '/:id/delete',
  async (req, res, next) => {
    try {
      const deleteResponse = await FormDefinition.deleteFormDefinition({
        ...req.query,
      })

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as formDefinitionRouter }
