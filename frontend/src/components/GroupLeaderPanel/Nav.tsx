import { createStyles, makeStyles, withStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { KnowitColors } from '../../styles'
import { useTranslation } from 'react-i18next'

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: '20px',
      position: 'relative',
      backgroundColor: KnowitColors.beige,
      border: '1px solid #ced4da',
      fontSize: 16,
      fontWeight: 'bold',
      padding: '10px 50px 10px 22px !important',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
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
        borderRadius: '20px',
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase)

const useNavStyles = makeStyles((theme) => ({
  container: {
    marginLeft: '30px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    maxWidth: '1200px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  name: {
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '23px',
    marginRight: '23px',
  },
}))

const Nav = ({ categories, category, setCategory, name }: any) => {
  const { t } = useTranslation()
  const classes = useNavStyles()

  return (
    <div className={classes.container}>
      <h3 className={classes.name}>{name}</h3>
      <FormControl className={classes.formControl}>
        <Select
          value={category}
          onChange={(e: any) => setCategory(e.target.value)}
          input={<BootstrapInput />}
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
