import { Button } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { SubmenuCategory } from './SuperAdminPanel'
import React from 'react'
import { Panel } from '../../types'

type SuperAdminMenuProps = {
  show: boolean
  selected: boolean
  setShowFab: React.Dispatch<React.SetStateAction<boolean>>
  activeSubmenuItem: any
  setActiveSubmenuItem: any
  setActivePanel: any
}
const SuperAdminMenu = ({
  show,
  selected,
  setShowFab,
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
      text: t('menu.submenu.editOrganizationAdministrators'),
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
        onClick={() => {
          setShowFab(false)
          setActiveSubmenuItem(SubmenuCategory.EDIT_ORGANIZATIONS)
          setActivePanel(Panel.SuperAdmin)
        }}
      >
        <div>{t('menu.superAdmin').toUpperCase()}</div>
      </Button>

      {selected &&
        items
          .filter((x) => !x.hidden)
          .map((cat) => (
            <Button
              key={cat.key}
              onClick={async () => {
                setActiveSubmenuItem(cat.key)
              }}
            >
              <span>{cat.text}</span>
            </Button>
          ))}
    </>
  )
}

export { SuperAdminMenu }
