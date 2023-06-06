import { Dispatch, SetStateAction } from 'react'
import { Button } from '@mui/material'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { SubmenuCategory } from './AdminPanel'
import { Panel } from '../../types'

type AdminMenuProps = {
  show: boolean
  selected: boolean
  setShowFab: Dispatch<SetStateAction<boolean>>
  style: any
  activeSubmenuItem: any
  setActiveSubmenuItem: any
  setActivePanel: any
}
const AdminMenu = ({
  show,
  selected,
  setShowFab,
  style,
  activeSubmenuItem,
  setActiveSubmenuItem,
  setActivePanel,
}: AdminMenuProps) => {
  const { t } = useTranslation()
  if (!show) return null

  const items = [
    {
      key: SubmenuCategory.EDIT_GROUP_LEADERS,
      text: t('menu.submenu.editGroupLeaders'),
    },
    {
      key: SubmenuCategory.EDIT_GROUPS,
      text: t('menu.submenu.editGroups'),
    },
    {
      key: SubmenuCategory.EDIT_ADMINS,
      text: t('menu.submenu.editAdministrators'),
    },
    {
      key: SubmenuCategory.EDIT_CATALOGS,
      text: t('menu.submenu.editCatalogs'),
      hasInternalRouting: true,
    },
    {
      key: SubmenuCategory.DOWNLOAD_CATALOGS,
      text: t('menu.submenu.downloadCatalogs'),
    },
    {
      key: SubmenuCategory.ANONYMIZE_USERS,
      text: t('menu.submenu.anonymizeUsers'),
    },
    // refactor this one out once the whole app uses routing
    {
      key: SubmenuCategory.HIDDEN,
      text: 'hidden',
      hidden: true,
    },
  ]

  return (
    <>
      <Button
        className={clsx(style.MenuButton, {
          [style.menuButtonActive]: selected,
        })}
        onClick={() => {
          // main pane is same as edit group leader pane atm
          setShowFab(false)
          setActiveSubmenuItem(SubmenuCategory.EDIT_GROUP_LEADERS)
          setActivePanel(Panel.Admin)
        }}
      >
        <div className={clsx(style.menuButtonText)}>
          {t('menu.admin').toUpperCase()}
        </div>
      </Button>

      {selected &&
        items
          .filter((x) => !x.hidden)
          .map((cat) => (
            <Button
              key={cat.key}
              className={clsx(style.MenuButton, {
                [style.menuButtonActive]: activeSubmenuItem === cat.key,
              })}
              onClick={async () => {
                if (cat.hasInternalRouting) {
                  setActiveSubmenuItem(SubmenuCategory.HIDDEN)
                  await new Promise((resolve) => setTimeout(resolve, 50))
                }
                setActiveSubmenuItem(cat.key)
              }}
            >
              <span
                className={clsx(
                  style.menuButtonText,
                  style.menuButtonCategoryText
                )}
              >
                {cat.text}
              </span>
            </Button>
          ))}
    </>
  )
}

export { AdminMenu }
