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

import { useTranslation } from 'react-i18next'
import { selectUserState } from '../../redux/User'
import { useAppSelector } from '../../redux/hooks'
import { dialogStyles } from '../../styles'
import { CloseIcon } from '../DescriptionTable'
import UsersTable from './UsersTable'
import { getAttribute, not } from './helpers'
import useApiGet from './useApiGet'

const AddUserToGroupDialog = ({
  onCancel,
  onConfirm,
  open,
  currentUsersInGroup,
  usersConstant,
  userGetFn,
  userGetFnParams,
  roleName,
  searchFieldPlaceholder,
  title,
  confirmButtonText,
  showOrgId,
}: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()

  const {
    result: users,
    error,
    loading,
  } = useApiGet({
    getFn: userGetFn,
    constantResult: usersConstant,
    params: userGetFnParams,
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
            {title || t('add') + ' ' + roleName}
          </span>
          <IconButton
            className={style.closeButton}
            onClick={onCancel}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          placeholder={searchFieldPlaceholder}
          variant="outlined"
          value={nameFilter}
          className={style.searchField}
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
            showOrgId={showOrgId}
          />
        )}
      </DialogContent>
      <DialogActions className={style.alertButtons}>
        <Button onClick={onCancel} className={style.cancelButton}>
          <span className={style.buttonText}>{t('abort')}</span>
        </Button>
        <Button
          onClick={() => onConfirm(selectedUser)}
          disabled={!selectedUser}
          className={style.confirmButton}
        >
          <span className={style.buttonText}>
            {confirmButtonText || t('add')}
          </span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddUserToGroupDialog
