import { useState } from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '../DescriptionTable'
import { getAttribute, not } from './helpers'
import useApiGet from './useApiGet'
import UsersTable from './UsersTable'

const AddUserToGroupDialog = ({
  onCancel,
  onConfirm,
  open,
  currentUsersInGroup,
  usersConstant,
  userGetFn,
  roleName,
  title,
  confirmButtonText,
}: any) => {
  const { t } = useTranslation()
  const userState = useAppSelector(selectUserState)

  const {
    result: users,
    error,
    loading,
  } = useApiGet({
    getFn: userGetFn,
    constantResult: usersConstant,
    params: userState.isSignedIn ? userState.organizationID : null,
  })
  const [selectedUser, setSelectedUser] = useState<any>()
  const onSelect = (user: any) => {
    if (user === selectedUser) {
      setSelectedUser(null)
    } else {
      setSelectedUser(user)
    }
  }
  const [nameFilter, setNameFilter] = useState<string>('')

  const nameFilterFn = (user: any) => {
    const name = getAttribute(user, 'name')
    return (
      !name ||
      name.toLocaleLowerCase().startsWith(nameFilter.toLocaleLowerCase())
    )
  }
  const usersInList = not(users, currentUsersInGroup).filter(nameFilterFn)

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
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
          <span>{title || t('add') + ' ' + roleName}</span>
          <IconButton onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          placeholder={
            t('searchForEmployeeInOrganization', {
              organization: userState.organizationName,
            }) as string
          }
          variant="outlined"
          value={nameFilter}
          onChange={(e: any) => setNameFilter(e.target.value)}
        />
      </DialogTitle>
      <DialogContent>
        {error && <p>{t('errorOccured') + error}</p>}
        {loading && <CircularProgress />}
        {!error && !loading && users && (
          <UsersTable
            users={usersInList}
            selectedUser={selectedUser}
            setSelectedUser={onSelect}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          <span>{t('abort')}</span>
        </Button>
        <Button
          onClick={() => onConfirm(selectedUser)}
          disabled={!selectedUser}
        >
          <span>{confirmButtonText || t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddUserToGroupDialog
