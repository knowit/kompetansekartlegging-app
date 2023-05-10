import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from '@mui/material'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { makeStyles } from '@mui/styles'
import { KeyboardEvent, MouseEvent, useState } from 'react'
import { isIOS } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import { KnowitColors } from '../styles'
import { NavBarPropsMobile } from '../types'
import { LanguageSelect } from './LanguageSelect'

const navbarStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  drawer: {
    // [theme.breakpoints.up('sm')]: {
    //   width: drawerWidth,
    //   flexShrink: 0,
    // },
  },
  paper: {
    backgroundColor: KnowitColors.darkBrown,
    color: KnowitColors.beige,
    borderRadius: '0px 50px 0px 0px',
  },
  panel: {
    background: KnowitColors.greyGreen,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    zIndex: 100,
    position: 'fixed',
    width: '100%',
    top: '0',
    height: 55,
  },
  logoutButton: {
    marginRight: theme.spacing(2),
  },
  button: {
    width: '100px',
  },
  header: {
    backgroundColor: KnowitColors.beige,
    boxShadow: 'none',
    color: KnowitColors.darkBrown,
  },
  userName: {
    margin: '5px',
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '23px',
    color: KnowitColors.ecaluptus,
    marginLeft: 'auto',
  },
  userPicture: {
    margin: '5px',
    width: '44px',
    height: '44px',
  },
  headerText: {
    fontWeight: 700,
    fontSize: 20,
  },

  listContainer: {
    width: 250,
    height: '90%',
  },
  logout: {
    marginTop: 'auto',
  },
  list: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    fontWeight: 700,
  },
}))

const NavBarMobile = ({ ...props }: NavBarPropsMobile) => {
  const { t } = useTranslation()
  const style = navbarStyles()
  // const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false)

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  const navbarHeader = () => {
    switch (props.activePanel) {
      case 0:
        return t('menu.overview').toUpperCase()
      case 1:
        return t('menu.myAnswers').toUpperCase()
      default:
        return ''
    }
  }

  const toggleDrawer =
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setDrawerOpen(open)
    }

  const list = () => (
    <div
      className={style.listContainer}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <LanguageSelect
        color={KnowitColors.beige}
        marginTop={12}
        marginLeft={15}
      />
      <List className={style.list}>
        {props.menuButtons}
        <ListItem className={style.logout} onClick={props.signout}>
          {/* <Avatar className={style.userPicture} src={props.userPicture} alt={t('navbar.profilePicture') as string} /> */}
          {t('navbar.signOut')}
        </ListItem>
      </List>
    </div>
  )

  return (
    <div className={style.root}>
      <AppBar position="static" className={style.header}>
        <Toolbar>
          <IconButton
            edge="start"
            className={style.menuButton}
            color="inherit"
            aria-label={t('aria.menu') as string}
            onClick={toggleDrawer(true)}
            size="large"
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" noWrap className={style.headerText}>
            {navbarHeader()}
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        classes={{ paper: style.paper }}
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor={'left'}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  )
}

export default NavBarMobile
