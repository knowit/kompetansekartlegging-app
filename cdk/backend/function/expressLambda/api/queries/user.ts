import { ICategory, IQuestion, IQuestionAnswer } from '../../utils/types'
import { Categories, QuestionAnswers, Questions } from './index'

const getAnswersByCategories = async (
  username: string,
  identifier_attribute: string
) => {
  const output = []

  // Get all categories in the organization
  const categories = await Categories.listCategoriesInOrganization(
    identifier_attribute
  )
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
    const questions = await Questions.getQuestionsInCategory({
      category_id: category.id,
    })

    if (!questions.data) {
      throw new Error(`No questions found for category ${category.id}`)
    }

    // Get all question answers for user in category
    for (const question of questions.data) {
      const questionAnswer = await QuestionAnswers.getQuestionAnswerByUserAndQuestion(
        {
          question_id: question.id,
          username: username,
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

  return output.sort((a, b) => {
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
  })
}

export default {
  getAnswersByCategories,
}
