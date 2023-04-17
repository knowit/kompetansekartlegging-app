import React from 'react'
import Avatar from '@mui/material/Avatar'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

const PictureAndNameCell = ({ name, picture }: any) => {
  const classes = useStyles()

  return (
    <span className={classes.root}>
      <Avatar alt={name} src={picture} />
      {name}
    </span>
  )
}

export default PictureAndNameCell
