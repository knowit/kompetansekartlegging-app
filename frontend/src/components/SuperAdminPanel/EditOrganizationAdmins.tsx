import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAppSelector } from '../../redux/hooks'
import { selectAdminCognitoGroupName } from '../../redux/User'
import { useTranslation } from 'react-i18next'
import AddUserToGroupDialog from '../AdminPanel/AddUserToGroupDialog'
import {
  addUserToGroup,
  listAllUsersInOrganization,
  removeUserFromGroup,
} from '../AdminPanel/adminApi'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import useApiGet from '../AdminPanel/useApiGet'
import { Button } from '@mui/material'
import AdminTable from '../AdminPanel/AdminTable'
import InfoCard from '../InfoCard'

const EditOrganizationAdmins = () => {
  const { t } = useTranslation()
  const adminCognitoGroupName = useAppSelector(selectAdminCognitoGroupName)

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
    <>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && admins && (
        <>
          <InfoCard
            title="menu.submenu.editOrganizationAdministrators"
            description="superAdmin.editOrganizationAdministrators.description"
          />
          <AdminTable admins={admins} deleteAdmin={deleteAdmin} />
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
      />
      {showAddAdmin && (
        <AddUserToGroupDialog
          open={showAddAdmin}
          currentUsersInGroup={admins}
          userGetFn={listAllUsersInOrganization}
          onCancel={hideShowAddAdmin}
          onConfirm={addAdminConfirm}
          roleName={t('administrator').toLowerCase()}
        />
      )}
    </>
  )
}

export default EditOrganizationAdmins
