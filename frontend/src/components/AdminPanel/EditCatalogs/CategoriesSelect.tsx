import FormControl from '@mui/material/FormControl'
import InputBase from '@mui/material/InputBase'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Theme } from '@mui/material/styles'
import { createStyles, makeStyles, withStyles } from '@mui/styles'

import { useTranslation } from 'react-i18next'
import { KnowitColors } from '../../../styles'

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '& svg': {
        color: KnowitColors.white,
      },
    },
    input: {
      borderRadius: '15px',
      position: 'relative',
      color: KnowitColors.white,
      border: `2px solid ${KnowitColors.flamingo}`,
      fontSize: 16,
      padding: '16px 50px 16px 10px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: '15px',
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase)

const useStyles = makeStyles(() =>
  createStyles({
    formControl: {
      margin: '0 0 16px 16px',
      minWidth: 180,
      maxWidth: 180,
    },
    label: {
      color: KnowitColors.white,
      pointerEvents: 'none',
      backgroundColor: KnowitColors.darkBrown,
      padding: '0 8px 0 4px',
    },
  })
)

const CategoriesSelect = ({ categories, categoryID, setCategoryID }: any) => {
  const { t } = useTranslation()
  const classes = useStyles()
  // const category = categories.find((c: any) => c.id === categoryID);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel className={classes.label}>
        {t('admin.editCatalogs.category')}
      </InputLabel>
      <Select
        value={categoryID}
        onChange={(e) => setCategoryID(e.target.value)}
        input={<BootstrapInput />}
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
