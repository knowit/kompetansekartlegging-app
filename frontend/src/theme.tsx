import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  adaptV4Theme,
} from '@mui/material/styles'
import { KnowitColors } from './styles'

const theme = createMuiTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: KnowitColors.lightGreen,
      },
      secondary: {
        main: KnowitColors.fuchsia,
      },
    },
  })
)

export default theme
