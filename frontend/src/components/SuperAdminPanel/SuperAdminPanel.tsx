import style from '../AdminPanel/AdminPanel.module.css'
import EditOrganizationAdmins from './EditOrganizationAdmins'
import EditOrganizations from './EditOrganizations'
import EditSuperAdmins from './EditSuperAdmins'

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
    case 'Rediger organisasjoner':
      return SubmenuCategory.EDIT_ORGANIZATIONS
    case 'Rediger super-administratorer':
      return SubmenuCategory.EDIT_SUPER_ADMINS
    case 'Rediger organisasjon-administratorer':
      return SubmenuCategory.EDIT_ORGANIZATION_ADMINS
    case 'hidden':
      return SubmenuCategory.HIDDEN
    default:
      return SubmenuCategory.MAIN
  }
}

const SuperAdminPanel = ({ activeSubmenuItem }: SuperAdminPanelProps) => {
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
