import IconButton from '@material-ui/core/IconButton'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from 'react-i18next'
import Table from '../mui/Table'
import commonStyles from './common.module.css'
import { getAttribute } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'

const Admin = (props: any) => {
  const { admin, deleteAdmin } = props
  const username = admin.Username
  const name = getAttribute(admin, 'name')
  const email = getAttribute(admin, 'email')
  const picture = getAttribute(admin, 'picture')

  return (
    <TableRow>
      <TableCell>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>
        <IconButton edge="end" onClick={() => deleteAdmin(admin)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

type AdminTableProps = {
  admins: any[]
  deleteAdmin: (user: any) => void
}

const AdminTable = ({ admins, deleteAdmin }: AdminTableProps) => {
  const { t } = useTranslation()

  return (
    <TableContainer className={commonStyles.tableContainer}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('email')}</TableCell>
            <TableCell>{t('username')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((gl: any) => (
            <Admin key={gl.Username} admin={gl} deleteAdmin={deleteAdmin} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AdminTable
