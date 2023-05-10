import { TableCell, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IUserAnnotated } from '../../../../api/admin/types'
import { getCognitoUser } from '../../../../api/cognito'
import PictureAndNameCell from '../../PictureAndNameCell'
import { getCognitoAttribute } from '../utils'

interface UserTableRowProps {
  user: IUserAnnotated
  selected: boolean
  setSelectedUser: (user: IUserAnnotated) => void
}

const UserTableRow = ({
  user,
  selected,
  setSelectedUser,
}: UserTableRowProps) => {
  const { t } = useTranslation()
  const name = getCognitoAttribute(user.cognito_attributes, 'name')
  const picture = getCognitoAttribute(user.cognito_attributes, 'picture')
  const hasGroup = !!user.group_leader_username

  const { data: groupLeader } = useQuery({
    queryKey: ['get_group_leader', user.group_leader_username],
    queryFn: () => getCognitoUser(user.group_leader_username),
    enabled: hasGroup,
  })
  let groupLeaderName

  useEffect(() => {
    if (groupLeader && groupLeader?.data && groupLeader.data.UserAttributes) {
      groupLeaderName = getCognitoAttribute(
        groupLeader.data.UserAttributes,
        'name'
      )
    }
  }, [groupLeader])

  return (
    <>
      <TableRow hover selected={selected} onClick={() => setSelectedUser(user)}>
        <TableCell>
          <PictureAndNameCell name={name} picture={picture} />
        </TableCell>
        <TableCell>{groupLeaderName || t('myGroup.noGroupLeader')}</TableCell>
      </TableRow>
    </>
  )
}

export default UserTableRow
