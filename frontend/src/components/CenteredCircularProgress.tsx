import { CircularProgress, Box } from '@mui/material'

const CenteredCircularProgress = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

export default CenteredCircularProgress
