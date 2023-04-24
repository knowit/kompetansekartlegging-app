import { createTheme } from '@mui/material'
import { KnowitColors } from './styleconstants'

/*The theme holds styles that override all default components
  Styles specific to specific components, 
  like layouts, can be found in the component file.
  See: https://mui.com/material-ui/customization/palette/
*/

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
    MuiCollapse: {
      styleOverrides: {
        root: {
          '.submenuItem': {
            paddingLeft: '25px',
          },
        },
      },
    },
  },
})

export default theme
