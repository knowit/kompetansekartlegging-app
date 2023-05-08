import { useState } from 'react'
import CenteredCircularProgress from '../CenteredCircularProgress'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useTranslation } from 'react-i18next'
import AddUserToGroupDialog from '../AdminPanel/AddUserToGroupDialog'
import {
  addUserToGroup,
  listSuperAdmins,
  listAllUsers,
  removeUserFromGroup,
} from '../AdminPanel/adminApi'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import useApiGet from '../AdminPanel/useApiGet'
import { Button } from '@mui/material'
import AdminTable from '../AdminPanel/AdminTable'
import InfoCard from '../InfoCard'

import { SUPER_ADMIN_COGNITO_GROUP } from '../../constants'

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
    <div>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CenteredCircularProgress />}
      {!error && !loading && admins && (
        <>
          <InfoCard
            title="menu.submenu.editSuperAdministrators"
            description="superAdmin.editSuperAdministrators.description"
          />
          <AdminTable
            admins={admins}
            deleteAdmin={deleteAdmin}
            showOrgId={true}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
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
    </div>
  )
}

export default EditSuperAdmins
