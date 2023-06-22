import express from 'express'
import Question from './queries'
import { GetQuestionInput, GetQuestionsByCategoryInput } from './types'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getQuestionResponse = await Question.getQuestion(
        req.query as GetQuestionInput
      )
      res.status(200).json(getQuestionResponse)
    } else if (req.query.categoryid) {
      const listQuestionsInCategoryResponse = await Question.getQuestionsInCategory(
        req.query as GetQuestionsByCategoryInput
      )
      res.status(200).json(listQuestionsInCategoryResponse)
    } else {
      const listQuestionsResponse = await Question.listQuestions()
      res.status(200).json(listQuestionsResponse)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as questionsRouter }
