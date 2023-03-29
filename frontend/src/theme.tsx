import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@mui/material/styles'
import { KnowitColors } from './styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: KnowitColors.lightGreen,
    },
    secondary: {
      main: KnowitColors.fuchsia,
    },
  },
})

export default theme
