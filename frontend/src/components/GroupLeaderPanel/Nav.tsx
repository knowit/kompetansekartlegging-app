import { FormControl } from '@mui/material'
import { Select } from '@mui/material'
import { MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'

const Nav = ({ categories, category, setCategory, name }: any) => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{name}</h1>
      <FormControl>
        <Select
          value={category}
          onChange={(e: any) => setCategory(e.target.value)}
        >
          <MenuItem value="Oversikt">{t('menu.overview')}</MenuItem>
          {categories.map((c: any) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default Nav
