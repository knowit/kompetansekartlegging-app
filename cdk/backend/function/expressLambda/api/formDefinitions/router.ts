import express from 'express'
import FormDefinition from './queries'

const router = express.Router()

// Get all form definitions
router.get('/', async (req, res, next) => {
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

// Create
router.post<unknown, unknown, CreateBodyParams>('/', async (req, res, next) => {
  try {
    const createResponse = await FormDefinition.createFormDefinition({
      ...req.body,
    })

    res.status(200).json(createResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface DelReqParams {
  id: string
}

// Delete
router.delete<unknown, unknown, DelReqParams>('/', async (req, res, next) => {
  try {
    const deleteResponse = await FormDefinition.deleteFormDefinition({
      ...req.body,
    })

    res.status(200).json(deleteResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface UpdateFormDefinitionReqParams {
  id: string
}

interface UpdateFormDefinitionBodyParams {
  label: string
  createdAt?: string
  updatedAt?: string
  organizationId?: string
}

// Update
router.patch<
  UpdateFormDefinitionReqParams,
  unknown,
  UpdateFormDefinitionBodyParams
>('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const updateResponse = await FormDefinition.updateFormDefinition(
      id,
      req.body
    )

    res.status(200).json(updateResponse)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

export { router as formDefinitionRouter }
