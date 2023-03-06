import React from 'react'

import EditGroupLeaders from './EditGroupLeaders'
import EditAdmins from './EditAdmins'
import EditGroups from './EditGroups'
import EditCatalogsRouter from './EditCatalogsRouter'
import style from './AdminPanel.module.css'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

type AdminPanelProps = {
  activeSubmenuItem: string
}

enum SubmenuCategory {
  MAIN,
  HIDDEN,
  EDIT_GROUP_LEADERS,
  EDIT_GROUPS,
  EDIT_ADMINS,
  EDIT_CATALOGS,
}

const activeSubmenuItemToSubmenuCategory = (
  activeCategory: string
): SubmenuCategory => {
  switch (activeCategory) {
    case i18next.t('menu.submenu.editGroupLeaders'):
      return SubmenuCategory.EDIT_GROUP_LEADERS
    case i18next.t('menu.submenu.editGroups'):
      return SubmenuCategory.EDIT_GROUPS
    case i18next.t('menu.submenu.editAdministrators'):
      return SubmenuCategory.EDIT_ADMINS
    case i18next.t('menu.submenu.editCatalogs'):
      return SubmenuCategory.EDIT_CATALOGS
    case 'hidden':
      return SubmenuCategory.HIDDEN
    default:
      return SubmenuCategory.MAIN
  }
}

const AdminPanel = ({ activeSubmenuItem }: AdminPanelProps) => {
  useTranslation()
  const category = activeSubmenuItemToSubmenuCategory(activeSubmenuItem)

  return (
    <div className={style.container}>
      {(category === SubmenuCategory.MAIN ||
        category === SubmenuCategory.EDIT_GROUP_LEADERS) && (
        <EditGroupLeaders />
      )}
      {category === SubmenuCategory.EDIT_ADMINS && <EditAdmins />}
      {category === SubmenuCategory.EDIT_GROUPS && (
        <EditGroups showLastAnsweredAt={false} />
      )}
      {category === SubmenuCategory.EDIT_CATALOGS && <EditCatalogsRouter />}
    </div>
  )
}

export { AdminPanel }
