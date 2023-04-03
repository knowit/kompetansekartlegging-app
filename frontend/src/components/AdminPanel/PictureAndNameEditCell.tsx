import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

const GroupAvatar = ({ showBadge, onClick, name, picture }: any) => (
  <Badge
    overlap="rectangular"
    badgeContent={
      showBadge ? (
        <IconButton size="small" onClick={onClick}></IconButton>
      ) : null
    }
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
  >
    <Avatar alt={name} src={picture} />
  </Badge>
)

const PictureAndNameEditCell = ({ name, picture, onEdit }: any) => {
  return (
    <span>
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
