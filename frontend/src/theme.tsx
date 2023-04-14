import { createTheme } from '@mui/material'
import { KnowitColors } from './styles'

// See: https://mui.com/material-ui/customization/palette/

const theme = createTheme({
  palette: {
    primary: {
      light: KnowitColors.greyGreen,
      main: KnowitColors.darkBrown,
      dark: KnowitColors.black,
    },
    warning: {
      main: KnowitColors.fuchsia,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        text: {
          color: KnowitColors.darkGreen,
        },
        contained: {
          color: KnowitColors.darkBrown,
          backgroundColor: KnowitColors.lightGreen,
          '&:hover': {
            color: KnowitColors.white,
            backgroundColor: KnowitColors.darkGreen,
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '.modalContent': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: KnowitColors.white,
            border: '2px solid #000',
            maxHeight: '80%',
            overflowY: 'auto',
            padding: '20px',
          },
        },
      },
    },
    MuiCollapse: {
      styleOverrides: {
        root: {
          '.submenuItem': {
            paddingLeft: '20px',
          },
        },
      },
    },
  },
})

export default theme
