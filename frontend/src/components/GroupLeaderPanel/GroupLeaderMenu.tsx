import React from 'react'

import { Button } from '@mui/material'

import { getAttribute } from '../AdminPanel/helpers'
import { Panel } from '../../types'
import { useTranslation } from 'react-i18next'

const GroupLeaderMenu = ({
  members,
  show,
  selected,
  setActivePanel,
  activeSubmenuItem,
  setActiveSubmenuItem,
  setShowFab,
  style,
}: any) => {
  const { t } = useTranslation()
  if (!show) return null

  const items = members.map((m: any) => ({
    name: getAttribute(m, 'name'),
    username: m.Username,
  }))

  return (
    <>
      <Button
        className={clsx(style.MenuButton, {
          [style.menuButtonActive]: selected,
        })}
        onClick={() => {
          setShowFab(true)
          setActiveSubmenuItem('MAIN')
          setActivePanel(Panel.GroupLeader)
        }}
      >
        <div>{t('menu.myGroup').toUpperCase()}</div>
      </Button>

      {selected &&
        items.map((member: any) => (
          <Button
            key={member.name}
            onClick={() => setActiveSubmenuItem(member.username)}
          >
            <span>{member.name}</span>
          </Button>
        ))}
    </>
  )
}

export { GroupLeaderMenu }
