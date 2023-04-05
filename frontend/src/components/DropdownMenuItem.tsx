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
  setAnswerMode: any
}
const DropdownMenuItem = ({
  show,
  panelId,
  setActivePanel,
  curActivePanel,
  items,
  text,
  alert,
  setActiveSubmenuItem,
  activeSubmenuItem,
  setAnswerMode,
}: MenuItemProps) => {
  if (!show) return null

  const { t } = useTranslation()

  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const subMenuItems = (activeSubmenuItem: any, items: any) =>
    items.map((item: any) => (
      <ListItemButton
        key={item.key}
        onClick={() => {
          setActiveSubmenuItem(item.key)
          setActivePanel(panelId)
        }}
        selected={item.key === activeSubmenuItem}
      >
        <Badge badgeContent={item.alert} color="secondary">
          <ListItemText>{t(item.text)}</ListItemText>
        </Badge>
      </ListItemButton>
    ))

  return (
    <Fragment>
      <ListItemButton
        onClick={() => {
          if (panelId != Panel.MyAnswers) {
            setAnswerMode(false)
          }
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
        <List component="div">{subMenuItems(activeSubmenuItem, items)}</List>
      </Collapse>
    </Fragment>
  )
}

export { DropdownMenuItem }
