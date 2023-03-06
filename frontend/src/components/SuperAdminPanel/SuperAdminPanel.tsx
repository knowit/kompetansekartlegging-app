import React from 'react'

import EditOrganizations from './EditOrganizations'
import EditOrganizationAdmins from './EditOrganizationAdmins'
import EditSuperAdmins from './EditSuperAdmins'
import style from '../AdminPanel/AdminPanel.module.css'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

type SuperAdminPanelProps = {
  activeSubmenuItem: string
}

enum SubmenuCategory {
  MAIN,
  HIDDEN,
  EDIT_ORGANIZATIONS,
  EDIT_SUPER_ADMINS,
  EDIT_ORGANIZATION_ADMINS,
}

const activeSubmenuItemToSubmenuCategory = (
  activeCategory: string
): SubmenuCategory => {
  switch (activeCategory) {
    case i18next.t('menu.submenu.editOrganizations'):
      return SubmenuCategory.EDIT_ORGANIZATIONS
    case i18next.t('menu.submenu.editSuperAdministrators'):
      return SubmenuCategory.EDIT_SUPER_ADMINS
    case i18next.t('menu.submenu.editOrganizationAdministrators'):
      return SubmenuCategory.EDIT_ORGANIZATION_ADMINS
    case 'hidden':
      return SubmenuCategory.HIDDEN
    default:
      return SubmenuCategory.MAIN
  }
}

const SuperAdminPanel = ({ activeSubmenuItem }: SuperAdminPanelProps) => {
  useTranslation()

  const category = activeSubmenuItemToSubmenuCategory(activeSubmenuItem)

  return (
    <div className={style.container}>
      {(category === SubmenuCategory.MAIN ||
        category === SubmenuCategory.EDIT_ORGANIZATIONS) && (
        <EditOrganizations />
      )}
      {category === SubmenuCategory.EDIT_SUPER_ADMINS && <EditSuperAdmins />}
      {category === SubmenuCategory.EDIT_ORGANIZATION_ADMINS && (
        <EditOrganizationAdmins />
      )}
    </div>
  )
}

export { SuperAdminPanel }
