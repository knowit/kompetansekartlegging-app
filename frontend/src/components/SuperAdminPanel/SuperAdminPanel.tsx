import EditOrganizationAdmins from './EditOrganizationAdmins'
import EditOrganizations from './EditOrganizations'
import EditSuperAdmins from './EditSuperAdmins'

type SuperAdminPanelProps = {
  activeSubmenuItem: string
}

enum SubmenuCategory {
  HIDDEN = 'hidden',
  EDIT_ORGANIZATIONS = 'editOrganizations',
  EDIT_SUPER_ADMINS = 'editSuperAdmins',
  EDIT_ORGANIZATION_ADMINS = 'editOrganizationAdmins',
}

const SuperAdminPanel = ({ activeSubmenuItem }: SuperAdminPanelProps) => {
  return (
    <div>
      {activeSubmenuItem === SubmenuCategory.EDIT_ORGANIZATIONS && (
        <EditOrganizations />
      )}
      {activeSubmenuItem === SubmenuCategory.EDIT_SUPER_ADMINS && (
        <EditSuperAdmins />
      )}
      {activeSubmenuItem === SubmenuCategory.EDIT_ORGANIZATION_ADMINS && (
        <EditOrganizationAdmins />
      )}
    </div>
  )
}

export { SuperAdminPanel, SubmenuCategory }
