import { getAttribute } from '../AdminPanel/helpers'
const getGroupMenuitems = (members: any) =>
  members.map((m: any) => ({
    text: getAttribute(m, 'name'),
    key: m.Username,
  }))

export default getGroupMenuitems
