import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/styles'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { useTranslation } from 'react-i18next'
import { getLatestUserFormUpdatedAtForUser } from '../../helperFunctions'
import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'
import Button from '../mui/Button'
import Table from '../mui/Table'
import TableRow from '../mui/TableRow'
import AddUserToGroupDialog from './AddUserToGroupDialog'
import {
  listAllUsersInOrganization as listAllAvailableUsersInOrganization,
  // listGroupLeaders,
  listGroupLeadersInOrganization,
} from './adminApi'
import { listAllFormDefinitionsForLoggedInUser } from './catalogApi'
import commonStyles from './common.module.css'
import DeleteGroupDialog from './DeleteGroupDialog'
import DeleteUserFromGroupDialog from './DeleteUserFromGroupDialog'
import GroupMembers from './GroupMembers'
import {
  addGroup,
  addUserToGroup,
  listAllGroups,
  listAllUsers,
  removeGroup,
  removeUserFromGroup,
  updateGroupLeader,
  updateUserGroup,
} from './groupsApi'
import { compareByCreatedAt, compareByName, getAttribute } from './helpers'
import PictureAndNameEditCell from './PictureAndNameEditCell'
import useApiGet from './useApiGet'
import { KnowitColors } from '../../styles'

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  editIcon: {},
})

const Group = ({
  addMembersToGroup,
  deleteMember,
  group,
  deleteGroup,
  editGroup,
  users,
  open,
  setOpenId,
  showLastAnsweredAt,
}: any) => {
  const { t } = useTranslation()

  const hasGroupLeader = !!group.groupLeader
  const name = hasGroupLeader
    ? getAttribute(group.groupLeader, 'name')
    : t('admin.editGroups.groupLeaderRemoved')
  const picture = hasGroupLeader
    ? getAttribute(group.groupLeader, 'picture')
    : undefined
  const classes = useRowStyles()

  return (
    <>
      <TableRow className={classes.root} selected={open}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpenId(group.id)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <PictureAndNameEditCell
            name={name}
            picture={picture}
            onEdit={() => editGroup(group)}
          />
        </TableCell>
        <TableCell>{group.members.length}</TableCell>
        <TableCell align="right">
          <Button
            endIcon={<DeleteIcon />}
            onClick={() => deleteGroup(group)}
            style={{ color: KnowitColors.black }}
          >
            {t('admin.editGroups.removeGroup')}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow selected={open}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom>
                {t('admin.editGroups.members')}
              </Typography>
              <GroupMembers
                allUsers={users}
                members={group.members}
                addMembersToGroup={(users: any) =>
                  addMembersToGroup(users, group.id)
                }
                deleteMember={(user: any) => deleteMember(user, group.id)}
                showLastAnsweredAt={showLastAnsweredAt}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const GroupsTable = ({
  groups,
  allAvailableUsersAnnotated,
  groupLeaders,
  deleteGroup,
  editGroup,
  addMembersToGroup,
  deleteMember,
  showLastAnsweredAt,
}: any) => {
  const { t } = useTranslation()

  const [openId, setOpenId] = useState<string>('')
  const setOpenGroup = (groupId: string) => {
    if (openId === groupId) {
      setOpenId('')
    } else {
      setOpenId(groupId)
    }
  }

  const groupsAnnotated = groups
    .map((g: any) => {
      const groupLeader = groupLeaders.find(
        (gl: any) => gl.Username === g.groupLeaderUsername
      )
      const members = allAvailableUsersAnnotated.filter(
        (u: any) => u.groupId === g.id
      )
      return { ...g, groupLeader, members }
    })
    .sort((g1: any, g2: any) => compareByName(g1?.groupLeader, g2?.groupLeader))

  return (
    <TableContainer
      className={commonStyles.tableContainer}
      style={{ overflowX: 'hidden' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.editGroups.details')}</TableCell>
            <TableCell>{t('groupLeader')}</TableCell>
            <TableCell>{t('admin.editGroups.numberOfGroupMembers')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {groupsAnnotated.map((g: any) => (
            <Group
              key={g.id}
              group={g}
              users={allAvailableUsersAnnotated}
              deleteGroup={deleteGroup}
              open={g.id === openId}
              setOpenId={setOpenGroup}
              addMembersToGroup={addMembersToGroup}
              deleteMember={deleteMember}
              editGroup={editGroup}
              showLastAnsweredAt={showLastAnsweredAt}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const EditGroups = ({ showLastAnsweredAt }: any) => {
  const { t } = useTranslation()

  const userState = useAppSelector(selectUserState)

  const {
    result: formDefinitions,
    error: formDefinitionsError,
    loading: formDefinitionsLoading,
  } = useApiGet({
    getFn: listAllFormDefinitionsForLoggedInUser,
    cmpFn: compareByCreatedAt,
  })

  const {
    result: users,
    error,
    loading,
    refresh: refreshAllUsers,
  } = useApiGet({
    getFn: listAllUsers,
  })
  const {
    result: allAvailableUsers,
    error: allAvailableUsersError,
    loading: allAvailableUsersLoading,
    // refresh: refreshAllAvailableUsers,
  } = useApiGet({
    getFn: listAllAvailableUsersInOrganization,
    params: userState.organizationID,
  })
  const {
    result: groupLeaders,
    error: groupLeadersError,
    loading: groupLeadersLoading,
    refresh: refreshGroupLeaders,
  } = useApiGet({
    getFn: listGroupLeadersInOrganization,
    params: userState.organizationID,
  })
  const {
    result: groups,
    error: groupsError,
    loading: groupsLoading,
    refresh: refreshGroups,
  } = useApiGet({
    getFn: listAllGroups,
  })
  const [showAddGroup, setShowAddGroup] = useState<boolean>(false)
  const [groupToDelete, setGroupToDelete] = useState<any>()
  const [groupToEdit, setGroupToEdit] = useState<any>()
  const [memberToDelete, setMemberToDelete] = useState<any>()
  const [showDeleteUserFromGroupDialog, setShowDeleteUserFromGroupDialog] =
    useState<boolean>(false)

  const deleteMember = (member: any, group: any) => {
    setMemberToDelete({ user: member, group })
    setShowDeleteUserFromGroupDialog(true)
  }
  const deleteMemberConfirm = async () => {
    await removeUserFromGroup(
      memberToDelete.user.Username,
      memberToDelete.group.id
    )
    setShowDeleteUserFromGroupDialog(false)
    refreshAllUsers()
  }
  const deleteGroup = (group: any) => setGroupToDelete(group)
  const deleteGroupConfirm = async () => {
    await removeGroup(groupToDelete)
    await Promise.all(
      users
        .filter((u: any) => u.groupID === groupToDelete.id)
        .map((u: any) => removeUserFromGroup(u.id, groupToDelete.id))
    )
    setGroupToDelete(null)
    refreshGroups()
  }
  const clearSelectedGroup = () => setGroupToDelete(null)
  const hideShowAddGroup = () => setShowAddGroup(false)
  const addGroupConfirm = async (groupLeaderUser: any) => {
    await addGroup(groupLeaderUser, userState.organizationID)
    setShowAddGroup(false)
    refreshGroups()
  }
  const editGroup = (group: any) => setGroupToEdit(group)
  const editGroupConfirm = async (groupLeader: any) => {
    await updateGroupLeader(groupToEdit, groupLeader)
    setGroupToEdit(null)
    refreshGroupLeaders()
  }

  const addMembersToGroup = async (selectedUsers: any[], groupId: string) => {
    await Promise.all(
      selectedUsers.map((u: any) => {
        const userHasGroup = users.some((us: any) => us.id === u.Username)
        if (userHasGroup) {
          return updateUserGroup(u.Username, groupId)
        } else {
          return addUserToGroup(u.Username, groupId, userState.organizationID)
        }
      })
    )
    refreshAllUsers()
  }

  const [lastAnsweredAtLoading, setLastAnsweredAtLoading] =
    useState<boolean>(showLastAnsweredAt)

  const isLoading =
    loading ||
    allAvailableUsersLoading ||
    groupLeadersLoading ||
    groupsLoading ||
    formDefinitionsLoading ||
    lastAnsweredAtLoading
  const isError =
    error ||
    allAvailableUsersError ||
    groupLeadersError ||
    groupsError ||
    formDefinitionsError

  const [allAvailableUsersAnnotated, setAllAvailableUsersAnnotated] = useState<
    any[]
  >([])

  useEffect(() => {
    const addLastAnsweredAt = async (users: any[]) => {
      if (users.length > 0 && formDefinitions.length > 0) {
        const activeFormDefId = formDefinitions[0].id

        const usersAnnotated = await Promise.all(
          users.map(async (u: any) => {
            const user = users.find((us: any) => us.Username === u.Username)
            if (user) {
              const lastAnsweredAt = await getLatestUserFormUpdatedAtForUser(
                u.Username,
                activeFormDefId
              )
              return { ...u, lastAnsweredAt: lastAnsweredAt }
            } else {
              return u
            }
          })
        )
        setAllAvailableUsersAnnotated(usersAnnotated)
        setLastAnsweredAtLoading(false)
      }
    }

    if (allAvailableUsers && formDefinitions) {
      const annotated = allAvailableUsers.map((u: any) => {
        const user = users.find((us: any) => us.id === u.Username)

        if (user) {
          const groupId = user.groupID
          const group = groups.find((g: any) => g.id === groupId)
          const groupLeaderUsername = group?.groupLeaderUsername
          const groupLeader = groupLeaders?.find(
            (gl: any) => gl.Username === groupLeaderUsername
          )
          return { ...u, groupId, groupLeader }
        } else {
          return u
        }
      })
      if (showLastAnsweredAt && formDefinitions.length > 0) {
        addLastAnsweredAt(annotated)
      } else {
        setAllAvailableUsersAnnotated(annotated)
      }
    }
  }, [
    allAvailableUsers,
    formDefinitions,
    groupLeaders,
    groups,
    users,
    showLastAnsweredAt,
  ])

  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {isError && <p>{t('errorOccured') + isError}</p>}
      {isLoading && <CircularProgress />}
      {!isError && !isLoading && groups && (
        <>
          <Card style={{ marginBottom: '24px' }} variant="outlined">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('menu.submenu.editGroups')}
              </Typography>
              {t('admin.editGroups.description')}
            </CardContent>
          </Card>
          <GroupsTable
            groups={groups}
            deleteGroup={deleteGroup}
            users={users}
            allAvailableUsersAnnotated={allAvailableUsersAnnotated}
            groupLeaders={groupLeaders}
            addMembersToGroup={addMembersToGroup}
            deleteMember={deleteMember}
            editGroup={editGroup}
            showLastAnsweredAt={showLastAnsweredAt}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginTop: '48px' }}
            onClick={() => setShowAddGroup(true)}
          >
            {t('admin.editGroups.createNewGroup')}
          </Button>
        </>
      )}
      <DeleteGroupDialog
        open={!!groupToDelete}
        onCancel={clearSelectedGroup}
        onConfirm={deleteGroupConfirm}
        group={groupToDelete}
        groupLeaders={groupLeaders}
      />
      <DeleteUserFromGroupDialog
        open={showDeleteUserFromGroupDialog}
        onCancel={() => setShowDeleteUserFromGroupDialog(false)}
        onExited={() => setMemberToDelete(null)}
        onConfirm={deleteMemberConfirm}
        user={memberToDelete && memberToDelete.user}
        roleName={t('groupDefiniteForm')}
        disableRoleSuffix
      />
      {groupToEdit && (
        <AddUserToGroupDialog
          usersConstant={groupLeaders}
          title={t('admin.editGroups.chooseNewGroupLeader')}
          searchFieldPlaceholder={t('searchForEmployeeInOrganization', {
            organization: userState.organizationName,
          })}
          confirmButtonText={t('admin.editGroups.choose')}
          open={!!groupToEdit}
          currentUsersInGroup={
            groupToEdit.groupLeader ? [groupToEdit.groupLeader] : []
          }
          onCancel={() => setGroupToEdit(null)}
          onConfirm={editGroupConfirm}
        />
      )}
      {showAddGroup && (
        <AddUserToGroupDialog
          usersConstant={groupLeaders}
          title={t('admin.editGroups.chooseGroupLeaderForTheNewGroup')}
          searchFieldPlaceholder={t('searchForEmployeeInOrganization', {
            organization: userState.organizationName,
          })}
          confirmButtonText={t('admin.editGroups.createGroup')}
          open={showAddGroup}
          currentUsersInGroup={[]}
          onCancel={hideShowAddGroup}
          onConfirm={addGroupConfirm}
        />
      )}
    </Container>
  )
}

export default EditGroups
