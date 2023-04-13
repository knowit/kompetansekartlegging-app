import { AppBar, Toolbar, IconButton, List, ListItem } from '@mui/material'

import React from 'react'
import { KnowitColors } from '../styles'
import { NavBarPropsMobile } from '../types'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { isIOS } from 'react-device-detect'
import { LanguageSelect } from './LanguageSelect'
import { useTranslation } from 'react-i18next'

const NavBarMobile = ({ ...props }: NavBarPropsMobile) => {
  const { t } = useTranslation()

  // const [mobileOpen, setMobileOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen);
  // };
  const navbarHeader = () => {
    switch (props.activePanel) {
      case 0:
        return t('menu.overview')
      case 1:
        return t('menu.myAnswers')
        return ''
    }
  }

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setDrawerOpen(open)
    }

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <LanguageSelect color={KnowitColors.beige} marginLeft={15} />
      <List>
        {props.menuButtons}
        <ListItem onClick={props.signout}>
          {/* <Avatar  src={props.userPicture} alt={t('navbar.profilePicture') as string} /> */}
          {t('navbar.signOut')}
        </ListItem>
      </List>
    </div>
  )

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label={t('aria.menu') as string}
            onClick={toggleDrawer(true)}
            size="large"
          >
            <MenuIcon fontSize="large" />
          </IconButton>

          {navbarHeader()}
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
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
