import DeleteIcon from '@mui/icons-material/Delete'
import { Button, TableCell, TableRow } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { i18nDateToLocaleDateString } from '../../../../i18n/i18n'
import PictureAndNameCell from '../../PictureAndNameCell'
import { getAttribute } from '../../helpers'

export const GroupRow = ({
  user,
  deleteMember,
  viewMember,
  showLastAnsweredAt,
}: any) => {
  const { t } = useTranslation()

  const name = getAttribute(user, 'name')
  const email = getAttribute(user, 'email')
  const picture = getAttribute(user, 'picture')
  const formLastAnsweredAt =
    user.lastAnsweredAt == null
      ? t('notAnswered')
      : i18nDateToLocaleDateString(user.lastAnsweredAt)

  const onClick = () => {
    if (viewMember) viewMember(user.Username)
  }

  return (
    <TableRow hover style={{ cursor: viewMember ? 'pointer' : 'default' }}>
      <TableCell onClick={onClick}>
        <PictureAndNameCell name={name} picture={picture} />
      </TableCell>
      <TableCell onClick={onClick}>{email}</TableCell>
      {showLastAnsweredAt && <TableCell>{formLastAnsweredAt}</TableCell>}
      <TableCell>
        <Button
          endIcon={<DeleteIcon />}
          onClick={() => deleteMember(user)}
          style={{ fontStyle: 'italic' }}
        >
          {t('myGroup.removeFromGroup')}
        </Button>
      </TableCell>
    </TableRow>
  )
}
