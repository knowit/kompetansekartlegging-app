import { createStyles, withStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import { KnowitColors } from '../../styles'

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: '100ms',
    },
    selected: {
      backgroundColor: `${KnowitColors.beige} !important`,
    },
  })
)(TableRow)

export default StyledTableRow
