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
  showAnonymizeUserDialog: (user: any) => void
}

const User = ({ user, showAnonymizeUserDialog }: UserProps) => {
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
          onClick={() => showAnonymizeUserDialog(user)}
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
  showAnonymizeUserDialog: (user: any) => void
}

const AnonymizeUsersTable = ({
  users,
  showAnonymizeUserDialog,
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
                  showAnonymizeUserDialog={showAnonymizeUserDialog}
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
    error: apiError,
    loading,
    refresh,
  } = useApiGet({
    getFn: listAllUsersInOrganization,
    params: userState.organizationID,
  })

  const [userToAnonymize, setUserToAnonymize] = useState<any>()
  const [isAnonymizeUserDialogOpen, setIsAnonymizeUserDialogOpen] =
    useState<boolean>(false)
  const [anonymizationError, setAnonymizationError] = useState<string | null>(
    null
  )

  const showAnonymizeUserDialog = (user: any) => {
    setAnonymizationError(null)
    setIsAnonymizeUserDialogOpen(true)
    setUserToAnonymize(user)
  }

  const anonymizeUserConfirm = async () => {
    const username = userToAnonymize.Username
    const orgId = getAttribute(userToAnonymize, ORGANIZATION_ID_ATTRIBUTE)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await anonymizeUserApiCall(username, orgId!)
      .then(() => {
        setAnonymizationError(null)
        setIsAnonymizeUserDialogOpen(false)
        refresh()
      })
      .catch(() => {
        setIsAnonymizeUserDialogOpen(false)
        setAnonymizationError(
          t('adminApi.error.couldNotAnonymizeName', {
            name: userToAnonymize.Username,
          })
        )
      })
  }

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {apiError && <p>{t('errorOccured') + apiError}</p>}
      {anonymizationError && <p>{t('errorOccured') + anonymizationError}</p>}
      {loading && <CircularProgress />}
      {!apiError && !loading && users && (
        <>
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('menu.submenu.anonymizeUsers')}
              </Typography>
              {t('admin.anonymizeUsers.description')}
            </CardContent>
          </Card>
          <AnonymizeUsersTable
            users={users}
            showAnonymizeUserDialog={showAnonymizeUserDialog}
          />
        </>
      )}
      <AnonymizeUserDialog
        open={isAnonymizeUserDialogOpen}
        onCancel={() => setIsAnonymizeUserDialogOpen(false)}
        onExited={() => setUserToAnonymize(null)}
        onConfirm={anonymizeUserConfirm}
        user={userToAnonymize}
      />
    </Container>
  )
}

export default AnonymizeUsers
