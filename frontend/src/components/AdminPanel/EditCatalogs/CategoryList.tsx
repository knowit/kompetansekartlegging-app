import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import List from '@mui/material/List'

import { Category } from '../../../API'
import {
  deleteCategory as deleteCategoryApi,
  listQuestionsByCategoryID,
  updateCategoryIndex,
  updateCategoryTextAndDescription,
} from '../catalogApi'
import CategoryListItem from './CategoryListItem'
import DeleteCategoryDialog from './DeleteCategoryDialog'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { KnowitColors } from '../../../styleconstants'

const StyledCategoryList = styled.div`
  .categoryCard {
    margin: 2px;
    background: ${KnowitColors.beige};
  }
`

const CategoryList = ({
  categories,
  refresh,
  formDefinitionID,
  formDefinitionLabel,
}: any) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [enableUpdates, setEnableUpdates] = useState<boolean>(true)

  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] =
    useState<boolean>(false)
  const [categoryToDelete, setCategoryToDelete] = useState<any>()
  const [
    categoryToDeleteContainsQuestions,
    setCategoryToDeleteContainsQuestions,
  ] = useState<boolean>()

  const deleteCategory = async (category: any) => {
    const categoryContainsQuestions = await listQuestionsByCategoryID(
      category.id
    ).then((response: any) => {
      return response.result.length > 0
    })
    setCategoryToDeleteContainsQuestions(categoryContainsQuestions)
    setShowDeleteCategoryDialog(true)
    setCategoryToDelete(category)
  }
  const deleteCategoryConfirm = async () => {
    await deleteCategoryApi(categoryToDelete.id)
    setShowDeleteCategoryDialog(false)
    refresh()
  }

  const moveCategory = async (category: any, direction: number) => {
    setEnableUpdates(false)

    const me = category
    const swapWith = categories.find(
      (c: any) => c.index === me.index - direction
    )
    await updateCategoryIndex(me, swapWith.index)
    await updateCategoryIndex(swapWith, me.index)

    setEnableUpdates(true)
    refresh()
  }

  const saveCategory = async (
    category: any,
    text: string,
    description: string
  ) => {
    await updateCategoryTextAndDescription(category, text, description)
    refresh()
  }

  return (
    <StyledCategoryList>
      {categories.length === 0 && (
        <p>{t('admin.editCatalogs.noCategoriesInThisCatalogYet')}</p>
      )}
      <List>
        {categories.map((c: Category, ind: number) => {
          const editPathName = `/edit/${formDefinitionID}/${c.id}`
          const editSearch = `?formDefinitionLabel=${formDefinitionLabel}&label=${c.text}`

          return (
            <CategoryListItem
              key={c.id}
              onClick={() => history.push(`${editPathName}${editSearch}`)}
              category={c}
              index={ind}
              moveCategory={moveCategory}
              saveCategory={saveCategory}
              deleteCategory={deleteCategory}
              enableUpdates={enableUpdates}
              categories={categories}
            />
          )
        })}
      </List>
      {categoryToDelete && (
        <DeleteCategoryDialog
          open={showDeleteCategoryDialog}
          onCancel={() => setShowDeleteCategoryDialog(false)}
          onExited={() => setCategoryToDelete(null)}
          onConfirm={deleteCategoryConfirm}
          category={categoryToDelete}
          categoryContainsQuestions={categoryToDeleteContainsQuestions}
        />
      )}
    </StyledCategoryList>
  )
}

export default CategoryList
