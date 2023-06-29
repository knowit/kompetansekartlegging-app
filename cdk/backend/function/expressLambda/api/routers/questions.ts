import express from 'express'
import { QuestionCategoryId, QuestionId } from '../../utils/types'
import { Questions } from '../queries'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    if (req.query.id) {
      const getQuestionResponse = await Questions.getQuestion(
        req.query as QuestionId
      )
      res.status(200).json(getQuestionResponse)
    } else if (req.query.category_id) {
      const listQuestionsInCategoryResponse = await Questions.getQuestionsInCategory(
        req.query as QuestionCategoryId
      )
      res.status(200).json(listQuestionsInCategoryResponse)
    } else {
      const listQuestionsResponse = await Questions.listQuestions()
      res.status(200).json(listQuestionsResponse)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export default router
