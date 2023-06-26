import express from 'express'
import { getUserOnRequest } from '../utils'
import QuestionAnswer from './queries'
import {
  DeleteQuestionAnswerInput,
  GetQuestionAnswerInput,
  IQuestionAnswer,
  QuestionAnswerInput,
  QuestionAnswerResponses,
} from './types'

const router = express.Router()

// GET QuestionAnswer
router.get('/', async (req, res, next) => {
  try {
    // Get by id
    if (req.query.id) {
      const getQuestionAnswerResponse = await QuestionAnswer.getQuestionAnswer(
        req.query as GetQuestionAnswerInput
      )
      res.status(200).json(getQuestionAnswerResponse)

      // Get by user and question
    } else if (req.query.question_id) {
      const { username } = getUserOnRequest(req)

      if (!username) {
        throw new Error('No username found on request')
      }

      const getQuestionAnswerResponse = await QuestionAnswer.getQuestionAnswerByUserAndQuestion(
        {
          question_id: req.query.question_id as IQuestionAnswer['question_id'],
          user_username: username,
        }
      )

      res.status(200).json(getQuestionAnswerResponse)

      // Get all
    } else {
      const listQuestionAnswerResponse = await QuestionAnswer.listQuestionAnswers()
      res.status(200).json(listQuestionAnswerResponse)
    }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

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

// Batch create questionAnswers
router.post<unknown, unknown, QuestionAnswerInput[]>(
  '/batch',
  async (req, res, next) => {
    try {
      let responses: QuestionAnswerResponses = {
        status: 'ok',
        message: '🚀 ~ > Created questionAnswers from batch',
        data: [],
      }
      const data: (IQuestionAnswer | null)[] = []
      await Promise.all(
        req.body.map(async qa => {
          await QuestionAnswer.createQuestionAnswer(qa).then(response => {
            data.push(response.data)
            responses = {
              ...responses,
              status:
                response.status === 'ok' ? responses.status : response.status,
              data: data,
            }
          })
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