import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import { Auth } from 'aws-amplify'
import { QuestionType } from '../../../API'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../../constants'
import Button from '../../mui/Button'
import {
  createQuestion,
  listCategoriesByFormDefinitionID,
  listQuestionsByCategoryID,
} from '../catalogApi'
import { compareByIndex } from '../helpers'
import useApiGet from '../useApiGet'
import AddQuestionDialog from './AddQuestionDialog'
import RouterBreadcrumbs from './Breadcrumbs'
import QuestionList from './QuestionList'
import useQuery from './useQuery'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      marginLeft: '0 !important',
      display: 'flex',
      flexWrap: 'wrap',
    },
    questionList: {
      marginLeft: '0',
      marginRight: '0',
    },
    floatingMenu: {
      padding: '8px 0 0 48px',
      width: '250px',
    },
    addQuestionButton: {
      borderRadius: '30px',
      width: '20ch',
      marginTop: 0,
    },
  })
)

const EditCategory = () => {
  const [user, setUser] = useState<any | null>(null)

  if (!user) {
    Auth.currentAuthenticatedUser().then(setUser)
  }

  const classes = useStyles()
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
      <Container maxWidth="lg" className={classes.container}>
        {error && <p>An error occured: {error}</p>}
        {loading && <CircularProgress />}
        {!error && !loading && categories && (
          <>
            <Box flexBasis="100%">
              <RouterBreadcrumbs
                extraCrumbsMap={breadCrumbs}
                urlOverrides={breadCrumbsUrlOverrides}
              />
            </Box>
            <Container maxWidth="sm" className={classes.questionList}>
              <QuestionList
                id={id}
                categories={categories}
                questions={questions}
                formDefinitionID={formDefinitionID}
                formDefinitionLabel={formDefinitionLabel}
                refreshQuestions={refreshQuestions}
              />
            </Container>
            <div className={classes.floatingMenu}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={classes.addQuestionButton}
                onClick={() => setShowAddQuestionDialog(true)}
              >
                Legg til nytt spørsmål
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
      </Container>
    </>
  )
}

export default EditCategory
