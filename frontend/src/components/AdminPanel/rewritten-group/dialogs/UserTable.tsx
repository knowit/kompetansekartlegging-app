import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import UserTableRow from './UserTableRow'

const UsersTable = ({ users, selectedUsers, setSelectedUser }: any) => {
  const { t } = useTranslation()
  const isSelected = (user: any) =>
    selectedUsers.some((u: any) => u.Username === user.Username)

  return (
    <TableContainer component={Paper} style={{ height: '100%' }}>
      <Table stickyHeader style={{ maxHeight: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('groupLeader')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u: any) => (
            <UserTableRow
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
