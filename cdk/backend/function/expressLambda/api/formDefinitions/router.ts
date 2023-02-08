import express from 'express'
import FormDefinition from './queries'
import {
  DeleteFormDefinitionInput,
  FormDefinitionInput,
  GetFormDefinitionInput,
  UpdateFormDefinitionInput,
} from './types'

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

// Create
router.post<unknown, unknown, FormDefinitionInput>(
  '/',
  async (req, res, next) => {
    try {
      const createResponse = await FormDefinition.createFormDefinition(req.body)

      res.status(200).json(createResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete
router.delete<unknown, unknown, DeleteFormDefinitionInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteResponse = await FormDefinition.deleteFormDefinition(req.body)

      res.status(200).json(deleteResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update
router.patch<
  unknown,
  unknown,
  UpdateFormDefinitionInput,
  GetFormDefinitionInput
>('/:id', async (req, res, next) => {
  try {
    const { id } = req.query
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
