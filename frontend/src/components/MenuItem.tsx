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

type MenuItemProps = {
  show: boolean
  selected: boolean
  setActivePanel: any
  panelType: any
  content: any
  text: string
  alert: any
}
const MenuItem = ({
  show,
  setActivePanel,
  panelType,
  content,
  text,
  alert,
}: MenuItemProps) => {
  const { t } = useTranslation()
  if (!show) return null

  const [open, setOpen] = React.useState(false)

  return (
    <Fragment>
      <ListItemButton
        onClick={() => {
          setActivePanel(panelType)
          setOpen(!open)
        }}
      >
        <Badge badgeContent={alert} color="secondary">
          <ListItemText>{t(text)}</ListItemText>
        </Badge>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div">{content}</List>
      </Collapse>
    </Fragment>
  )
}

export { MenuItem }
