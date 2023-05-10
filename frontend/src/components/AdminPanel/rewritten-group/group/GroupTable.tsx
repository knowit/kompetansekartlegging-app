import { useState } from 'react'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { TableBody, TableCell, TableContainer, TableHead } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { IUserAnnotated } from '../../../../api/admin/types'
import Button from '../../../mui/Button'
import Table from '../../../mui/Table'
import TableRow from '../../../mui/TableRow'
import AddMemberToGroupDialog from '../../AddMemberToGroupDialog'
import { GroupRow } from './GroupRow'

interface GroupTableProps {
  members: IUserAnnotated
}

export const GroupTable = ({
  members,
  addMembersToGroup,
  deleteMember,
  viewMember,
  showLastAnsweredAt,
}) => {
  const { t } = useTranslation()

  const [open, setOpen] = useState<boolean>(false)
  const onConfirm = (users: any[]) => {
    addMembersToGroup(users)
    setOpen(false)
  }

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('employee')}</TableCell>
              <TableCell>{t('email')}</TableCell>
              {showLastAnsweredAt && (
                <TableCell>{t('myGroup.lastAnswered')}</TableCell>
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((u: any) => (
              <GroupRow
                key={u.Username}
                user={u}
                deleteMember={deleteMember}
                viewMember={viewMember}
                showLastAnsweredAt={showLastAnsweredAt}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PersonAddIcon />}
        onClick={() => setOpen(true)}
      >
        {t('myGroup.addMembers')}
      </Button>
      <AddMemberToGroupDialog
        open={open}
        onCancel={() => setOpen(false)}
        members={members}
        onConfirm={onConfirm}
      />
    </>
  )
}
