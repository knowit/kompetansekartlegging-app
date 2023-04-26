import {
  Box,
  Button,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { useTranslation } from 'react-i18next'
import GroupMembers from '../../GroupMembers'
import PictureAndNameEditCell from '../../PictureAndNameEditCell'
import { getAttribute } from '../../helpers'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  editIcon: {},
})

/**
 * TODO: Remove this comment
 * Previously called Group in `EditGroups.tsx`
 */
export const GroupsOverviewRow = ({
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
  const { t } = useTranslation()

  const hasGroupLeader = !!group.groupLeader
  const name = hasGroupLeader
    ? getAttribute(group.groupLeader, 'name')
    : t('admin.editGroups.groupLeaderRemoved')
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
            {t('admin.editGroups.removeGroup')}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow selected={open}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom>
                {t('admin.editGroups.members')}
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
