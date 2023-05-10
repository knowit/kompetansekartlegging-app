import { Chip, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { IUserAnnotated } from '../../../../api/admin/types'
import { getNameOrUsername } from '../utils'

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
      {selectedUsers.map((user: IUserAnnotated) => {
        const nameOrUsername = getNameOrUsername(user)
        return (
          <li key={user.username}>
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

export default SelectedUsers
