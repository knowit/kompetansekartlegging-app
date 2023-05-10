import { useState } from 'react'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { useTranslation } from 'react-i18next'
import { SUPER_ADMIN_COGNITO_GROUP } from '../../constants'
import AddUserToGroupDialog from '../AdminPanel/AddUserToGroupDialog'
import AdminTable from '../AdminPanel/AdminTable'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import {
  addUserToGroup,
  listAllUsers,
  listSuperAdmins,
  removeUserFromGroup,
} from '../AdminPanel/adminApi'
import commonStyles from '../AdminPanel/common.module.css'
import useApiGet from '../AdminPanel/useApiGet'
import Button from '../mui/Button'

const EditSuperAdmins = () => {
  const { t } = useTranslation()

  const {
    result: admins,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listSuperAdmins,
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
    await removeUserFromGroup(SUPER_ADMIN_COGNITO_GROUP, adminToDelete.Username)
    setShowDeleteUserFromGroupDialog(false)
    refresh()
  }
  const clearSelectedAdmin = () => setAdminToDelete(null)
  const hideShowAddAdmin = () => setShowAddAdmin(false)
  const addAdminConfirm = async (newAdminUser: any) => {
    await addUserToGroup(SUPER_ADMIN_COGNITO_GROUP, newAdminUser.Username)
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
                {t('menu.submenu.editSuperAdministrators')}
              </Typography>
              {t('superAdmin.editSuperAdministrators.description')}
            </CardContent>
          </Card>
          <AdminTable
            admins={admins}
            deleteAdmin={deleteAdmin}
            showOrgId={true}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            style={{ marginTop: '24px' }}
            onClick={() => setShowAddAdmin(true)}
          >
            {t('superAdmin.editSuperAdministrators.addSuperAdministrator')}
          </Button>
        </>
      )}
      <DeleteUserFromGroupDialog
        open={showDeleteUserFromGroupDialog}
        onCancel={() => setShowDeleteUserFromGroupDialog(false)}
        onExited={clearSelectedAdmin}
        onConfirm={deleteAdminConfirm}
        user={adminToDelete}
        roleName={t(
          'superAdmin.editSuperAdministrators.superAdministrator'
        ).toLowerCase()}
        showOrgId
      />
      {showAddAdmin && (
        <AddUserToGroupDialog
          open={showAddAdmin}
          currentUsersInGroup={admins}
          userGetFn={listAllUsers}
          onCancel={hideShowAddAdmin}
          onConfirm={addAdminConfirm}
          roleName={t(
            'superAdmin.editSuperAdministrators.superAdministrator'
          ).toLowerCase()}
          searchFieldPlaceholder={t('searchForEmployeeAcrossOrganizations')}
        />
      )}
    </Container>
  )
}

export default EditSuperAdmins
