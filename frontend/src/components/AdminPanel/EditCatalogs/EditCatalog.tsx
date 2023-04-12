import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import { Auth } from 'aws-amplify'
import { useTranslation } from 'react-i18next'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../../constants'
import Button from '../../mui/Button'
import { createCategory, listCategoriesByFormDefinitionID } from '../catalogApi'
import { compareByIndex } from '../helpers'
import useApiGet from '../useApiGet'
import AddCategoryDialog from './AddCategoryDialog'
import RouterBreadcrumbs from './Breadcrumbs'
import CategoryList from './CategoryList'
import useQuery from './useQuery'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      marginLeft: '0 !important',
      display: 'flex',
      flexWrap: 'wrap',
    },
    categoryList: {
      marginLeft: '0',
      marginRight: '0',
    },
    floatingMenu: {
      padding: '8px 0 0 48px',
      width: '250px',
    },
    addCategoryButton: {
      borderRadius: '30px',
      width: '20ch',
      marginTop: 0,
    },
  })
)

const EditCatalog = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState<any | null>(null)

  if (!user) {
    Auth.currentAuthenticatedUser().then(setUser)
  }

  const classes = useStyles()
  const { id: formDefinitionID } = useParams<Record<string, string>>()
  const query = useQuery()
  const label = query.get('label')
  const breadCrumbs = {
    [`/edit/${formDefinitionID}`]: label,
  }
  const breadCrumbsUrlOverrides = {
    '/edit': `/edit/${formDefinitionID}?label=${label}`,
  }

  const memoizedCallback = useCallback(
    () => listCategoriesByFormDefinitionID(formDefinitionID),
    [formDefinitionID]
  )
  const {
    result: categories,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: memoizedCallback,
    cmpFn: compareByIndex,
  })

  const [showAddCategoryDialog, setShowAddCategoryDialog] =
    useState<boolean>(false)
  const addCategoryConfirm = async (name: string, description: string) => {
    await createCategory(
      name,
      description,
      categories.length + 1,
      formDefinitionID,
      user ? user.attributes[ORGANIZATION_ID_ATTRIBUTE] : ''
    )
    setShowAddCategoryDialog(false)
    refresh()
  }

  return (
    <>
      <Container maxWidth="lg" className={classes.container}>
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
            <Container fixed maxWidth="sm" className={classes.categoryList}>
              <CategoryList
                categories={categories}
                refresh={refresh}
                formDefinitionID={formDefinitionID}
                formDefinitionLabel={label}
              />
            </Container>
            <div className={classes.floatingMenu}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={classes.addCategoryButton}
                onClick={() => setShowAddCategoryDialog(true)}
              >
                {t('admin.editCatalogs.addNewCategory')}
              </Button>
            </div>
            {showAddCategoryDialog && (
              <AddCategoryDialog
                open={showAddCategoryDialog}
                onCancel={() => setShowAddCategoryDialog(false)}
                onConfirm={addCategoryConfirm}
              />
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default EditCatalog
