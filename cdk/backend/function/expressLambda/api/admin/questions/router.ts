import express from 'express'
import { QuestionId, QuestionInput } from '../../../utils/types'
import Question from '../../questions/queries'

const router = express.Router()

router.post<unknown, unknown, QuestionInput>('/', async (req, res, next) => {
  try {
    const createQuestionResponse = await Question.createQuestion(req.body)
    res.status(201).json(createQuestionResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.patch<unknown, unknown, QuestionInput, QuestionId>(
  '/',
  async (req, res, next) => {
    try {
      const updateQuestionResponse = await Question.updateQuestion(
        req.query,
        req.body
      )
      res.status(200).json(updateQuestionResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.delete<unknown, unknown, QuestionId>('/', async (req, res, next) => {
  try {
    const deleteQuestionResponse = await Question.deleteQuestion(req.body)
    res.status(200).json(deleteQuestionResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as adminQuestionsRouter }
