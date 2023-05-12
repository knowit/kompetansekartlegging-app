import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { IUserAnnotated } from '../../../../api/admin/types'
import { deleteUserFromGroup } from '../../../../api/groups'
import { getMostRecentQuestionAnswerForUser } from '../../../../api/question-answers'
import PictureAndNameCell from '../../PictureAndNameCell'
import { getAttribute } from '../../helpers'

interface GroupRowProps {
  user: IUserAnnotated
  viewMember?: (username: string) => void
  showLastAnsweredAt: boolean
}

/**
 * TODO: Hente info om når brukeren sist svarte på spørsmål
 */

export const GroupRow = ({
  user,
  viewMember,
  showLastAnsweredAt,
}: GroupRowProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')

  const onClick = () => {
    if (viewMember) viewMember(user.username)
  }

  const { data } = useQuery({
    queryKey: ['get_most_recent_question_answer', user.username],
    queryFn: () => getMostRecentQuestionAnswerForUser(user.username),
    enabled: showLastAnsweredAt,
  })

  //TODO: invalidate get members query for denne gruppen
  const deleteUserFromGroupMutation = useMutation({
    mutationFn: () => deleteUserFromGroup({ username: user.username }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_get_all_users'] })
    },
  })

  const formatDate = (date: Date) => {
    const day = date.getDay()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  return (
    <TableRow hover style={{ cursor: viewMember ? 'pointer' : 'default' }}>
      <TableCell onClick={onClick}>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell onClick={onClick}>{email}</TableCell>
      {showLastAnsweredAt && data !== undefined && data.data !== null && (
        <TableCell>{formatDate(data.data.updated_at)}</TableCell>
      )}
      <TableCell>
        <Button
          endIcon={<DeleteIcon />}
          onClick={() => deleteUserFromGroupMutation.mutate}
          style={{ fontStyle: 'italic' }}
        >
          {t('myGroup.removeFromGroup')}
        </Button>
      </TableCell>
    </TableRow>
  )
}
