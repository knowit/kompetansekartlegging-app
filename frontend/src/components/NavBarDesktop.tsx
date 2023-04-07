import {
  AppBar,
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grow,
  MenuItem,
  MenuList,
  Modal,
  Paper,
  Popper,
  Toolbar,
} from '@mui/material'

import HelpIcon from '@mui/icons-material/Help'
import { Tooltip } from '@mui/material'
import { IconButton } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ReactComponent as KnowitLogo } from '../Logotype-Knowit-Digital-white 1.svg'
import { useAppSelector } from '../redux/hooks'
import { selectUserState } from '../redux/User'
import { LanguageSelect } from './LanguageSelect'
import { useTranslation } from 'react-i18next'
import { KnowitColors } from '../styles'
import { NavBarPropsDesktop, UserRole } from '../types'
import { styled } from '@mui/material/styles'

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledButtonBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const NavBarDesktop = ({ ...props }: NavBarPropsDesktop) => {
  const { t, i18n } = useTranslation()
  const userState = useAppSelector(selectUserState)

  const [avatarMenuOpen, setAvatarMenuOpen] = useState<boolean>(false)
  // return focus to the button when we transitioned from !avatarMenuOpen -> avatarMenuOpen
  const avatarMenuPrevOpen = React.useRef(avatarMenuOpen)

  const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setAvatarMenuOpen((avatarMenuPrevOpen) => !avatarMenuPrevOpen)
  }

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setAvatarMenuOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setAvatarMenuOpen(false)
    }
  }

  const handleCloseSignout = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    props.signout()
  }

  const handleCloseAlert = () => {
    setDeleteAlertOpen(false)
  }

  useEffect(() => {
    if (avatarMenuPrevOpen.current === true && avatarMenuOpen === false) {
      anchorRef.current?.focus()
    }

    avatarMenuPrevOpen.current = avatarMenuOpen
  }, [avatarMenuOpen])

  const [isHelpModalOpen, setHelpModalOpen] = useState<boolean>(false)

  const [helpMarkdown, setHelpMarkdown] = useState<any>()

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/knowit/kompetansekartlegging-app/main/frontend/markdown/' +
        i18n.language +
        '/help.md'
    )
      .then(async (response) => {
        const markdown = await response.text()
        setHelpMarkdown(markdown)
      })
      .catch((error) => console.error(error))
  }, [i18n.language])

  return (
    <AppBar className="header">
      <StyledToolbar>
        <KnowitLogo />

        <h1>
          {t('navbar.competenceMappingFor')} {userState.organizationName}
        </h1>

        <StyledButtonBox id="buttons">
          {userState.roles.includes(UserRole.Admin) ? (
            <Modal
              open={isHelpModalOpen}
              onClose={() => setHelpModalOpen(false)}
            >
              <>
                <ReactMarkdown>{helpMarkdown}</ReactMarkdown>
              </>
            </Modal>
          ) : null}
          {userState.roles.includes(UserRole.Admin) ? (
            <Tooltip title={t('navbar.help')}>
              <IconButton
                onClick={() => setHelpModalOpen(true)}
                ref={anchorRef}
                aria-controls={avatarMenuOpen ? 'menu-list-grow' : undefined}
                aria-label={t('aria.helpButton') as string}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          <LanguageSelect />
          <Button
            ref={anchorRef}
            aria-controls={avatarMenuOpen ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            aria-label={t('aria.toggleDropdownMenu') as string}
          >
            <div>{userState.name}</div>
            <Avatar
              src={userState.picture}
              alt={t('navbar.profilePicture') as string}
            />
          </Button>
        </StyledButtonBox>

        <Popper
          open={avatarMenuOpen}
          anchorEl={anchorRef.current}
          placement={'bottom-end'}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={avatarMenuOpen}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {/* Removed for user testing, i18n if uncommenting
                                        <MenuItem onClick={handleDisplayAnswers}>Vis alle lagrede svar</MenuItem>
                                        <MenuItem onClick={handleDeleteAnswers}>Slett alle svar</MenuItem> */}
                    <MenuItem onClick={handleCloseSignout}>
                      {t('navbar.signOut')}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <Dialog
          open={deleteAlertOpen}
          onClose={handleCloseAlert}
          aria-labelledby="dialogtitle"
          aria-describedby="dialogdescription"
        >
          <DialogTitle id="dialogtitle">
            {t('navbar.doYouWantToDeleteYourAnswers')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialogdescription">
              {t('navbar.thisWillDeleteAllAnswers')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => 1}>{t('confirm')}</Button>
            <Button onClick={handleCloseAlert} autoFocus>
              {t('abort')}
            </Button>
          </DialogActions>
        </Dialog>
      </StyledToolbar>
    </AppBar>
  )
}

export default NavBarDesktop
