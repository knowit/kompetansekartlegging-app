import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import { Auth } from 'aws-amplify'
import { useTranslation } from 'react-i18next'
import { QuestionType } from '../../../API'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../../constants'
import { Button } from '@mui/material'
import {
  createQuestion,
  listCategoriesByFormDefinitionID,
  listQuestionsByCategoryID,
} from '../catalogApi'
import { Add as AddIcon } from '@mui/icons-material'
import { compareByIndex } from '../helpers'
import useApiGet from '../useApiGet'
import AddQuestionDialog from './AddQuestionDialog'
import RouterBreadcrumbs from './Breadcrumbs'
import QuestionList from './QuestionList'
import useQuery from './useQuery'

const EditCategory = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState<any | null>(null)

  if (!user) {
    Auth.currentAuthenticatedUser().then(setUser)
  }

  const { id, formDefinitionID } = useParams<Record<string, string>>()

  const memoizedCallback = useCallback(
    () => listCategoriesByFormDefinitionID(formDefinitionID),
    [formDefinitionID]
  )
  const {
    result: categories,
    error: errorCategories,
    loading: loadingCategories,
  } = useApiGet({
    getFn: memoizedCallback,
    cmpFn: compareByIndex,
  })

  const memoizedQuestionsCallback = useCallback(
    () => listQuestionsByCategoryID(id),
    [id]
  )
  const {
    result: questions,
    error: errorQuestions,
    loading: loadingQuestions,
    refresh: refreshQuestions,
  } = useApiGet({
    getFn: memoizedQuestionsCallback,
    cmpFn: compareByIndex,
  })

  const [showAddQuestionDialog, setShowAddQuestionDialog] =
    useState<boolean>(false)
  const addQuestionConfirm = async (
    topic: string,
    description: string,
    questionType: QuestionType,
    questionConfig: Record<string, unknown> = {}
  ) => {
    // the dialog makes sure questionConfig contains the correct data
    // might be a good idea to double check here
    await createQuestion(
      topic,
      description,
      questionType,
      questions.length + 1,
      formDefinitionID,
      id,
      questionConfig,
      user ? user.attributes[ORGANIZATION_ID_ATTRIBUTE] : ''
    )
    setShowAddQuestionDialog(false)
    refreshQuestions()
  }

  const query = useQuery()
  const formDefinitionLabel = query.get('formDefinitionLabel')
  const label = query.get('label')
  const breadCrumbs = {
    [`/edit/${formDefinitionID}`]: formDefinitionLabel,
    [`/edit/${formDefinitionID}/${id}`]: label,
  }
  const breadCrumbsUrlOverrides = {
    '/edit': `/edit/${formDefinitionID}?label=${formDefinitionLabel}`,
    [`/edit/${formDefinitionID}`]: `/edit/${formDefinitionID}?label=${formDefinitionLabel}`,
  }

  const loading = loadingCategories || loadingQuestions
  const error = errorCategories || errorQuestions

  return (
    <>
      <>
        {error && <p>{t('errorOccured') + error}</p>}
        {loading && <CircularProgress />}
        {!error && !loading && categories && (
          <>
            <Box flexBasis="100%">
              <RouterBreadcrumbs
                extraCrumbsMap={breadCrumbs}
                urlOverrides={breadCrumbsUrlOverrides}
              />
            </Box>
            <>
              <QuestionList
                id={id}
                categories={categories}
                questions={questions}
                formDefinitionID={formDefinitionID}
                formDefinitionLabel={formDefinitionLabel}
                refreshQuestions={refreshQuestions}
              />
            </>
            <div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddQuestionDialog(true)}
              >
                {t('admin.editCatalogs.addNewQuestion')}
              </Button>
            </div>
            {showAddQuestionDialog && (
              <AddQuestionDialog
                open={showAddQuestionDialog}
                onCancel={() => setShowAddQuestionDialog(false)}
                onConfirm={addQuestionConfirm}
              />
            )}
          </>
        )}
      </>
    </>
  )
}

export default EditCategory
