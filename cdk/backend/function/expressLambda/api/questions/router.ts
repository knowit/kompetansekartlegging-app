import express from 'express'
import { QuestionCategoryId, QuestionId } from '../../utils/types'
import Question from './queries'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getQuestionResponse = await Question.getQuestion(
        req.query as QuestionId
      )
      res.status(200).json(getQuestionResponse)
    } else if (req.query.category_id) {
      const listQuestionsInCategoryResponse = await Question.getQuestionsInCategory(
        req.query as QuestionCategoryId
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
