import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Container, CircularProgress, Box } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { listCategoriesByFormDefinitionID, createCategory } from '../catalogApi'
import useApiGet from '../useApiGet'
import { compareByIndex } from '../helpers'
import CategoryList from './CategoryList'
import RouterBreadcrumbs from './Breadcrumbs'
import useQuery from './useQuery'
import AddCategoryDialog from './AddCategoryDialog'
import { Button } from '@mui/material'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../../constants'
import { Auth } from 'aws-amplify'
import { useTranslation } from 'react-i18next'

const EditCatalog = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState<any | null>(null)

  if (!user) {
    Auth.currentAuthenticatedUser().then(setUser)
  }

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
              <CategoryList
                categories={categories}
                refresh={refresh}
                formDefinitionID={formDefinitionID}
                formDefinitionLabel={label}
              />
            </>
            <div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
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
      </>
    </>
  )
}

export default EditCatalog
