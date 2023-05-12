import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { Close as CloseIcon } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getAllUsers } from '../../../../api/admin'
import { IUserAnnotated } from '../../../../api/admin/types'
import { addMultipleUsersToGroup } from '../../../../api/groups'
import { selectUserState } from '../../../../redux/User'
import { useAppSelector } from '../../../../redux/hooks'
import { dialogStyles } from '../../../../styles'
import { containsUser, getCognitoAttribute } from '../utils'
import SelectedUsers from './SelectedUsers'
import UsersTable from './UserTable'

interface AddUsersToGroupDialogProps {
  groupId: string
  onCancel: () => void
  open: boolean
  members: IUserAnnotated[]
}

export const AddUsersToGroupDialog = ({
  groupId,
  onCancel,
  open,
  members,
}: AddUsersToGroupDialogProps) => {
  const { t } = useTranslation()
  const style = dialogStyles()
  const userState = useAppSelector(selectUserState)
  const queryClient = useQueryClient()

  const [showOnlyUnset, setShowOnlyUnset] = useState<boolean>(true)
  const [nameFilter, setNameFilter] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<IUserAnnotated[]>([])
  const [usersInList, setUsersInList] = useState<IUserAnnotated[]>([])

  const resetState = () => {
    setShowOnlyUnset(true)
    setNameFilter('')
    setSelectedUsers([])
    setUsersInList([])
  }

  const onSelect = (user: IUserAnnotated) => {
    if (selectedUsers.find((u) => user.username === u.username)) {
      setSelectedUsers(
        selectedUsers.filter((u) => user.username !== u.username)
      )
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['admin_get_all_users'],
    queryFn: getAllUsers,
  })

  /**
   * TODO: invalidate getgroupMembers (ikke eksisterenede enda, men kommer snart til en fil nær deg)
   */

  const addUsersToGroupMutation = useMutation({
    mutationFn: () => addMultipleUsersToGroup({ id: groupId }, selectedUsers),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin_get_all_users'] }),
  })

  const onClose = () => {
    resetState()
    onCancel()
  }

  const onConfirm = () => {
    addUsersToGroupMutation.mutate
    onClose()
  }

  const toggleShowOnlyUnset = () =>
    setShowOnlyUnset((showOnlyUnset) => !showOnlyUnset)

  const nameFilterFn = (user: IUserAnnotated) => {
    const name = getCognitoAttribute(user.cognito_attributes, 'name')
    return (
      !name ||
      name.toLocaleLowerCase().startsWith(nameFilter.toLocaleLowerCase())
    )
  }
  const showOnlyUnsetFilterFn = (user: IUserAnnotated) =>
    !showOnlyUnset || !user.group_leader_username

  useEffect(() => {
    const usersToShow = data?.data
      ?.filter((user) => !containsUser(user, members))
      .filter(nameFilterFn)
      .filter(showOnlyUnsetFilterFn)
    setUsersInList(usersToShow ?? [])
  }, [data?.data])

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: 30 },
      }}
    >
      <DialogTitle>
        <Box
          component="div"
          mb={1}
          display="flex"
          justifyContent="space-between"
        >
          <span className={style.dialogTitleText}>
            {t('myGroup.addMembers')}
          </span>
          <IconButton
            className={style.closeButton}
            onClick={onCancel}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <FormGroup row>
          <TextField
            fullWidth
            placeholder={
              t('searchForEmployeeInOrganization', {
                organization: userState.organizationName,
              }) as string
            }
            variant="outlined"
            value={nameFilter}
            className={style.searchField}
            onChange={(e: any) => setNameFilter(e.target.value)}
            helperText={t('myGroup.theEmployeeMustHaveSignedInOnce')}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyUnset}
                onChange={toggleShowOnlyUnset}
                color="primary"
              />
            }
            label={t('myGroup.showOnlyEmployeesWithoutGroupLeader')}
          />
        </FormGroup>
        {selectedUsers.length > 0 && (
          <SelectedUsers
            selectedUsers={selectedUsers}
            setSelectedUser={onSelect}
          />
        )}
      </DialogTitle>
      <DialogContent style={{ maxHeight: '512px' }}>
        <UsersTable
          users={usersInList}
          selectedUsers={selectedUsers}
          setSelectedUser={onSelect}
        />
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onClose} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
        <Button
          onClick={onConfirm}
          disabled={selectedUsers.length === 0}
          className={style.confirmButton}
        >
          <span className={style.buttonText}>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
