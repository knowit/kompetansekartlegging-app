import express from 'express'
import Question from './queries'
import {
  DeleteQuestionInput,
  GetQuestionInput,
  GetQuestionsByCategoryInput,
  QuestionInput,
} from './types'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const listQuestionsResponse = await Question.listQuestions()
    res.status(200).json(listQuestionsResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get<unknown, unknown, unknown, GetQuestionInput>(
  '/:id',
  async (req, res, next) => {
    try {
      const getQuestionResponse = await Question.getQuestion(req.query)
      res.status(200).json(getQuestionResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.get<unknown, unknown, unknown, GetQuestionsByCategoryInput>(
  '/:categoryid/questions',
  async (req, res, next) => {
    try {
      const listQuestionsInCategoryResponse = await Question.getQuestionsInCategory(
        req.query
      )
      res.status(200).json(listQuestionsInCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.post<unknown, unknown, QuestionInput>('/', async (req, res, next) => {
  try {
    const createQuestionResponse = await Question.createQuestion(req.body)
    res.status(201).json(createQuestionResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.patch<unknown, unknown, QuestionInput, GetQuestionInput>(
  '/:id',
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

router.delete<unknown, unknown, DeleteQuestionInput>(
  '/',
  async (req, res, next) => {
    try {
      const deleteQuestionResponse = await Question.deleteQuestion(req.body)
      res.status(200).json(deleteQuestionResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

export { router as questionsRouter }
