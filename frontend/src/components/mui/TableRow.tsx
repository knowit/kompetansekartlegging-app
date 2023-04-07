import { createStyles, withStyles } from '@material-ui/core/styles'
import TableRow from '@material-ui/core/TableRow'
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
