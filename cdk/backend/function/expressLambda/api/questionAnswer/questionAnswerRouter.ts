import express from "express"
import { sqlQuery } from "../../app"
import QuestionAnswer, { CreateQuestionAnswerProp } from "./questionAnswerQuery"

const router = express.Router()

interface ReqParams {
  questionAnswerId: string
}

// List all questionAnswers
router.get("/", async (req, res, next) => {
  try {
    const listQuestionAnswerResponse = await QuestionAnswer.listQuestionAnswers()
    res.status(200).json(listQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Get questionAnswer from id
router.get<ReqParams>("/:questionAnswerId", async (req, res, next) => {
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
  "/",
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
router.patch<ReqParams, unknown, CreateQuestionAnswerProp>(
  "/:questionAnswerId",
  async (req, res, next) => {
    try {
      const { questionAnswerId } = req.params
      const updateQuestionAnswerResponse = await QuestionAnswer.updateQuestionAnswer(
        questionAnswerId,
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
router.delete<ReqParams>("/:questionAnswerId", async (req, res, next) => {
  try {
    const { questionAnswerId } = req.params
    const deleteQuestionAnswerResponse = await QuestionAnswer.deleteQuestionAnswer(
      questionAnswerId
    )
    res.status(200).json(deleteQuestionAnswerResponse)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// Batch create questionAnswers
router.post<unknown, unknown, CreateQuestionAnswerProp[]>(
  "/batch",
  async (req, res, next) => {
    try {
      const responses = []
      req.body.forEach(async (qa) => {
        responses.push(await QuestionAnswer.createQuestionAnswerFromBatch(qa))
      })
      res.status(200).json()
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
)

// Get all question in a category
// Get all question
// Get question (id)

// Get questionsAnswer (id)
// Get all questionAnswers

// Put batch create questionAnswer
// Post create questionAnswer
// Patch update questionAnswer
// Delete questionAnswer (id)

//Post Create question
// Patch update question
// Delete question
export { router as questionAnswerRouter }
