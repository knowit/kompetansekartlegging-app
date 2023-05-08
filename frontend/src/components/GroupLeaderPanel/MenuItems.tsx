import { getAttribute } from '../AdminPanel/helpers'
const getGroupLeaderItems = (members: any) => {
  const items = members.map((m: any) => ({
    text: getAttribute(m, 'name'),
    key: m.Username,
  }))

  items.unshift({ text: 'menu.overview', key: 'MAIN' })
  console.log(items)
  return items
}
export default getGroupLeaderItems
