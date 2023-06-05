import {
  Panel,
  FormDefinition,
  UserAnswer,
  Question,
  QuestionAnswer,
  FormDefinitionByCreatedAtPaginated,
  FormDefinitionPaginated,
  UserFormPaginated,
  UserFormByCreatedAtPaginated,
} from '../types'
import * as helper from '../helperFunctions'
import * as customQueries from '../graphql/custom-queries'
import { Dispatch, SetStateAction } from 'react'

const createQuestionAnswers = (
  formDef: FormDefinition,
  setCategories: Dispatch<SetStateAction<string[]>>
) => {
  if (!formDef) return new Map()
  const categories = formDef.questions.items
    .map((item) => item.category)
    .filter(
      (category, index, array) =>
        array.findIndex((obj) => obj.text === category.text) === index
    )
    .sort((a, b) => {
      if (a.index && b.index == null) return -1
      if (a.index == null && b.index) return 1
      if (a.index && b.index) return a.index - b.index
      if (a.index == null && b.index == null)
        return a.text.localeCompare(b.text)
      return 0
    })
  setCategories(categories.map((cat) => cat.text))
  const quAnsMap = new Map<string, QuestionAnswer[]>()
  categories.forEach((cat) => {
    const quAns: QuestionAnswer[] = formDef.questions.items
      .filter((question) => question.category.id === cat.id)
      .sort((a, b) => {
        if (a.index && b.index == null) return -1
        if (a.index == null && b.index) return 1
        if (a.index && b.index) return a.index - b.index
        if (a.index == null && b.index == null)
          return a.topic.localeCompare(b.topic)
        return 0
      })
      .map((qu) => {
        return {
          question: qu,
          knowledge: -1,
          motivation: -1,
          customScaleValue: -1,
          updatedAt: 0,
        }
      })
    quAnsMap.set(cat.text, quAns)
  })
  return quAnsMap
}

const fetchLastFormDefinition = async (
  setFormDefinition: Dispatch<SetStateAction<FormDefinition | null>>,
  createQuestionAnswers: (arg0: FormDefinition) => Map<any, any>,
  getUserAnswers: (arg0: FormDefinition) => Promise<void | UserAnswer[]>,
  setFirstAnswers: (arg0: any, arg1: any) => void
) => {
  let nextToken: string | null = null
  let nextFormToken: string | null = null // For some reason, the custom query returns empty response if the first item is from a different organization
  let foundOrganizationForm = false // Therefore, we need to keep querying until we reach the first response connected to the users organization
  let questions: Question[] = []
  let formDefPaginated: FormDefinitionPaginated = undefined // The form definition response has pagination on questions, with nextToken; see types
  try {
    do {
      const currentForm: any =
        await helper.callGraphQL<FormDefinitionByCreatedAtPaginated>(
          customQueries.formByCreatedAtPaginated,
          {
            ...customQueries.formByCreatedAtInputConsts,
            nextToken: nextToken,
            nextFormToken: nextFormToken,
          }
        )
      if (currentForm.data && currentForm.data.formByCreatedAt.items[0]) {
        if (typeof formDefPaginated === 'undefined') {
          formDefPaginated = currentForm.data.formByCreatedAt.items[0]
          questions = currentForm.data.formByCreatedAt.items[0].questions.items
        } else {
          questions = questions.concat(
            currentForm.data.formByCreatedAt.items[0].questions.items
          )
        }
        nextToken =
          currentForm.data.formByCreatedAt.items[0].questions.nextToken
        foundOrganizationForm = true
        // nextFormToken = null;
      } else if (
        currentForm.data &&
        currentForm.data.formByCreatedAt &&
        !foundOrganizationForm
      ) {
        nextFormToken = currentForm.data.formByCreatedAt.nextToken
      }
    } while (nextToken || (nextFormToken && !foundOrganizationForm))

    if (formDefPaginated) {
      const formDef: FormDefinition = {
        id: formDefPaginated.id,
        createdAt: formDefPaginated.createdAt,
        questions: {
          items: questions,
        },
      }
      // console.log("FormDef:", formDef);
      setFormDefinition(formDef)
      const quAns = createQuestionAnswers(formDef)
      const userAnswers = await getUserAnswers(formDef)
      setFirstAnswers(quAns, userAnswers)
    } else {
      console.log('Error loading form definition!')
    }
  } catch (e) {
    console.error(
      'GraphQL error while fetching form definition and user answers!',
      e
    )
  }
}

const getUserAnswers = async (
  formDef: FormDefinition,
  userName: string,
  setUserAnswers: Dispatch<SetStateAction<UserAnswer[]>>,
  setActivePanel: Dispatch<SetStateAction<Panel>>,
  setUserAnswersLoaded: Dispatch<SetStateAction<boolean>>,
  setAnswerEditMode: Dispatch<SetStateAction<boolean>>,
  setFirstTimeLogin: Dispatch<SetStateAction<boolean>>
) => {
  let nextToken: string | null = null
  let nextUserFormToken: string | null = null
  let foundLatestUserForm = false

  if (!userName) {
    console.error('User not found when getting useranswers')
  }

  let questionAnswers: UserAnswer[] = []
  let paginatedUserform: UserFormPaginated | undefined // The userform response has pagination on questionAnswers, with nextToken; see types
  do {
    const query: any = (
      await helper.callGraphQL<UserFormByCreatedAtPaginated>(
        customQueries.customUserFormByCreatedAt,
        {
          ...customQueries.userFormByCreatedAtInputConsts,
          owner: userName,
          filter: { formDefinitionID: { eq: formDef.id } },
          nextQAToken: nextToken,
          nextUserFormToken: nextUserFormToken,
        }
      )
    ).data?.userFormByCreatedAt
    const response: any = query?.items[0]
    if (response) {
      foundLatestUserForm = true
    }
    if (query && !foundLatestUserForm) {
      nextUserFormToken = query.nextToken
    }
    if (response && response.questionAnswers.items) {
      if (typeof paginatedUserform === 'undefined') {
        paginatedUserform = response
        questionAnswers = response.questionAnswers.items
      } else {
        questionAnswers = questionAnswers.concat(response.questionAnswers.items)
      }
      nextToken = response.questionAnswers.nextToken
    }
  } while (nextToken || (nextUserFormToken && !foundLatestUserForm))

  if (paginatedUserform) {
    const removedQuestionsFiltered = questionAnswers.filter((q) => q.question)
    setUserAnswers(removedQuestionsFiltered)
    setUserAnswersLoaded(true)
    return removedQuestionsFiltered
  } else {
    setActivePanel(Panel.MyAnswers)
    setAnswerEditMode(false)
    setUserAnswersLoaded(true)
    setFirstTimeLogin(true)
  }

  return [] // Either could not load userform or no user form exists for current form definition
}

const setFirstAnswers = (
  quAns: Map<string, QuestionAnswer[]>,
  newUserAnswers: UserAnswer[] | void,
  setQuestionAnswers: Dispatch<SetStateAction<Map<string, QuestionAnswer[]>>>,
  setAnswersBeforeSubmitted: Dispatch<
    SetStateAction<Map<string, QuestionAnswer[]>>
  >
) => {
  const newMap = new Map<string, QuestionAnswer[]>()
  quAns.forEach((quAns, category) => {
    newMap.set(
      category,
      quAns.map((questionAnswer) => {
        if (newUserAnswers) {
          const userAnswer = newUserAnswers.filter(
            (userAnswer) =>
              userAnswer.question.id === questionAnswer.question.id
          )
          if (userAnswer.length === 0) return questionAnswer
          return {
            ...questionAnswer,
            knowledge: userAnswer[0]
              ? userAnswer[0].knowledge
              : questionAnswer.knowledge,
            motivation: userAnswer[0]
              ? userAnswer[0].motivation
              : questionAnswer.motivation,
            customScaleValue: userAnswer[0]
              ? userAnswer[0].customScaleValue
              : questionAnswer.customScaleValue,
            updatedAt: Date.parse(userAnswer[0].updatedAt) || 0,
          }
        }
        return questionAnswer
      })
    )
  })
  setQuestionAnswers(newMap)
  setAnswersBeforeSubmitted(new Map(newMap))
}

export {
  getUserAnswers,
  fetchLastFormDefinition,
  createQuestionAnswers,
  setFirstAnswers,
}
