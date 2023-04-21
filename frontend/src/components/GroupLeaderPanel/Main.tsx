import Box from '@mui/material/Box'
import CenteredCircularProgress from '../CenteredCircularProgress'
import DeleteUserFromGroupDialog from '../AdminPanel/DeleteUserFromGroupDialog'
import GroupMembers from '../AdminPanel/GroupMembers'
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
    <>
      {isError && <p>{t('errorOccured') + isError}</p>}
      {isLoading && <CenteredCircularProgress />}
      {!isError && !isLoading && allAvailableUsersAnnotated && (
        <>
          <h1>{t('menu.myGroup')}</h1>
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
        roleName={t('groupDefiniteForm')}
        disableRoleSuffix
      />
    </>
  )
}

export default Main
