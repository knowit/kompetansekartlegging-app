import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Button from '../../mui/Button'
import TableRow from '../../mui/TableRow'
import { getAttribute } from '../helpers'
import PictureAndNameEditCell from '../PictureAndNameEditCell'
import GroupMembers from './GroupMembers'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  editIcon: {},
})

export const Group = ({
  addMembersToGroup,
  deleteMember,
  group,
  deleteGroup,
  editGroup,
  users,
  open,
  setOpenId,
  showLastAnsweredAt,
}: any) => {
  const hasGroupLeader = !!group.groupLeader
  const name = hasGroupLeader
    ? getAttribute(group.groupLeader, 'name')
    : 'Gruppeleder fjernet'
  const picture = hasGroupLeader
    ? getAttribute(group.groupLeader, 'picture')
    : undefined
  const classes = useRowStyles()

  return (
    <>
      <TableRow className={classes.root} selected={open}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpenId(group.id)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <PictureAndNameEditCell
            name={name}
            picture={picture}
            onEdit={() => editGroup(group)}
          />
        </TableCell>
        <TableCell>{group.members.length}</TableCell>
        <TableCell align="right">
          <Button endIcon={<DeleteIcon />} onClick={() => deleteGroup(group)}>
            Fjern gruppe
          </Button>
        </TableCell>
      </TableRow>
      <TableRow selected={open}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom>
                Medlemmer
              </Typography>
              <GroupMembers
                allUsers={users}
                members={group.members}
                addMembersToGroup={(users: any) =>
                  addMembersToGroup(users, group.id)
                }
                deleteMember={(user: any) => deleteMember(user, group.id)}
                showLastAnsweredAt={showLastAnsweredAt}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
