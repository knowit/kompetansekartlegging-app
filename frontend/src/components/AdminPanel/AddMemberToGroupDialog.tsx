import { useState } from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TextField from '@material-ui/core/TextField'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../redux/hooks'
import { selectUserState } from '../../redux/User'
import { dialogStyles } from '../../styles'
import { CloseIcon } from '../DescriptionTable'
import Table from '../mui/Table'
import TableRow from '../mui/TableRow'
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
  const style = dialogStyles()
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
          <IconButton className={style.closeButton} onClick={onCancel}>
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
          onClick={() => {
            onConfirm(selectedUsers)
            onClose()
          }}
          disabled={selectedUsers.length === 0}
          className={style.confirmButton}
        >
          <span className={style.buttonText}>{t('add')}</span>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useStylesSelectedUsers = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}))

const SelectedUsers = ({ selectedUsers, setSelectedUser }: any) => {
  const classes = useStylesSelectedUsers()
  return (
    <Paper component="ul" className={classes.root}>
      {selectedUsers.map((user: any) => {
        const nameOrUsername = getNameOrUsername(user)
        return (
          <li key={user.Username}>
            <Chip
              label={nameOrUsername}
              onDelete={() => setSelectedUser(user)}
              className={classes.chip}
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
    <TableContainer component={Paper} style={{ height: '100%' }}>
      <Table stickyHeader style={{ maxHeight: '100%' }}>
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
