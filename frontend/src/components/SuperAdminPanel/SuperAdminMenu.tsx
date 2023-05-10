import { Button } from '@mui/material'
import clsx from 'clsx'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel } from '../../types'
import { SubmenuCategory } from './SuperAdminPanel'

type SuperAdminMenuProps = {
  show: boolean
  selected: boolean
  setShowFab: Dispatch<SetStateAction<boolean>>
  style: any
  activeSubmenuItem: any
  setActiveSubmenuItem: any
  setActivePanel: any
}
const SuperAdminMenu = ({
  show,
  selected,
  setShowFab,
  style,
  activeSubmenuItem,
  setActiveSubmenuItem,
  setActivePanel,
}: SuperAdminMenuProps) => {
  const { t } = useTranslation()
  if (!show) return null

  const items = [
    {
      key: SubmenuCategory.EDIT_ORGANIZATIONS,
      text: t('menu.submenu.editOrganizations'),
    },
    {
      key: SubmenuCategory.EDIT_SUPER_ADMINS,
      text: t('menu.submenu.editSuperAdministrators'),
    },
    {
      key: SubmenuCategory.EDIT_ORGANIZATION_ADMINS,
      text: t('menu.submenu.editAdministrators'),
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
          setShowFab(false)
          setActiveSubmenuItem(SubmenuCategory.EDIT_ORGANIZATIONS)
          setActivePanel(Panel.SuperAdmin)
        }}
      >
        <div className={clsx(style.menuButtonText)}>
          {t('menu.superAdmin').toUpperCase()}
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

export { SuperAdminMenu }
