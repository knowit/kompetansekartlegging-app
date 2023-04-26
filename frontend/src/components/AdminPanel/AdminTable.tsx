import IconButton from '@mui/material/IconButton'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Table } from '@mui/material'
import { ORGANIZATION_ID_ATTRIBUTE } from '../../constants'
import { getAttribute } from './helpers'
import PictureAndNameCell from './PictureAndNameCell'

const Admin = (props: any) => {
  const { admin, deleteAdmin, showOrgId } = props
  const username = admin.Username
  const name = getAttribute(admin, 'name')
  const email = getAttribute(admin, 'email')
  const picture = getAttribute(admin, 'picture')
  const orgId = getAttribute(admin, ORGANIZATION_ID_ATTRIBUTE)

  return (
    <TableRow>
      <TableCell>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      {showOrgId && <TableCell>{orgId}</TableCell>}
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
  showOrgId?: boolean
}

const AdminTable = ({ admins, deleteAdmin, showOrgId }: AdminTableProps) => {
  const { t } = useTranslation()

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('employee')}</TableCell>
            <TableCell>{t('email')}</TableCell>
            <TableCell>{t('username')}</TableCell>
            {showOrgId && <TableCell>{t('organizationID')}</TableCell>}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((gl: any) => (
            <Admin
              key={gl.Username}
              admin={gl}
              deleteAdmin={deleteAdmin}
              showOrgId={showOrgId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AdminTable
