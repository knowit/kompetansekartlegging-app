import { useState } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '@material-ui/core/Container'
import IconButton from '@material-ui/core/IconButton'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import { useAppSelector } from '../../redux/hooks'
import { selectAdminCognitoGroupName } from '../../redux/User'
import { useTranslation } from 'react-i18next'
import Button from '../mui/Button'
import Table from '../mui/Table'
import AddUserToGroupDialog from './AddUserToGroupDialog'
import {
  addUserToGroup,
  listAllUsersInOrganization,
  removeUserFromGroup,
} from './adminApi'
import commonStyles from './common.module.css'
import DeleteUserFromGroupDialog from './DeleteUserFromGroupDialog'
import { getAttribute } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'
import useApiGet from './useApiGet'

const Admin = (props: any) => {
  const { admin, deleteAdmin } = props
  const username = admin.Username
  const name = getAttribute(admin, 'name')
  const email = getAttribute(admin, 'email')
  const picture = getAttribute(admin, 'picture')

  return (
    <TableRow>
      <TableCell>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>
        <IconButton edge="end" onClick={() => deleteAdmin(admin)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
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

const EditAdmins = () => {
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
          onCancel={hideShowAddAdmin}
          onConfirm={addAdminConfirm}
          roleName={t('administrator').toLowerCase()}
        />
      )}
    </Container>
  )
}

export default EditAdmins
