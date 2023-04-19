import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import { Auth } from 'aws-amplify'
import { QuestionInput, QuestionType } from '../../../api/questions/types'
import Button from '../../mui/Button'
import { listCategoriesByFormDefinitionID } from '../catalogApi'
import {
  createQuestion,
  getQuestionsByCategory,
} from '../../../api/questions/index'
import AddQuestionDialog from './AddQuestionDialog'
import RouterBreadcrumbs from './Breadcrumbs'
import QuestionList from './QuestionList'
import { useQuery } from '@tanstack/react-query'
import { default as useQ } from './useQuery'

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

  const memoizedCategoriesCallback = useCallback(
    () => listCategoriesByFormDefinitionID(formDefinitionID),
    // [TODO] add sorting by index of categories and change to SQL api
    [formDefinitionID]
  )
  const {
    data: categories,
    error: errorCategories,
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ['memoizedCategoriesCallback'],
    queryFn: memoizedCategoriesCallback,
  })

  const memoizedQuestionsCallback = useCallback(
    () =>
      getQuestionsByCategory(id).then((response) =>
        response.data?.sort((qA, qB) => qB.index - qA.index)
      ),
    [id]
  )
  const {
    data: questions,
    error: errorQuestions,
    isLoading: loadingQuestions,
  } = useQuery({
    queryKey: ['memoizedQuestionsCallback'],
    queryFn: memoizedQuestionsCallback,
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
    const questionInfo: QuestionInput = {
      text: description,
      topic: topic,
      index: questions ? questions.length + 1 : 0,
      type: questionType,
      scale_start: null, // [TODO] add scale
      scale_middle: null,
      scale_end: null,
      category_id: id,
    }
    await createQuestion(questionInfo)
    setShowAddQuestionDialog(false)
  }

  // [TODO]
  const query = useQ()
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
                questions={questions ? questions : []}
                formDefinitionID={formDefinitionID}
                formDefinitionLabel={formDefinitionLabel}
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
