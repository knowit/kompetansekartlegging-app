import clsx from 'clsx'

import { Button } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import { Panel } from '../../types'
import { getAttribute } from '../AdminPanel/helpers'

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
        <div className={clsx(style.menuButtonText)}>
          {t('menu.myGroup').toUpperCase()}
        </div>
      </Button>

      {selected &&
        items.map((member: any) => (
          <Button
            key={member.name}
            className={clsx(style.MenuButton, {
              [style.menuButtonActive]: activeSubmenuItem === member.username,
            })}
            onClick={() => setActiveSubmenuItem(member.username)}
          >
            <span
              className={clsx(
                style.menuButtonText,
                style.menuButtonCategoryText
              )}
            >
              {member.name}
            </span>
          </Button>
        ))}
    </>
  )
}

export { GroupLeaderMenu }
