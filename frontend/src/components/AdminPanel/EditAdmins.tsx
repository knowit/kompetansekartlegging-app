import { useState } from 'react'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import { selectAdminCognitoGroupName, selectUserState } from '../../redux/User'
import { useAppSelector } from '../../redux/hooks'
import Button from '../mui/Button'
import AddUserToGroupDialog from './AddUserToGroupDialog'
import AdminTable from './AdminTable'
import DeleteUserFromGroupDialog from './DeleteUserFromGroupDialog'
import {
  addUserToGroup,
  listAllUsersInOrganization,
  removeUserFromGroup,
} from './adminApi'
import commonStyles from './common.module.css'
import useApiGet from './useApiGet'

const EditAdmins = () => {
  const { t } = useTranslation()
  const adminCognitoGroupName = useAppSelector(selectAdminCognitoGroupName)
  const userState = useAppSelector(selectUserState)

  const {
    result: admins,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listAllUsersInOrganization,
    params: adminCognitoGroupName,
  })
  const [showAddAdmin, setShowAddAdmin] = useState<boolean>(false)

  const [showDeleteUserFromGroupDialog, setShowDeleteUserFromGroupDialog] =
    useState<boolean>(false)
  const [adminToDelete, setAdminToDelete] = useState<any>()

  const deleteAdmin = (user: any) => {
    setShowDeleteUserFromGroupDialog(true)
    setAdminToDelete(user)
  }
  const deleteAdminConfirm = async () => {
    await removeUserFromGroup(adminCognitoGroupName, adminToDelete.Username)
    setShowDeleteUserFromGroupDialog(false)
    refresh()
  }
  const clearSelectedAdmin = () => setAdminToDelete(null)
  const hideShowAddAdmin = () => setShowAddAdmin(false)
  const addAdminConfirm = async (newAdminUser: any) => {
    await addUserToGroup(adminCognitoGroupName, newAdminUser.Username)
    setShowAddAdmin(false)
    refresh()
  }

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && admins && (
        <>
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('admin.editAdmins.editAdministrators')}
              </Typography>
              {t('admin.editAdmins.description')}
            </CardContent>
          </Card>
          <AdminTable admins={admins} deleteAdmin={deleteAdmin} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            style={{ marginTop: '24px' }}
            onClick={() => setShowAddAdmin(true)}
          >
            {t('addAdministrator')}
          </Button>
        </>
      )}
      <DeleteUserFromGroupDialog
        open={showDeleteUserFromGroupDialog}
        onCancel={() => setShowDeleteUserFromGroupDialog(false)}
        onExited={clearSelectedAdmin}
        onConfirm={deleteAdminConfirm}
        user={adminToDelete}
        roleName={t('administrator').toLowerCase()}
      />
      {showAddAdmin && (
        <AddUserToGroupDialog
          open={showAddAdmin}
          currentUsersInGroup={admins}
          userGetFn={listAllUsersInOrganization}
          userGetFnParams={
            userState.isSignedIn ? userState.organizationID : null
          }
          onCancel={hideShowAddAdmin}
          onConfirm={addAdminConfirm}
          roleName={t('administrator').toLowerCase()}
          searchFieldPlaceholder={t('searchForEmployeeInOrganization', {
            organization: userState.organizationName,
          })}
        />
      )}
    </Container>
  )
}

export default EditAdmins
