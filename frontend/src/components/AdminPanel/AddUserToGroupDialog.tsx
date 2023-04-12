import { useState } from 'react'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

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
  roleName,
  title,
  confirmButtonText,
}: any) => {
  const { t } = useTranslation()
  const style = dialogStyles()
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
          <IconButton className={style.closeButton} onClick={onCancel}>
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
