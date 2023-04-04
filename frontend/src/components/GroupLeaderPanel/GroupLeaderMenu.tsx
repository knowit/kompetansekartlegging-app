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
    <Button key={member.name} onClick={() => setActiveSubmenuItem('MAIN')}>
      <span>{member.name}</span>
    </Button>
  ))

  return (
    <>
      {members.length === 0 ? (
        <ListItemButton onClick={() => setActivePanel(Panel.GroupLeader)}>
          <ListItemText>{t('menu.myGroup')}</ListItemText>
        </ListItemButton>
      ) : (
        <MenuItem
          panelType={Panel.GroupLeader}
          text={t('menu.myGroup')}
          setActivePanel={setActivePanel}
          show
          selected
          content={content}
          alert={0}
        />
      )}
    </>
  )
}

export { GroupLeaderMenu }
