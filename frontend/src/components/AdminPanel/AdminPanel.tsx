import style from './AdminPanel.module.css'
import DownloadExcel from './DownloadExcel'
import EditAdmins from './EditAdmins'
import EditCatalogsRouter from './EditCatalogsRouter'
import EditGroupLeaders from './EditGroupLeaders'
import EditGroups from './EditGroups'
import AnonymizeUsers from './AnonymizeUsers'

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
  ANONYMIZE_USERS = 'anonymizeUsers',
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
      {activeSubmenuItem === SubmenuCategory.ANONYMIZE_USERS && (
        <AnonymizeUsers />
      )}
    </div>
  )
}

export { AdminPanel, SubmenuCategory }
