import commonStyles from './common.module.css'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'

import { getAttribute } from './helpers'
import Table from '../mui/Table'
import TableRow from '../mui/TableRow'
import PictureAndNameCell from './PictureAndNameCell'
import { useTranslation } from 'react-i18next'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../constants'

const User = ({ user, selected, setSelectedUser, showOrgId }: any) => {
  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')
  const orgId = getAttribute(user, ORGANIZATION_ID_ATTRIBUTE)

  return (
    <>
      <TableRow hover selected={selected} onClick={() => setSelectedUser(user)}>
        <TableCell>
          <PictureAndNameCell name={name} picture={picture} />
        </TableCell>
        <TableCell>{email}</TableCell>
        {showOrgId && <TableCell>{orgId}</TableCell>}
      </TableRow>
    </>
  )
}

const UsersTable = ({
  users,
  selectedUser,
  setSelectedUser,
  showOrgId,
}: any) => {
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
            {showOrgId && <TableCell>{t('organizationID')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u: any) => (
            <User
              key={u.Username}
              user={u}
              selected={isSelected(u)}
              setSelectedUser={setSelectedUser}
              showOrgId={showOrgId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UsersTable
