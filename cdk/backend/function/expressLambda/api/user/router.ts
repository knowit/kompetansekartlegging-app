import express from 'express'
import Category from '../categories/queries'
import { ICategory } from '../categories/types'
import QuestionAnswer from '../question-answers/queries'
import { IQuestionAnswer } from '../question-answers/types'
import Question from '../questions/queries'
import { IQuestion } from '../questions/types'
import { getUserOnRequest } from '../utils'

const router = express.Router()

router.get('/answers-by-categories', async (req, res, next) => {
  try {
    const { username } = getUserOnRequest(req)

    if (!username) {
      throw new Error('No username found on request')
    }

    const output = []

    // Get all categories
    const categories = await Category.listCategories()
    if (!categories.data) {
      throw new Error('No categories found')
    }

    for (const category of categories.data) {
      const annotatedObject: ICategory & {
        questions: Array<IQuestion & { questionAnswer: IQuestionAnswer | null }>
      } = {
        ...category,
        questions: [],
      }
      // Get all questions in category
      const questions = await Question.getQuestionsInCategory({
        category_id: category.id,
      })

      if (!questions.data) {
        throw new Error(`No questions found for category ${category.id}`)
      }

      // Get all question answers for user in category
      for (const question of questions.data) {
        const questionAnswer = await QuestionAnswer.getQuestionAnswerByUserAndQuestion(
          {
            question_id: question.id,
            user_username: username,
          }
        )

        annotatedObject.questions.push({
          ...question,
          questionAnswer: questionAnswer.data,
        })
      }

      annotatedObject.questions.sort((a, b) => a.index - b.index)
      output.push(annotatedObject)
    }

    res.status(200).json({
      status: 'ok',
      message: `🚀 ~ > All question answers by categories.`,
      data: output.sort((a, b) => {
        if (a.index === null && b.index === null) {
          return 0
        }
        if (a.index === null) {
          return -1
        }
        if (b.index === null) {
          return 1
        }
        return a.index - b.index
      }),
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

export { router as userRouter }
