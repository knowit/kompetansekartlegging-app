import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CategoriesSelect = ({ categories, categoryID, setCategoryID }: any) => {
  const { t } = useTranslation()

  return (
    <FormControl variant="outlined">
      <InputLabel>{t('admin.editCatalogs.category')}</InputLabel>
      <Select
        label={t('admin.editCatalogs.category')}
        value={categoryID}
        onChange={(e) => setCategoryID(e.target.value)}
      >
        {categories.map((c: any) => (
          <MenuItem key={c.id} value={c.id}>
            {c.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default CategoriesSelect
