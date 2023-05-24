import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Button from '../mui/Button'
import Table from '../mui/Table'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listAllUsersInOrganization } from './adminApi'
import useApiGet from './useApiGet'
import commonStyles from './common.module.css'
import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'
import PictureAndNameCell from './PictureAndNameCell'
import { getAttribute } from './helpers'
import AnonymizeUserDialog from './AnonymizeUserDialog'
import { anonymizeUser as anonymizeUserApiCall } from './adminApi'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../constants'

type UserProps = {
  user: any
  anonymizeUser: (user: any) => void
}

const User = ({ user, anonymizeUser }: UserProps) => {
  const { t } = useTranslation()

  const username = user.Username
  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')

  return (
    <TableRow>
      <TableCell>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => anonymizeUser(user)}
          style={{ margin: '0 auto' }}
        >
          {t('admin.anonymizeUsers.anonymize')}
        </Button>
      </TableCell>
    </TableRow>
  )
}

type AnonymizeUsersTableProps = {
  users: any[]
  anonymizeUser: (user: any) => void
}

const AnonymizeUsersTable = ({
  users,
  anonymizeUser,
}: AnonymizeUsersTableProps) => {
  const { t } = useTranslation()
  const userState = useAppSelector(selectUserState)

  return (
    <TableContainer className={commonStyles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('email')}</TableCell>
            <TableCell>{t('username')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(
            (user: any) =>
              user.Username != userState.userName && (
                <User
                  key={user.Username}
                  user={user}
                  anonymizeUser={anonymizeUser}
                />
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const AnonymizeUsers = () => {
  const { t } = useTranslation()
  const userState = useAppSelector(selectUserState)

  const {
    result: users,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listAllUsersInOrganization,
    params: userState.organizationID,
  })

  const [userToAnonymize, setUserToAnonymize] = useState<any>()
  const [showAnonymizeUserDialog, setShowAnonymizeUserDialog] =
    useState<boolean>(false)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const anonymizeUser = (user: any) => {
    setMutationError(null)
    setShowAnonymizeUserDialog(true)
    setUserToAnonymize(user)
  }

  const anonymizeUserConfirm = async () => {
    const username = userToAnonymize.Username
    const orgId = getAttribute(userToAnonymize, ORGANIZATION_ID_ATTRIBUTE)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await anonymizeUserApiCall(username, orgId!)
      .then(() => {
        setMutationError(null)
        setShowAnonymizeUserDialog(false)
        refresh()
      })
      .catch(() => {
        setShowAnonymizeUserDialog(false)
        setMutationError(
          t('adminApi.error.couldNotAnonymizeName', {
            name: userToAnonymize.Username,
          })
        )
      })
  }

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {error && <p>{t('errorOccured') + error}</p>}
      {mutationError && <p>{t('errorOccured') + mutationError}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && users && (
        <>
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('menu.submenu.anonymizeUsers')}
              </Typography>
              {t('admin.anonymizeUsers.description')}
            </CardContent>
          </Card>
          <AnonymizeUsersTable users={users} anonymizeUser={anonymizeUser} />
        </>
      )}
      <AnonymizeUserDialog
        open={showAnonymizeUserDialog}
        onCancel={() => setShowAnonymizeUserDialog(false)}
        onExited={() => setUserToAnonymize(null)}
        onConfirm={anonymizeUserConfirm}
        user={userToAnonymize}
      />
    </Container>
  )
}

export default AnonymizeUsers
