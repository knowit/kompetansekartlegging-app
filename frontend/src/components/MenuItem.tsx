import {
  Badge,
  ListItemButton,
  Collapse,
  List,
  ListItemText,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import React, { Fragment } from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Panel } from '../types'

type MenuItemProps = {
  panelId: Panel
  show: boolean
  setActivePanel: any
  curActivePanel: Panel
  items: any
  text: string
  alert: any
  setActiveSubmenuItem: any
  activeSubmenuItem: string
}
const MenuItem = ({
  show,
  panelId,
  setActivePanel,
  curActivePanel,
  items,
  text,
  alert,
  setActiveSubmenuItem,
  activeSubmenuItem,
}: MenuItemProps) => {
  if (!show) return null

  const { t } = useTranslation()

  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const subMenuItems = items.map((item: any) => (
    <ListItemButton
      key={item.key}
      selected={item.key === activeSubmenuItem}
      onClick={() => {
        setActiveSubmenuItem(item.key)
        setActivePanel(panelId)
      }}
    >
      <Badge badgeContent={item.alert} color="secondary">
        <ListItemText>{t(item.text)}</ListItemText>
      </Badge>
    </ListItemButton>
  ))

  return (
    <Fragment>
      <ListItemButton
        selected={panelId === curActivePanel}
        onClick={() => {
          setActivePanel(panelId)
          setDrawerOpen(!drawerOpen)
          setActiveSubmenuItem('MAIN')
        }}
      >
        <Badge badgeContent={alert} color="secondary">
          <ListItemText>{t(text)}</ListItemText>
        </Badge>
        {drawerOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={drawerOpen} timeout="auto" unmountOnExit>
        <List component="div">{subMenuItems}</List>
      </Collapse>
    </Fragment>
  )
}

export { MenuItem }
