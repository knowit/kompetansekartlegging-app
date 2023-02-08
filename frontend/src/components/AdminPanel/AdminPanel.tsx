import { useEffect } from 'react'

import { deleteCategory } from '../../api/categories'
import style from './AdminPanel.module.css'
import EditAdmins from './EditAdmins'
import EditCatalogsRouter from './EditCatalogsRouter'
import EditGroupLeaders from './EditGroupLeaders'
import EditGroups from './EditGroups'

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
    case 'Rediger gruppeledere':
      return SubmenuCategory.EDIT_GROUP_LEADERS
    case 'Rediger grupper':
      return SubmenuCategory.EDIT_GROUPS
    case 'Rediger administratorer':
      return SubmenuCategory.EDIT_ADMINS
    case 'Rediger katalog':
      return SubmenuCategory.EDIT_CATALOGS
    case 'hidden':
      return SubmenuCategory.HIDDEN
    default:
      return SubmenuCategory.MAIN
  }
}

const AdminPanel = ({ activeSubmenuItem }: AdminPanelProps) => {
  const category = activeSubmenuItemToSubmenuCategory(activeSubmenuItem)

  useEffect(() => {
    const fetchApi = async () => {
      // const res = await getCategoryById('af3764b5-5d9f-448c-beb1-7e8c7d8e80e5')
      // const res = await apiDELETE('/categories/:categoryId', {
      //   queryStringParameters: {
      //     categoryId: CAT_ID,
      //   },
      // })
      //const res = await getAllCategories()
      // const res = await getAllUsersInGroup(
      //   'f861818a-8019-4207-b8c9-026404d988e5'
      // )
      // const res = await createGroup({
      //   groupleaderusername: 'testing123',
      //   orgid: 'knowitobjectnet',
      // })
      // const res = await addUserToGroup('826d06f9-9d84-4cfe-94d1-901ccc4988c9', {
      //   id: 'testing123',
      //   orgid: 'knowitobjectnet',
      // })
      // const res = await updateGroupLeader(
      //   '826d06f9-9d84-4cfe-94d1-901ccc4988c9',
      //   'testing123'
      // )
      // const res = await deleteGroup('7dac7072-2452-46bb-9913-d8df4140399b')
      // const res = await deleteUserFromGroup('testing123')
    }

    fetchApi()
  }, [])

  return (
    <div className={style.container}>
      {(category === SubmenuCategory.MAIN ||
        category === SubmenuCategory.EDIT_GROUP_LEADERS) && (
        <EditGroupLeaders />
      )}
      {category === SubmenuCategory.EDIT_ADMINS && <EditAdmins />}
      {category === SubmenuCategory.EDIT_GROUPS && <EditGroups />}
      {category === SubmenuCategory.EDIT_CATALOGS && <EditCatalogsRouter />}
    </div>
  )
}

export { AdminPanel }
