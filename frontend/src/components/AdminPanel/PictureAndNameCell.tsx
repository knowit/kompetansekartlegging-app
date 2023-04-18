import Avatar from '@mui/material/Avatar'

const PictureAndNameCell = ({ name, picture }: any) => {
  return (
    <span>
      <Avatar alt={name} src={picture} />
      {name}
    </span>
  )
}

export default PictureAndNameCell
