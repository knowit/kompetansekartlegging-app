import { apiDELETE, apiGET, apiPATCH, apiPOST } from '../client'
import {
  DeleteFormDefinitionInput,
  FormDefinition,
  FormDefinitionInput,
  GetFormDefinitionInput,
  UpdateFormDefinitionInput,
} from './types'

export const getAllFormDefinitions = async () =>
  apiGET<FormDefinition>('/formDefinitions')

export const createFormDefinition = async (data: FormDefinitionInput) =>
  apiPOST<FormDefinition>('/formDefinitions', { body: data })

export const deleteFormDefinition = async (id: DeleteFormDefinitionInput) =>
  apiDELETE<FormDefinition>('/formDefinitions', { body: id })

export const updateFormDefinition = async (
  id: GetFormDefinitionInput,
  data: UpdateFormDefinitionInput
) => apiPATCH('/formDefinitions/:id', { queryStringParameters: id, body: data })
