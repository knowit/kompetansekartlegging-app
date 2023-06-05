import { Drawer, List, ListItemButton, ListItemText } from '@mui/material'
import adminMenuItems from './AdminPanel/MenuItems'
import getGroupLeaderItems from './GroupLeaderPanel/MenuItems'
import { superAdminItems } from './SuperAdminPanel/MenuItems'
import { DropdownMenuItem } from './DropdownMenuItem'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { Panel } from '../types'
import { useAppSelector } from '../redux/hooks'

import {
  selectIsAdmin,
  selectIsGroupLeader,
  selectIsSuperAdmin,
} from '../redux/User'
import { AlertState } from '../types'

import { useTranslation } from 'react-i18next'
import getYourAnswersMenuItems from './YourAnswersMenuItems'

type SideMenuProps = {
  isSmall: boolean
  activePanel: Panel
  categories: string[]
  menuOpen: boolean
  toggleMenuOpen: any
  alerts?: AlertState
  activeCategory: string
  activeSubmenuItem: string
  groupMembers: any
  handleMenuClick: (panelSource: Panel, itemSource: string) => void
}

const SideMenu = ({
  categories,
  isSmall,
  activePanel,
  menuOpen,
  toggleMenuOpen,
  alerts,
  activeCategory,
  activeSubmenuItem,
  groupMembers,
  handleMenuClick,
}: SideMenuProps) => {
  const { t } = useTranslation()

  const isSuperAdmin = useAppSelector(selectIsSuperAdmin)
  const isAdmin = useAppSelector(selectIsAdmin)
  const isGroupLeader = useAppSelector(selectIsGroupLeader)

  return (
    <Drawer
      id="menu"
      variant={isSmall ? 'persistent' : 'permanent'}
      open={isSmall ? menuOpen : false}
      anchor="left"
    >
      {isSmall && (
        <IconButton onClick={() => toggleMenuOpen()}>
          <Close />
        </IconButton>
      )}
      <List>
        <ListItemButton
          selected={activePanel === Panel.Overview}
          onClick={() => handleMenuClick(Panel.Overview, 'MAIN')}
        >
          <ListItemText>{t('menu.overview')}</ListItemText>
        </ListItemButton>
        <DropdownMenuItem
          panelId={Panel.MyAnswers}
          show={true}
          items={getYourAnswersMenuItems(categories, alerts)}
          text={'menu.myAnswers'}
          alert={alerts?.qidMap.size !== 0 ? '!' : 0}
          activeSubmenuItem={activeCategory}
          handleMenuClick={handleMenuClick}
        />

        <DropdownMenuItem
          panelId={Panel.GroupLeader}
          show={isGroupLeader}
          items={getGroupLeaderItems(groupMembers)}
          text={'menu.myGroup'}
          alert={0}
          activeSubmenuItem={activeSubmenuItem}
          handleMenuClick={handleMenuClick}
        />

        <DropdownMenuItem
          panelId={Panel.Admin}
          show={isAdmin}
          items={adminMenuItems}
          text={'menu.admin'}
          alert={0}
          activeSubmenuItem={activeSubmenuItem}
          handleMenuClick={handleMenuClick}
        />

        <DropdownMenuItem
          panelId={Panel.SuperAdmin}
          show={isSuperAdmin}
          items={superAdminItems}
          text={'menu.superAdmin'}
          alert={0}
          activeSubmenuItem={activeSubmenuItem}
          handleMenuClick={handleMenuClick}
        />
      </List>
    </Drawer>
  )
}

export default SideMenu
