import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import { TableRow } from '@mui/material'

import Switch from '@mui/material/Switch'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'
import { useTranslation } from 'react-i18next'

import CloseIcon from '@mui/icons-material/Close'
import { Table } from '@mui/material'

import { getAttribute, not } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'

const getNameOrUsername = (user: any) => {
  const name = getAttribute(user, 'name')
  return name || user.Username
}

const AddMemberToGroupDialog = ({
  onCancel,
  onConfirm,
  open,
  allUsers,
  members,
}: any) => {
  const { t } = useTranslation()

  const userState = useAppSelector(selectUserState)

  const [showOnlyUnset, setShowOnlyUnset] = useState<boolean>(true)
  const [nameFilter, setNameFilter] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const onSelect = (user: any) => {
    if (selectedUsers.find((u) => user.Username === u.Username)) {
      setSelectedUsers(
        selectedUsers.filter((u) => user.Username !== u.Username)
      )
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const onClose = () => {
    setSelectedUsers([])
    onCancel()
  }

  const toggleShowOnlyUnset = () =>
    setShowOnlyUnset((showOnlyUnset) => !showOnlyUnset)
  const nameFilterFn = (user: any) => {
    const name = getAttribute(user, 'name')
    return (
      !name ||
      name.toLocaleLowerCase().startsWith(nameFilter.toLocaleLowerCase())
    )
  }
  const showOnlyUnsetFilterFn = (user: any) =>
    !showOnlyUnset || !user.groupLeader
  const usersInList = not(allUsers, members)
    .filter(nameFilterFn)
    .filter(showOnlyUnsetFilterFn)

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <span>{t('myGroup.addMembers')}</span>
          <IconButton onClick={onCancel} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <FormGroup row>
          <TextField
            margin="dense"
            fullWidth
            placeholder={
              t('searchForEmployeeInOrganization', {
                organization: userState.organizationName,
              }) as string
            }
            variant="outlined"
            value={nameFilter}
            onChange={(e: any) => setNameFilter(e.target.value)}
            helperText={t('myGroup.theEmployeeMustHaveSignedInOnce')}
          />
          <FormControlLabel
            control={
              <Switch checked={showOnlyUnset} onChange={toggleShowOnlyUnset} />
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
      <DialogContent>
        <UsersTable
          users={usersInList}
          selectedUsers={selectedUsers}
          setSelectedUser={onSelect}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <span>{t('abort')}</span>
        </Button>
        <Button
          onClick={() => {
            onConfirm(selectedUsers)
            onClose()
          }}
          disabled={selectedUsers.length === 0}
        >
          <span>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const SelectedUsers = ({ selectedUsers, setSelectedUser }: any) => {
  return (
    <Paper component="ul">
      {selectedUsers.map((user: any) => {
        const nameOrUsername = getNameOrUsername(user)
        return (
          <li key={user.Username}>
            <Chip
              label={nameOrUsername}
              onDelete={() => setSelectedUser(user)}
            />
          </li>
        )
      })}
    </Paper>
  )
}

const User = ({ user, selected, setSelectedUser }: any) => {
  const { t } = useTranslation()
  const name = getAttribute(user, 'name')
  const picture = getAttribute(user, 'picture')
  const hasGroup = !!user.groupLeader
  const groupLeaderName = hasGroup && getAttribute(user.groupLeader, 'name')

  return (
    <>
      <TableRow hover selected={selected} onClick={() => setSelectedUser(user)}>
        <TableCell>
          <PictureAndNameCell name={name} picture={picture} />
        </TableCell>
        <TableCell>{groupLeaderName || t('myGroup.noGroupLeader')}</TableCell>
      </TableRow>
    </>
  )
}

const UsersTable = ({ users, selectedUsers, setSelectedUser }: any) => {
  const { t } = useTranslation()
  const isSelected = (user: any) =>
    selectedUsers.some((u: any) => u.Username === user.Username)

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('groupLeader')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u: any) => (
            <User
              key={u.Username}
              user={u}
              selected={isSelected(u)}
              setSelectedUser={setSelectedUser}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AddMemberToGroupDialog
