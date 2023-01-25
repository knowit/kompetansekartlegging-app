import express from 'express'
import QuestionAnswer, {
  CreateQuestionAnswerProp,
} from './questionAnswersQuery'

const router = express.Router()

interface ReqParams {
  questionAnswerId: string
}

// List all questionAnswers
router.get('/', async (req, res, next) => {
  try {
    const listQuestionAnswerResponse =
      await QuestionAnswer.listQuestionAnswers()
    res.status(200).json(listQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Get questionAnswer from id
router.get<ReqParams>('/:questionAnswerId', async (req, res, next) => {
  try {
    const { questionAnswerId } = req.params
    const getQuestionAnswerResponse = await QuestionAnswer.getQuestionAnswer(
      questionAnswerId
    )

    res.status(200).json(getQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Create questionAnswer
router.post<unknown, unknown, CreateQuestionAnswerProp>(
  '/',
  async (req, res, next) => {
    try {
      const createQuestionAnswerResponse =
        await QuestionAnswer.createQuestionAnswer(req.body)
      res.status(201).json(createQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update questionAnswer with given id
router.patch<ReqParams, unknown, CreateQuestionAnswerProp>(
  '/:questionAnswerId',
  async (req, res, next) => {
    try {
      const { questionAnswerId } = req.params
      const updateQuestionAnswerResponse =
        await QuestionAnswer.updateQuestionAnswer(questionAnswerId, req.body)
      res.status(200).json(updateQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete questionAnswer with given id
router.delete<ReqParams>('/:questionAnswerId', async (req, res, next) => {
  try {
    const { questionAnswerId } = req.params
    const deleteQuestionAnswerResponse =
      await QuestionAnswer.deleteQuestionAnswer(questionAnswerId)
    res.status(200).json(deleteQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

interface Response {
  message: string
  data: {}
}

// Batch create questionAnswers
router.post<unknown, unknown, CreateQuestionAnswerProp[]>(
  '/batch',
  async (req, res, next) => {
    try {
      const responses: Response[] = []
      await Promise.all(
        req.body.map(async (qa) => {
          const createQuestionAnswerResponse: Response =
            await QuestionAnswer.createQuestionAnswer(qa)
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
