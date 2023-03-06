import express from 'express'
import QuestionAnswer from './queries'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  QuestionAnswerInput,
} from './types'

const router = express.Router()

// List all questionAnswers
router.get('/', async (req, res, next) => {
  if (req.query.id) next()
  try {
    const listQuestionAnswerResponse = await QuestionAnswer.listQuestionAnswers()
    res.status(200).json(listQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Get questionAnswer from id
router.get<unknown, unknown, unknown, GetQuestionAnswerInput>(
  '/',
  async (req, res, next) => {
    try {
      const getQuestionAnswerResponse = await QuestionAnswer.getQuestionAnswer(
        req.query
      )

      res.status(200).json(getQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Create questionAnswer
router.post<unknown, unknown, QuestionAnswerInput>(
  '/',
  async (req, res, next) => {
    try {
      const createQuestionAnswerResponse = await QuestionAnswer.createQuestionAnswer(
        req.body
      )
      res.status(201).json(createQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update questionAnswer with given id
router.patch<unknown, unknown, QuestionAnswerInput, GetQuestionAnswerInput>(
  '/',
  async (req, res, next) => {
    try {
      const updateQuestionAnswerResponse = await QuestionAnswer.updateQuestionAnswer(
        req.query,
        req.body
      )
      res.status(200).json(updateQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete questionAnswer with given id
router.delete<unknown, unknown, DeleteQuestionAnswerInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteQuestionAnswerResponse = await QuestionAnswer.deleteQuestionAnswer(
        req.body
      )
      res.status(200).json(deleteQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

interface Response {
  message: string
  data: {}
}

// Batch create questionAnswers
router.post<unknown, unknown, QuestionAnswerInput[]>(
  '/batch',
  async (req, res, next) => {
    try {
      const responses: Response[] = []
      await Promise.all(
        req.body.map(async qa => {
          const createQuestionAnswerResponse: Response = await QuestionAnswer.createQuestionAnswer(
            qa
          )
          responses.push(createQuestionAnswerResponse)
        })
      )
      res.status(200).json(responses)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as questionAnswersRouter }
