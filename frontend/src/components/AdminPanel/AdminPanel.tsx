import React from 'react'

import EditGroupLeaders from './EditGroupLeaders'
import EditAdmins from './EditAdmins'
import EditGroups from './EditGroups'
import EditCatalogsRouter from './EditCatalogsRouter'
import style from './AdminPanel.module.css'
import DownloadExcel from './DownloadExcel'

type AdminPanelProps = {
  activeSubmenuItem: string
}

enum SubmenuCategory {
  HIDDEN = 'hidden',
  EDIT_GROUP_LEADERS = 'editGroupLeaders',
  EDIT_GROUPS = 'editGroups',
  EDIT_ADMINS = 'editAdmins',
  EDIT_CATALOGS = 'editCatalogs',
  DOWNLOAD_CATALOGS = 'downloadCatalogs',
}

const AdminPanel = ({ activeSubmenuItem }: AdminPanelProps) => {
  return (
    <div className={style.container}>
      {activeSubmenuItem === SubmenuCategory.EDIT_GROUP_LEADERS && (
        <EditGroupLeaders />
      )}
      {activeSubmenuItem === SubmenuCategory.EDIT_ADMINS && <EditAdmins />}
      {activeSubmenuItem === SubmenuCategory.EDIT_GROUPS && (
        <EditGroups showLastAnsweredAt={false} />
      )}
      {activeSubmenuItem === SubmenuCategory.EDIT_CATALOGS && (
        <EditCatalogsRouter />
      )}
      {activeSubmenuItem === SubmenuCategory.DOWNLOAD_CATALOGS && (
        <DownloadExcel />
      )}
    </div>
  )
}

export { AdminPanel, SubmenuCategory }
