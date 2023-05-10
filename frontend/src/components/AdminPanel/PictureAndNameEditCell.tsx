import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { makeStyles, withStyles } from '@mui/styles'
import EditIcon from '@mui/icons-material/Edit'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const StyledEditIcon = withStyles(() => ({
  root: {
    fontSize: '15px',
  },
}))(EditIcon)

const StyledBadge = withStyles((theme) => ({
  badge: {
    border: `2px solid ${theme.palette.background.default}`,
    padding: '0 0px',
    backgroundColor: `${theme.palette.background.paper}`,
  },
}))(Badge)

const GroupAvatar = ({ showBadge, onClick, name, picture }: any) => (
  <StyledBadge
    overlap="rectangular"
    badgeContent={
      showBadge ? (
        <IconButton size="small" onClick={onClick}>
          <StyledEditIcon />
        </IconButton>
      ) : null
    }
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
  >
    <Avatar alt={name} src={picture} />
  </StyledBadge>
)

const PictureAndNameEditCell = ({ name, picture, onEdit }: any) => {
  const classes = useStyles()

  return (
    <span className={classes.root}>
      <GroupAvatar
        onClick={onEdit}
        name={name}
        picture={picture}
        showBadge={true}
      />
      {name}
    </span>
  )
}

export default PictureAndNameEditCell
