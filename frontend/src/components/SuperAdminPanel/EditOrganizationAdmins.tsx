import { useState } from 'react'
import CenteredCircularProgress from '../CenteredCircularProgress'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useTranslation } from 'react-i18next'
import AddUserToGroupDialog from '../AdminPanel/AddUserToGroupDialog'
import {
  addUserToGroup,
  listAllOrganizationAdministrators,
  listAllUsers,
  removeUserFromGroup,
} from '../AdminPanel/adminApi'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import useApiGet from '../AdminPanel/useApiGet'
import { Button } from '@mui/material'
import AdminTable from '../AdminPanel/AdminTable'
import InfoCard from '../InfoCard'
import { getOrganizationAdminGroupNameFromUser } from '../AdminPanel/helpers'

const EditOrganizationAdmins = () => {
  const { t } = useTranslation()

  const {
    result: admins,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listAllOrganizationAdministrators,
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
    await removeUserFromGroup(
      getOrganizationAdminGroupNameFromUser(adminToDelete),
      adminToDelete.Username
    )
    setShowDeleteUserFromGroupDialog(false)
    refresh()
  }
  const clearSelectedAdmin = () => setAdminToDelete(null)
  const hideShowAddAdmin = () => setShowAddAdmin(false)
  const addAdminConfirm = async (newAdminUser: any) => {
    await addUserToGroup(
      getOrganizationAdminGroupNameFromUser(newAdminUser),
      newAdminUser.Username
    )
    setShowAddAdmin(false)
    refresh()
  }

  return (
    <>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CenteredCircularProgress />}
      {!error && !loading && admins && (
        <>
          <InfoCard
            title="menu.submenu.editAdministrators"
            description="superAdmin.editOrganizationAdministrators.description"
          />
          <AdminTable admins={admins} deleteAdmin={deleteAdmin} showOrgId />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
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
        showOrgId
      />
      {showAddAdmin && (
        <AddUserToGroupDialog
          open={showAddAdmin}
          currentUsersInGroup={admins}
          userGetFn={listAllUsers}
          onCancel={hideShowAddAdmin}
          onConfirm={addAdminConfirm}
          roleName={t('administrator').toLowerCase()}
          searchFieldPlaceholder={t('searchForEmployeeAcrossOrganizations')}
          showOrgId
        />
      )}
    </>
  )
}

export default EditOrganizationAdmins
