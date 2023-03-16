import { useState } from 'react'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import Button from '../mui/Button'
import Table from '../mui/Table'
import TableRow from '../mui/TableRow'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../../i18n/i18n'
import AddMemberToGroupDialog from './AddMemberToGroupDialog'
import { getAttribute } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'

const User = ({ user, deleteMember, viewMember, showLastAnsweredAt }: any) => {
  const { t } = useTranslation()

  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')
  const formLastAnsweredAt =
    user.lastAnsweredAt == null
      ? t('notAnswered')
      : i18nDateToLocaleDateString(user.lastAnsweredAt)

  const onClick = () => {
    if (viewMember) viewMember(user.Username)
  }

  return (
    <TableRow hover style={{ cursor: viewMember ? 'pointer' : 'default' }}>
      <TableCell onClick={onClick}>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell onClick={onClick}>{email}</TableCell>
      {showLastAnsweredAt && <TableCell>{formLastAnsweredAt}</TableCell>}
      <TableCell>
        <Button
          onClick={() => deleteMember(user)}
          style={{ fontStyle: 'italic' }}
        >
          {t('myGroup.removeFromGroup')}
        </Button>
      </TableCell>
    </TableRow>
  )
}

const GroupMembers = ({
  allUsers,
  members,
  addMembersToGroup,
  deleteMember,
  viewMember,
  showLastAnsweredAt,
}: any) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState<boolean>(false)
  const onConfirm = (users: any[]) => {
    addMembersToGroup(users)
    setOpen(false)
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('employee')}</TableCell>
              <TableCell>{t('email')}</TableCell>
              {showLastAnsweredAt && (
                <TableCell>{t('myGroup.lastAnswered')}</TableCell>
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((u: any) => (
              <User
                key={u.Username}
                user={u}
                deleteMember={deleteMember}
                viewMember={viewMember}
                showLastAnsweredAt={showLastAnsweredAt}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddIcon />}
        onClick={() => setOpen(true)}
      >
        {t('myGroup.addMembers')}
      </Button>
      <AddMemberToGroupDialog
        open={open}
        onCancel={() => setOpen(false)}
        allUsers={allUsers}
        members={members}
        onConfirm={onConfirm}
      />
    </>
  )
}

export default GroupMembers
