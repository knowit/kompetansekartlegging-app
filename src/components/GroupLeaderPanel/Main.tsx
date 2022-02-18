import React from "react";

import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import DeleteUserFromGroupDialog from "../AdminPanel/DeleteUserFromGroupDialog";
import GroupMembers from "../AdminPanel/GroupMembers";
import commonStyles from "../AdminPanel/common.module.css";

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
    return (
        <Container maxWidth="md" className={commonStyles.container}>
            {isError && <p>An error occured: {isError}</p>}
            {isLoading && <CircularProgress />}
            {!isError && !isLoading && allAvailableUsersAnnotated && (
                <>
                    <Box margin={3} marginLeft={2}>
                        <Typography
                            variant="h5"
                            component="h2"
                            color="textPrimary"
                        >
                            Min gruppe
                        </Typography>
                    </Box>
                    <GroupMembers
                        allUsers={allAvailableUsersAnnotated}
                        members={members}
                        addMembersToGroup={(users: any) =>
                            addMembersToGroup(users, groupId)
                        }
                        deleteMember={(user: any) =>
                            deleteMember(user, groupId)
                        }
                        viewMember={viewMember}
                    />
                </>
            )}
            <DeleteUserFromGroupDialog
                open={showDeleteUserFromGroupDialog}
                onCancel={() => setShowDeleteUserFromGroupDialog(false)}
                onExited={() => setMemberToDelete(null)}
                onConfirm={deleteMemberConfirm}
                user={memberToDelete && memberToDelete.user}
                roleName="gruppen"
                disableRoleSuffix
            />
        </Container>
    );
};

export default Main;
