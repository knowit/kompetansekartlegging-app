import { createStyles, withStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Table from '@mui/material/Table'

const StyledTable = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderCollapse: 'collapse',
      borderStyle: 'hidden',
      '& th': {
        fontWeight: 'bold',
      },
      '& td, & th': {
        border: `1px solid ${theme.palette.divider}`,
      },
    },
    stickyHeader: {
      '& th': {
        backgroundClip: 'padding-box',
      },
    },
  })
)(Table)

export default StyledTable
