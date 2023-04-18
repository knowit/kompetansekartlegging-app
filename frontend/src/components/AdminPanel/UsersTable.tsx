import commonStyles from './common.module.css'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'

import { getAttribute } from './helpers'
import { Table } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import PictureAndNameCell from './PictureAndNameCell'
import { useTranslation } from 'react-i18next'

const User = ({ user, selected, setSelectedUser }: any) => {
  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')

  return (
    <>
      <TableRow hover selected={selected} onClick={() => setSelectedUser(user)}>
        <TableCell>
          <PictureAndNameCell name={name} picture={picture} />
        </TableCell>
        <TableCell>{email}</TableCell>
      </TableRow>
    </>
  )
}

const UsersTable = ({ users, selectedUser, setSelectedUser }: any) => {
  const { t } = useTranslation()
  const isSelected = (user: any) =>
    selectedUser && user.Username === selectedUser.Username

  return (
    <TableContainer
      component={Paper}
      className={commonStyles.usersTableContainer}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('email')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u: any) => (
            <User
              key={u.Username}
              user={u}
              selected={isSelected(u)}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UsersTable
