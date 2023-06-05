import { Edit } from '@mui/icons-material'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

const GroupAvatar = ({ showBadge, onClick, name, picture }: any) => (
  <Badge
    badgeContent={
      showBadge ? (
        <IconButton size="small" onClick={onClick}>
          <Edit />
        </IconButton>
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
    <>
      <GroupAvatar
        onClick={onEdit}
        name={name}
        picture={picture}
        showBadge={true}
      />
      <span style={{ marginLeft: '5px' }}>{name}</span>
    </>
  )
}

export default PictureAndNameEditCell
