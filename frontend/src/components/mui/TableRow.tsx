import { createStyles, withStyles } from '@mui/styles'
import TableRow from '@mui/material/TableRow'
import { KnowitColors } from '../../styles'

const StyledTableRow = withStyles(() =>
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
