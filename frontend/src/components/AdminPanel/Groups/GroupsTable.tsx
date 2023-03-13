import { useState } from 'react'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import Table from '../../mui/Table'
import TableRow from '../../mui/TableRow'
import commonStyles from '../common.module.css'
import { compareByName } from '../helpers'
import { Group } from './Group'

export const GroupsTable = ({
  groups,
  users,
  allAvailableUsersAnnotated,
  groupLeaders,
  deleteGroup,
  editGroup,
  addMembersToGroup,
  deleteMember,
  showLastAnsweredAt,
}: any) => {
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
            <TableCell>Detaljer</TableCell>
            <TableCell>Gruppeleder</TableCell>
            <TableCell>Antall gruppemedlemmer</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {groupsAnnotated.map((g: any) => (
            <Group
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
