import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  adaptV4Theme,
} from '@mui/material/styles'
import { KnowitColors } from './styles'

const theme = createMuiTheme(adaptV4Theme({}))

export default theme
