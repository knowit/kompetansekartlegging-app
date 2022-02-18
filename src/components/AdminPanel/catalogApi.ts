import { v4 as uuidv4 } from "uuid";

import { callGraphQL } from "../../helperFunctions";
import { store } from "../../redux/store";

import {
    CategoriesByFormDefinitionQuery,
    Category,
    DeleteCategoryMutation,
    DeleteFormDefinitionMutation,
    DeleteQuestionMutation,
    FormDefinition,
    Question,
    QuestionsByCategoryQuery,
    UpdateCategoryMutation,
    UpdateFormDefinitionMutation,
    UpdateQuestionMutation,
    CreateFormDefinitionMutation,
    CreateCategoryMutation,
    QuestionType,
    CreateQuestionMutation,
    FormDefinitionByOrganizationIdQuery,
} from "../../API";
import {
    categoriesByFormDefinition,
    formDefinitionByOrganizationId,
    questionsByCategory,
} from "../../graphql/queries";
import {
    updateCategory as updateCategoryGq,
    updateQuestion as updateQuestionGq,
    updateFormDefinition as updateFormDefinitionGq,
    deleteFormDefinition as deleteFormDefinitionGq,
    deleteCategory as deleteCategoryGq,
    deleteQuestion as deleteQuestionGq,
    createFormDefinition as createFormDefinitionGq,
    createCategory as createCategoryGq,
    createQuestion as createQuestionGq,
} from "../../graphql/mutations";
import { ApiResponse } from "./adminApi";

const listAllFormDefinitionsForLoggedInUser = async (): Promise<
    ApiResponse<FormDefinition[]>
> => {

    const organizationID = store.getState().user.userState.organizationID;
    try {
        return await listAllFormDefinitionsByOrganizationID(organizationID as string);
    } catch (e) {
        return { error: `Could not get a list of all form definitions for organization id '${organizationID}'.` };
    }
};

const listAllFormDefinitionsByOrganizationID = async (
    organizationID: string
): Promise<
    ApiResponse<FormDefinition[]>
> => {
    try {
        const gq = await callGraphQL<FormDefinitionByOrganizationIdQuery>(
            formDefinitionByOrganizationId,
            {
                organizationID,
            }
        );
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
        );

        return { result: els || [] };
    } catch (e) {
        console.log(e)
        return { error: `listAllFormDefinitionsByOrganizationID: Could not get a list of all form definitions for organization id '${organizationID}'.` };
    }
};

const listCategoriesByFormDefinitionID = async (
    formDefinitionID: string
): Promise<ApiResponse<Category[]>> => {
    try {
        const gq = await callGraphQL<CategoriesByFormDefinitionQuery>(
            categoriesByFormDefinition,
            {
                formDefinitionID,
            }
        );
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
        );

        return { result: els || [] };
    } catch (e) {
        return {
            error: `Could not get a list of categories for form definition id '${formDefinitionID}'.`,
        };
    }
};

const listQuestionsByCategoryID = async (
    categoryID: string
): Promise<ApiResponse<Question[]>> => {
    try {
        const gq = await callGraphQL<QuestionsByCategoryQuery>(
            questionsByCategory,
            {
                categoryID,
            }
        );
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
        );

        return { result: els || [] };
    } catch (e) {
        return {
            error: `Could not get a list of questions for category id '${categoryID}'.`,
        };
    }
};

const updateCategory = async (
    id: string,
    vars: any
): Promise<ApiResponse<Category>> => {
    try {
        const input = {
            id,
            ...vars,
        };
        const gq = await callGraphQL<UpdateCategoryMutation>(updateCategoryGq, {
            input,
        });
        const el = gq?.data?.updateCategory as Category;
        return { result: el || null };
    } catch (e) {
        return {
            error: `Could not update category '${id}'.`,
        };
    }
};

const updateCategoryIndex = async (category: any, index: number) => {
    await updateCategory(category.id, { index });
};

const updateCategoryTextAndDescription = async (
    category: any,
    text: string,
    description: string
) => {
    await updateCategory(category.id, { text, description });
};

const updateQuestion = async (
    id: string,
    vars: any
): Promise<ApiResponse<Question>> => {
    try {
        const input = {
            id,
            ...vars,
        };
        const gq = await callGraphQL<UpdateQuestionMutation>(updateQuestionGq, {
            input,
        });
        const el = gq?.data?.updateQuestion as Question;
        return { result: el || null };
    } catch (e) {
        return {
            error: `Could not update question '${id}'.`,
        };
    }
};

const updateQuestionIndex = async (question: any, index: number) => {
    await updateQuestion(question.id, { index });
};

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
    });
};

const updateFormDefinition = async (
    id: string,
    vars: any
): Promise<ApiResponse<FormDefinition>> => {
    try {
        const input = {
            id,
            ...vars,
        };
        const gq = await callGraphQL<UpdateFormDefinitionMutation>(
            updateFormDefinitionGq,
            {
                input,
            }
        );
        const el = gq?.data?.updateFormDefinition as FormDefinition;
        return { result: el || null };
    } catch (e) {
        return {
            error: `Could not update form definition '${id}'.`,
        };
    }
};

const updateFormDefinitionCreatedAt = async (
    formDefinition: any,
    createdAt: string
) => {
    await updateFormDefinition(formDefinition.id, { createdAt });
};

const deleteFormDefinition = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const input = {
            id,
        };
        await callGraphQL<DeleteFormDefinitionMutation>(
            deleteFormDefinitionGq,
            {
                input,
            }
        );
        return { result: null };
    } catch (e) {
        return {
            error: `Could not delete form definition '${id}'.`,
        };
    }
};

const deleteCategory = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const input = {
            id,
        };
        await callGraphQL<DeleteCategoryMutation>(deleteCategoryGq, {
            input,
        });
        return { result: null };
    } catch (e) {
        return {
            error: `Could not delete category '${id}'.`,
        };
    }
};

const deleteQuestion = async (id: string): Promise<ApiResponse<null>> => {
    try {
        const input = {
            id,
        };
        await callGraphQL<DeleteQuestionMutation>(deleteQuestionGq, {
            input,
        });
        return { result: null };
    } catch (e) {
        return {
            error: `Could not delete question '${id}'.`,
        };
    }
};

const createFormDefinition = async (
    name: string
): Promise<ApiResponse<FormDefinition>> => {
    try {
        const organizationID = store.getState().user.userState.organizationID;
        const input = {
            id: uuidv4(),
            label: name,
            organizationID: organizationID,
            orgAdmins: `${organizationID}0admin`,
            sortKeyConstant: "formDefinitionConstant",
            createdAt: new Date(0).toISOString(),
        };
        const gq = await callGraphQL<CreateFormDefinitionMutation>(
            createFormDefinitionGq,
            {
                input,
            }
        );
        const el = gq?.data?.createFormDefinition as FormDefinition;
        return { result: el || null };
    } catch (e) {
        return {
            error: `Could not create form definition '${name}'.`,
        };
    }
};

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
            organizationID: organizationID
        };
        const gq = await callGraphQL<CreateCategoryMutation>(createCategoryGq, {
            input,
        });
        const el = gq?.data?.createCategory as Category;
        return { result: el || null };
    } catch (e) {

        return {
            error: `Could not create category '${name}'.`,
        };
    }
};

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
        };
        const gq = await callGraphQL<CreateQuestionMutation>(createQuestionGq, {
            input,
        });
        const el = gq?.data?.createQuestion as Question;
        return { result: el || null };
    } catch (e) {
        return {
            error: `Could not create question '${topic}'.`,
        };
    }
};

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
    createFormDefinition,
    createCategory,
    createQuestion,
};
