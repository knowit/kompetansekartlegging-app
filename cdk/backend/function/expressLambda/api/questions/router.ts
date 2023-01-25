import express from 'express'
import Question, { CreateQuestionProps } from './queries'

const router = express.Router()

interface ReqParams {
  id: string
}

interface CategoryReqParams {
  categoryId: string
}

router.get('/', async (req, res, next) => {
  try {
    const listQuestionsResponse = await Question.listQuestions()
    res.status(200).json(listQuestionsResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get<ReqParams>('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const getQuestionResponse = await Question.getQuestion(id)
    res.status(200).json(getQuestionResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

router.get<CategoryReqParams>(
  '/:categoryId/questions',
  async (req, res, next) => {
    try {
      const { categoryId } = req.params
      console.log(categoryId)
      const listQuestionsInCategoryResponse = await Question.getQuestionsInCategory(
        categoryId
      )
      res.status(200).json(listQuestionsInCategoryResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.post<unknown, unknown, CreateQuestionProps>(
  '/',
  async (req, res, next) => {
    try {
      console.log('HI: ' + JSON.stringify(req.body))
      const createQuestionResponse = await Question.createQuestion(req.body)
      res.status(201).json(createQuestionResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.patch<ReqParams, unknown, CreateQuestionProps>(
  '/:id',
  async (req, res, next) => {
    try {
      const { id } = req.params
      const updateQuestionResponse = await Question.updateQuestion(id, req.body)
      res.status(200).json(updateQuestionResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

router.delete<ReqParams>('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const deleteQuestionResponse = await Question.deleteQuestion(id)
    res.status(200).json(deleteQuestionResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as questionsRouter }
