import express from 'express'
import {
  IQuestionAnswer,
  IQuestionAnswerResponses,
  QuestionAnswerId,
  QuestionAnswerInput,
  UpdateQuestionAnswerBody,
} from '../../utils/types'
import { getUserOnRequest } from '../../utils/utils'
import { QuestionAnswers } from '../queries'

const router = express.Router()

// GET QuestionAnswer
router.get('/', async (req, res, next) => {
  try {
    // Get by user and question
    if (req.query.question_id) {
      const { username } = getUserOnRequest(req)

      if (!username) {
        throw new Error('No username found on request')
      }

      const getQuestionAnswerResponse = await QuestionAnswers.getQuestionAnswerByUserAndQuestion(
        {
          question_id: req.query.question_id as IQuestionAnswer['question_id'],
          username: username,
        }
      )

      res.status(200).json(getQuestionAnswerResponse)

      // Get all
    } else {
      const listQuestionAnswerResponse = await QuestionAnswers.listQuestionAnswers()
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
      const { username, ...body } = { ...req.body }
      const usernameOnRequest = getUserOnRequest(req).username
      if (!usernameOnRequest) {
        throw new Error('No username found on request')
      }
      const createQuestionAnswerResponse = await QuestionAnswers.createQuestionAnswer(
        { username: usernameOnRequest, ...body }
      )
      res.status(201).json(createQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Update questionAnswer with given id
router.patch<unknown, unknown, UpdateQuestionAnswerBody, QuestionAnswerId>(
  '/',
  async (req, res, next) => {
    try {
      const usernameOnRequest = getUserOnRequest(req).username
      if (!usernameOnRequest) {
        throw new Error('No username found on request')
      }
      const updateQuestionAnswerResponse = await QuestionAnswers.updateQuestionAnswer(
        req.query,
        { username: usernameOnRequest, ...req.body }
      )
      res.status(200).json(updateQuestionAnswerResponse)
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Delete questionAnswer with given id
router.delete<unknown, unknown, QuestionAnswerId>(
  '/',
  async (req, res, next) => {
    try {
      const deleteQuestionAnswerResponse = await QuestionAnswers.deleteQuestionAnswer(
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
      const usernameOnRequest = getUserOnRequest(req).username
      if (!usernameOnRequest) {
        throw new Error('No username found on request')
      }
      let responses: IQuestionAnswerResponses = {
        status: 'ok',
        message: '🚀 ~ > Created questionAnswers from batch',
        data: [],
      }
      const data: (IQuestionAnswer | null)[] = []
      await Promise.all(
        req.body.map(async qa => {
          const { username, ...body } = { ...qa }
          await QuestionAnswers.createQuestionAnswer({
            username: usernameOnRequest,
            ...body,
          }).then(response => {
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

export default router
