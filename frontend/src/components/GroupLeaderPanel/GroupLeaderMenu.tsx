import React from 'react'
import { Button, ListItemButton, ListItemText } from '@mui/material'
import { getAttribute } from '../AdminPanel/helpers'
import { Panel } from '../../types'
import { useTranslation } from 'react-i18next'
import { MenuItem } from '../MenuItem'

const GroupLeaderMenu = ({
  members,
  show,
  selected,
  setActivePanel,
  setActiveSubmenuItem,
  setShowFab,
}: any) => {
  const { t } = useTranslation()
  if (!show) return null

  const items = members.map((m: any) => ({
    name: getAttribute(m, 'name'),
    username: m.Username,
  }))

  const content = items.map((member: any) => (
    <ListItemButton
      key={member.name}
      onClick={() => {
        setActiveSubmenuItem('MAIN')
        setActivePanel(Panel.GroupLeader)
      }}
    >
      <ListItemText>{member.name}</ListItemText>
    </ListItemButton>
  ))

  return (
    <>
      <MenuItem
        panelType={Panel.GroupLeader}
        text={t('menu.myGroup')}
        setActivePanel={setActivePanel}
        show
        selected
        content={content}
        alert={0}
        setActiveSubmenuItem={setActiveSubmenuItem}
      />
    </>
  )
}

export { GroupLeaderMenu }
