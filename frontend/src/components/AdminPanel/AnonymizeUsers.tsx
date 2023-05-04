import {
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { listAllUsersInOrganization } from './adminApi'
import useApiGet from './useApiGet'
import commonStyles from './common.module.css'
import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'

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

  const anonymizeUser = (user: any) => {
    setShowAnonymizeUserDialog(true)
    setUserToAnonymize(user.Username)
  }

  const anonymizeUserConfirm = async () => {
    //await anonymizeUser(userToAnonymize)
    setShowAnonymizeUserDialog(false)
    refresh()
  }

  //const clearSelectedUser = () => setUserToAnonymize(null)

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {error && <p>{t('errorOccured') + error}</p>}
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
        </>
      )}
    </Container>
  )
}

export default AnonymizeUsers
