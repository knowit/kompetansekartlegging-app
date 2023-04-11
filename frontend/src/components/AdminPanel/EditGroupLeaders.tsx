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
import {
  selectGroupLeaderCognitoGroupName,
  selectUserState,
} from '../../redux/User'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import { Table } from '@mui/material'
import AddUserToGroupDialog from './AddUserToGroupDialog'
import {
  addUserToGroup,
  listAllUsersInOrganization,
  listGroupLeadersInOrganization,
  removeUserFromGroup,
} from './adminApi'
import commonStyles from './common.module.css'
import DeleteUserFromGroupDialog from './DeleteUserFromGroupDialog'
import { getAttribute } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'
import useApiGet from './useApiGet'
import InfoCard from '../InfoCard'

const GroupLeader = (props: any) => {
  const { groupLeader, deleteGroupLeader } = props
  const username = groupLeader.Username
  const name = getAttribute(groupLeader, 'name')
  const email = getAttribute(groupLeader, 'email')
  const picture = getAttribute(groupLeader, 'picture')

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
            onClick={() => deleteGroupLeader(groupLeader)}
            size="large"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

const GroupLeaderTable = ({ groupLeaders, deleteGroupLeader }: any) => {
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
          {groupLeaders.map((gl: any) => (
            <GroupLeader
              key={gl.Username}
              groupLeader={gl}
              deleteGroupLeader={deleteGroupLeader}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const EditGroupLeaders = () => {
  const { t } = useTranslation()

  const groupLeaderCognitoGroupName = useAppSelector(
    selectGroupLeaderCognitoGroupName
  )
  const userState = useAppSelector(selectUserState)

  const {
    result: groupLeaders,
    error,
    loading,
    refresh,
  } = useApiGet({
    getFn: listGroupLeadersInOrganization,
    params: userState.organizationID,
  })
  const [showAddGroupLeader, setShowAddGroupLeader] = useState<boolean>(false)
  const [groupLeaderToDelete, setGroupLeaderToDelete] = useState<any>()

  const [showDeleteUserFromGroupDialog, setShowDeleteUserFromGroupDialog] =
    useState<boolean>(false)
  const deleteGroupLeader = (user: any) => {
    setGroupLeaderToDelete(user)
    setShowDeleteUserFromGroupDialog(true)
  }
  const deleteGroupLeaderConfirm = async () => {
    await removeUserFromGroup(
      groupLeaderCognitoGroupName,
      groupLeaderToDelete.Username
    )
    setShowDeleteUserFromGroupDialog(false)
    refresh()
  }
  const clearSelectedGroupLeader = () => setGroupLeaderToDelete(null)
  const hideShowAddGroupLeader = () => setShowAddGroupLeader(false)
  const addGroupLeaderConfirm = async (newGroupLeaderUser: any) => {
    await addUserToGroup(
      groupLeaderCognitoGroupName,
      newGroupLeaderUser.Username
    )
    setShowAddGroupLeader(false)
    refresh()
  }

  return (
    <>
      {error && <p>{t('errorOccured') + error}</p>}
      {loading && <CircularProgress />}
      {!error && !loading && groupLeaders && (
        <>
          <InfoCard
            title="menu.submenu.editGroupLeaders"
            description="admin.editGroupLeaders.description"
          />

          <GroupLeaderTable
            groupLeaders={groupLeaders}
            deleteGroupLeader={deleteGroupLeader}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowAddGroupLeader(true)}
          >
            {t('admin.editGroupLeaders.addGroupLeader')}
          </Button>
        </>
      )}
      <DeleteUserFromGroupDialog
        open={showDeleteUserFromGroupDialog}
        onCancel={() => setShowDeleteUserFromGroupDialog(false)}
        onExited={clearSelectedGroupLeader}
        onConfirm={deleteGroupLeaderConfirm}
        user={groupLeaderToDelete}
        roleName={t('groupLeader').toLowerCase()}
      >
        {t('admin.editGroupLeaders.rememberToReplaceGroupLeader')}
      </DeleteUserFromGroupDialog>
      {showAddGroupLeader && (
        <AddUserToGroupDialog
          userGetFn={listAllUsersInOrganization}
          roleName={t('groupLeader').toLowerCase()}
          open={showAddGroupLeader}
          currentUsersInGroup={groupLeaders}
          onCancel={hideShowAddGroupLeader}
          onConfirm={addGroupLeaderConfirm}
        />
      )}
    </>
  )
}

export default EditGroupLeaders
