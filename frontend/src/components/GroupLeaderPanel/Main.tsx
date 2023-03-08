import React from 'react'

import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import GroupMembers from '../AdminPanel/GroupMembers'
import commonStyles from '../AdminPanel/common.module.css'
import { useTranslation } from 'react-i18next'

const Main = ({
  allAvailableUsersAnnotated,
  members,
  groupId,
  isError,
  isLoading,
  addMembersToGroup,
  deleteMember,
  showDeleteUserFromGroupDialog,
  setShowDeleteUserFromGroupDialog,
  memberToDelete,
  setMemberToDelete,
  deleteMemberConfirm,
  viewMember,
}: any) => {
  const { t } = useTranslation()
  return (
    <Container maxWidth="md" className={commonStyles.container}>
      {isError && <p>{t('errorOccured') + isError}</p>}
      {isLoading && <CircularProgress />}
      {!isError && !isLoading && allAvailableUsersAnnotated && (
        <>
          <Box margin={3} marginLeft={2}>
            <Typography variant="h5" component="h2" color="textPrimary">
              {t('menu.myGroup')}
            </Typography>
          </Box>
          <GroupMembers
            allUsers={allAvailableUsersAnnotated}
            members={members}
            addMembersToGroup={(users: any) =>
              addMembersToGroup(users, groupId)
            }
            deleteMember={(user: any) => deleteMember(user, groupId)}
            viewMember={viewMember}
            showLastAnsweredAt={true}
          />
        </>
      )}
      <DeleteUserFromGroupDialog
        open={showDeleteUserFromGroupDialog}
        onCancel={() => setShowDeleteUserFromGroupDialog(false)}
        onExited={() => setMemberToDelete(null)}
        onConfirm={deleteMemberConfirm}
        user={memberToDelete && memberToDelete.user}
        roleName={t('theGroup')}
        disableRoleSuffix
      />
    </Container>
  )
}

export default Main
