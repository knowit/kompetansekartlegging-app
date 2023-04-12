import { v4 as uuidv4 } from 'uuid'

import { API, Auth } from 'aws-amplify'
import { callGraphQL } from '../../helperFunctions'
import { store } from '../../redux/store'

import {
  Category,
  // DeleteCategoryMutation,
  // DeleteFormDefinitionMutation,
  // DeleteQuestionMutation,
  FormDefinition,
  Mutation,
  Query,
  Question,
  // QuestionsByCategoryQuery,
  // UpdateCategoryMutation,
  // UpdateFormDefinitionMutation,
  // UpdateQuestionMutation,
  // CreateFormDefinitionMutation,
  // CreateCategoryMutation,
  QuestionType,
} from '../../API'
import {
  createCategory as createCategoryGq,
  createFormDefinition as createFormDefinitionGq,
  createQuestion as createQuestionGq,
  deleteCategory as deleteCategoryGq,
  deleteFormDefinition as deleteFormDefinitionGq,
  deleteQuestion as deleteQuestionGq,
  updateCategory as updateCategoryGq,
  updateFormDefinition as updateFormDefinitionGq,
  updateQuestion as updateQuestionGq,
} from '../../graphql/mutations'
import {
  categoriesByFormDefinition,
  formDefinitionByOrganizationId,
  questionsByCategory,
} from '../../graphql/queries'
import i18n from '../../i18n/i18n'
import { ApiResponse } from './adminApi'

const listAllFormDefinitionsForLoggedInUser = async (): Promise<
  ApiResponse<FormDefinition[]>
> => {
  const organizationID = store.getState().user.userState.organizationID
  try {
    return await listAllFormDefinitionsByOrganizationID(
      organizationID as string
    )
  } catch (e) {
    return {
      error: i18n.t(
        'catalogApi.couldNotGetAListOfAllFormDefinitionsForOrganizationID',
        { organizationID: organizationID }
      ),
    }
  }
}

const listAllFormDefinitionsByOrganizationID = async (
  organizationID: string
): Promise<ApiResponse<FormDefinition[]>> => {
  try {
    const gq = await callGraphQL<Query>(formDefinitionByOrganizationId, {
      organizationID,
    })
    const els = gq?.data?.formDefinitionByOrganizationID?.items?.map(
      (el) =>
        ({
          id: el?.id,
          label: el?.label,
          createdAt: el?.createdAt,
          updatedAt: el?.updatedAt,
          sortKeyConstant: el?.sortKeyConstant,
          organizationID: el?.organizationID,
        } as FormDefinition)
    )

    return { result: els || [] }
  } catch (e) {
    console.log(e)
    return {
      error: i18n.t('catalogApi.listAllFormDefinitionsByOrganizationIDError', {
        organizationID: organizationID,
      }),
    }
  }
}

const listCategoriesByFormDefinitionID = async (
  formDefinitionID: string
): Promise<ApiResponse<Category[]>> => {
  try {
    const gq = await callGraphQL<Query>(categoriesByFormDefinition, {
      formDefinitionID,
    })
    const els = gq?.data?.categoriesByFormDefinition?.items?.map(
      (el) =>
        ({
          id: el?.id,
          description: el?.description,
          formDefinitionID: el?.formDefinitionID,
          text: el?.text,
          index: el?.index,
          createdAt: el?.createdAt,
          updatedAt: el?.updatedAt,
        } as Category)
    )

    return { result: els || [] }
  } catch (e) {
    return {
      error: i18n.t(
        'catalogApi.couldNotGetAListOfCategoriesForFormDefinitionID',
        { formDefinitionID: formDefinitionID }
      ),
    }
  }
}

const listQuestionsByCategoryID = async (
  categoryID: string
): Promise<ApiResponse<Question[]>> => {
  try {
    const gq = await callGraphQL<Query>(questionsByCategory, {
      categoryID,
    })
    const els = gq?.data?.questionsByCategory?.items?.map(
      (el) =>
        ({
          id: el?.id,
          text: el?.text,
          topic: el?.topic,
          formDefinitionID: el?.formDefinitionID,
          categoryID: el?.categoryID,
          index: el?.index,
          createdAt: el?.createdAt,
          updatedAt: el?.updatedAt,

          type: el?.type,

          scaleStart: el?.scaleStart,
          scaleMiddle: el?.scaleMiddle,
          scaleEnd: el?.scaleEnd,
        } as Question)
    )

    return { result: els || [] }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotGetAListOfQuestionsForCategoryID', {
        categoryID: categoryID,
      }),
    }
  }
}

const updateCategory = async (
  id: string,
  vars: any
): Promise<ApiResponse<Category>> => {
  try {
    const input = {
      id,
      ...vars,
    }
    const gq = await callGraphQL<Mutation>(updateCategoryGq, {
      input,
    })
    const el = gq?.data?.updateCategory as Category
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotUpdateCategoryWithID', {
        categoryID: id,
      }),
    }
  }
}

const updateCategoryIndex = async (category: any, index: number) => {
  await updateCategory(category.id, { index })
}

const updateCategoryTextAndDescription = async (
  category: any,
  text: string,
  description: string
) => {
  await updateCategory(category.id, { text, description })
}

const updateQuestion = async (
  id: string,
  vars: any
): Promise<ApiResponse<Question>> => {
  try {
    const input = {
      id,
      ...vars,
    }
    const gq = await callGraphQL<Mutation>(updateQuestionGq, {
      input,
    })
    const el = gq?.data?.updateQuestion as Question
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotUpdateQuestionWithID', {
        questionID: id,
      }),
    }
  }
}

const updateQuestionIndex = async (question: any, index: number) => {
  await updateQuestion(question.id, { index })
}

const updateQuestionTextTopicAndCategory = async (
  question: any,
  topic: string,
  text: string,
  categoryID: string,
  questionConfig: any
) => {
  await updateQuestion(question.id, {
    topic,
    text,
    categoryID,
    ...questionConfig,
  })
}

const updateFormDefinition = async (
  id: string,
  vars: any
): Promise<ApiResponse<FormDefinition>> => {
  try {
    const input = {
      id,
      ...vars,
    }
    const gq = await callGraphQL<Mutation>(updateFormDefinitionGq, {
      input,
    })
    const el = gq?.data?.updateFormDefinition as FormDefinition
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotUpdateFormDefinitionWithID', {
        formDefinitionID: id,
      }),
    }
  }
}

const updateFormDefinitionCreatedAt = async (
  formDefinition: any,
  createdAt: string
) => {
  await updateFormDefinition(formDefinition.id, { createdAt })
}

const deleteFormDefinition = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const input = {
      id,
    }
    await callGraphQL<Mutation>(deleteFormDefinitionGq, {
      input,
    })
    return { result: null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotDeleteFormDefinitionWithID', {
        formDefinitionID: id,
      }),
    }
  }
}

const deleteCategory = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const input = {
      id,
    }
    await callGraphQL<Mutation>(deleteCategoryGq, {
      input,
    })
    return { result: null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotDeleteCategoryWithID', {
        categoryID: id,
      }),
    }
  }
}

const deleteQuestion = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const input = {
      id,
    }
    await callGraphQL<Mutation>(deleteQuestionGq, {
      input,
    })
    return { result: null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotDeleteQuestionWithID', {
        questionID: id,
      }),
    }
  }
}

const copyFormDefinition = async (
  formDefinitionId: string,
  name: string
): Promise<ApiResponse<null>> => {
  try {
    await API.get('CreateCopyCatalogAPI', '', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
      queryStringParameters: {
        formDefId: `${formDefinitionId}`,
        formDefLabel: `${name}`,
      },
    })
    return { result: null }
  } catch (e) {
    return {
      error: `Could not copy form definition '${formDefinitionId}'.`,
    }
  }
}

const createFormDefinition = async (
  name: string
): Promise<ApiResponse<FormDefinition>> => {
  try {
    const organizationID = store.getState().user.userState.organizationID
    const input = {
      id: uuidv4(),
      label: name,
      organizationID: organizationID,
      orgAdmins: `${organizationID}0admin`,
      sortKeyConstant: 'formDefinitionConstant',
      createdAt: new Date(0).toISOString(),
    }
    const gq = await callGraphQL<Mutation>(createFormDefinitionGq, {
      input,
    })
    const el = gq?.data?.createFormDefinition as FormDefinition
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotCreateTheFormDefinition', {
        catalogName: name,
      }),
    }
  }
}

const createCategory = async (
  name: string,
  description: string,
  index: number,
  formDefinitionID: string,
  organizationID: string
): Promise<ApiResponse<Category>> => {
  try {
    const input = {
      id: uuidv4(),
      text: name,
      description,
      index,
      formDefinitionID,
      orgAdmins: `${organizationID}0admin`,
      organizationID: organizationID,
    }
    const gq = await callGraphQL<Mutation>(createCategoryGq, {
      input,
    })
    const el = gq?.data?.createCategory as Category
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotCreateTheCategory', {
        categoryName: name,
      }),
    }
  }
}

const createQuestion = async (
  topic: string,
  description: string,
  questionType: QuestionType,
  index: number,
  formDefinitionID: string,
  categoryID: string,
  questionConfig: any,
  organizationID: string
): Promise<ApiResponse<Question>> => {
  try {
    const input = {
      id: uuidv4(),
      topic,
      type: questionType,
      text: description,
      index,
      formDefinitionID,
      categoryID,
      organizationID: organizationID,
      orgAdmins: `${organizationID}0admin`,
      ...questionConfig,
    }
    const gq = await callGraphQL<Mutation>(createQuestionGq, {
      input,
    })
    const el = gq?.data?.createQuestion as Question
    return { result: el || null }
  } catch (e) {
    return {
      error: i18n.t('catalogApi.couldNotCreateTheQuestion', {
        question: topic,
      }),
    }
  }
}

export {
  listAllFormDefinitionsForLoggedInUser,
  listCategoriesByFormDefinitionID,
  updateCategoryIndex,
  listQuestionsByCategoryID,
  updateQuestionIndex,
  updateCategoryTextAndDescription,
  updateQuestionTextTopicAndCategory,
  updateFormDefinitionCreatedAt,
  deleteFormDefinition,
  deleteCategory,
  deleteQuestion,
  copyFormDefinition,
  createFormDefinition,
  createCategory,
  createQuestion,
}
