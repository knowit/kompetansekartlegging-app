import { ListItemButton, ListItemText } from '@mui/material'

import { useTranslation } from 'react-i18next'
import { SubmenuCategory } from './AdminPanel'
import { Panel } from '../../types'
import { MenuItem } from '../MenuItem'

type AdminMenuProps = {
  show: boolean
  activeSubmenuItem: any
  setActiveSubmenuItem: any
  setActivePanel: any
}
const AdminMenu = ({
  show,
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
    // refactor this one out once the whole app uses routing
    {
      key: SubmenuCategory.HIDDEN,
      text: 'hidden',
      hidden: true,
    },
  ]

  const content = items
    .filter((x) => !x.hidden)
    .map((cat) => (
      <ListItemButton
        key={cat.key}
        onClick={async () => {
          if (cat.hasInternalRouting) {
            setActiveSubmenuItem(SubmenuCategory.HIDDEN)
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
          setActivePanel(Panel.Admin)
          setActiveSubmenuItem(cat.key)
        }}
      >
        <ListItemText primary={cat.text} />
      </ListItemButton>
    ))

  return (
    <MenuItem
      panelType={Panel.Admin}
      text={t('menu.admin')}
      setActivePanel={setActivePanel}
      show
      selected
      content={content}
      alert={0}
    />
  )
}

export { AdminMenu }
