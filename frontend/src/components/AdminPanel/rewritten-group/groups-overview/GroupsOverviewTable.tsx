import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { compareByName } from '../../helpers'
import { GroupsOverviewRow } from './GroupsOverviewRow'
import commonStyles from './common.module.css'

export const GroupsOverviewTable = ({
  groups,
  allAvailableUsersAnnotated,
  groupLeaders,
  deleteGroup,
  editGroup,
  addMembersToGroup,
  deleteMember,
  showLastAnsweredAt,
}: any) => {
  const { t } = useTranslation()

  const [openId, setOpenId] = useState<string>('')
  const setOpenGroup = (groupId: string) => {
    if (openId === groupId) {
      setOpenId('')
    } else {
      setOpenId(groupId)
    }
  }

  const groupsAnnotated = groups
    .map((g: any) => {
      const groupLeader = groupLeaders.find(
        (gl: any) => gl.Username === g.groupLeaderUsername
      )
      const members = allAvailableUsersAnnotated.filter(
        (u: any) => u.groupId === g.id
      )
      return { ...g, groupLeader, members }
    })
    .sort((g1: any, g2: any) => compareByName(g1?.groupLeader, g2?.groupLeader))

  return (
    <TableContainer
      className={commonStyles.tableContainer}
      style={{ overflowX: 'hidden' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.editGroups.details')}</TableCell>
            <TableCell>{t('groupLeader')}</TableCell>
            <TableCell>{t('admin.editGroups.numberOfGroupMembers')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {groupsAnnotated.map((g: any) => (
            <GroupsOverviewRow
              key={g.id}
              group={g}
              users={allAvailableUsersAnnotated}
              deleteGroup={deleteGroup}
              open={g.id === openId}
              setOpenId={setOpenGroup}
              addMembersToGroup={addMembersToGroup}
              deleteMember={deleteMember}
              editGroup={editGroup}
              showLastAnsweredAt={showLastAnsweredAt}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
