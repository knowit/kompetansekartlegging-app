import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
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
import commonStyles from '../AdminPanel/common.module.css'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import { getAttribute } from '../AdminPanel/helpers'
import PictureAndNameCell from '../AdminPanel/PictureAndNameCell'
import useApiGet from '../AdminPanel/useApiGet'
import { Button } from '@mui/material'
import { Table } from '@mui/material'

const Admin = (props: any) => {
  const { admin, deleteAdmin } = props
  const username = admin.Username
  const name = getAttribute(admin, 'name')
  const email = getAttribute(admin, 'email')
  const picture = getAttribute(admin, 'picture')

  return (
    <>
      <TableRow>
        <TableCell>
          <PictureAndNameCell name={name} picture={picture} />
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{username}</TableCell>
        <TableCell>
          <IconButton
            edge="end"
            onClick={() => deleteAdmin(admin)}
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

const AdminTable = ({ admins, deleteAdmin }: any) => {
  const { t } = useTranslation()

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
          {admins.map((gl: any) => (
            <Admin key={gl.Username} admin={gl} deleteAdmin={deleteAdmin} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

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
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              {t('menu.submenu.editOrganizationAdministrators')}

              {t('superAdmin.editOrganizationAdministrators.description')}
            </CardContent>
          </Card>
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
