import React, { useState, useEffect } from "react";
import style from "./GroupLeaderPanel.module.css";

import { Group } from "../../API";
import useApiGet from "../AdminPanel/useApiGet";
import {
    listAllUsersInOrganization as listAllAvailableUsersInOrganization,
    listAllUsers as listAllAvailableUsers,
    listGroupLeadersInOrganization,
} from "../AdminPanel/adminApi";
import {
    listAllGroups,
    listAllUsers,
    addUserToGroup,
    updateUserGroup,
    removeUserFromGroup,
} from "../AdminPanel/groupsApi";

import Main from "./Main";
import GroupMember from "./GroupMember";
import { ORGANIZATION_ID_ATTRIBUTE } from "../../constants";
import { useSelector } from "react-redux";
import {
    selectGroupLeaderCognitoGroupName,
    selectUserState,
} from "../../redux/User";
import { listAllFormDefinitionsForLoggedInUser } from "../AdminPanel/catalogApi";
import { compareByCreatedAt } from "../AdminPanel/helpers";
import { getLatestUserFormUpdatedAtForUser } from "../../helperFunctions";

const GroupLeaderPanel = ({
    members,
    setMembers,
    activeSubmenuItem,
    setActiveSubmenuItem,
}: any) => {
    const userState = useSelector(selectUserState);

    const {
        result: formDefinitions,
        error: formDefinitionsError,
        loading: formDefinitionsLoading,
    } = useApiGet({
        getFn: listAllFormDefinitionsForLoggedInUser,
        cmpFn: compareByCreatedAt,
    });

    const {
        result: groups,
        error: groupsError,
        loading: groupsLoading,
    } = useApiGet({
        getFn: listAllGroups,
    });
    const {
        result: users,
        error: usersError,
        loading: usersLoading,
        refresh: refreshAllUsers,
    } = useApiGet({
        getFn: listAllUsers,
    });
    const {
        result: groupLeaders,
        error: groupLeadersError,
        loading: groupLeadersLoading,
    } = useApiGet({
        getFn: listGroupLeadersInOrganization,
        params: userState.organizationID,
    });
    const {
        result: allAvailableUsers,
        error: allAvailableUsersError,
        loading: allAvailableUsersLoading,
    } = useApiGet({
        getFn: listAllAvailableUsersInOrganization,
        params: userState.organizationID,
    });

    const group = groups?.find(
        (g: Group) => g.groupLeaderUsername === userState.userName
    );
    const groupId = group?.id;
    const [showDeleteUserFromGroupDialog, setShowDeleteUserFromGroupDialog] =
        useState<boolean>(false);
    const [memberToDelete, setMemberToDelete] = useState<any>();
    const deleteMember = (user: any, group: any) => {
        setMemberToDelete({ user, group });
        setShowDeleteUserFromGroupDialog(true);
    };
    const deleteMemberConfirm = async () => {
        await removeUserFromGroup(
            memberToDelete.user.Username,
            memberToDelete.group.id
        );
        setShowDeleteUserFromGroupDialog(false);
        refreshAllUsers();
    };

    const addMembersToGroup = async (selectedUsers: any[], groupId: string) => {
        await Promise.all(
            selectedUsers.map((u: any) => {
                const userHasGroup = users.some(
                    (us: any) => us.id === u.Username
                );
                if (userHasGroup) {
                    return updateUserGroup(u.Username, groupId);
                } else {
                    return addUserToGroup(
                        u.Username,
                        groupId,
                        userState.organizationID
                    );
                }
            })
        );
        refreshAllUsers();
    };

    const isLoading =
        groupsLoading ||
        usersLoading ||
        allAvailableUsersLoading ||
        groupLeadersLoading ||
        formDefinitionsLoading;
    const isError =
        groupsError ||
        usersError ||
        allAvailableUsersError ||
        groupLeadersError ||
        formDefinitionsError;

    const [allAvailableUsersAnnotated, setAllAvailableUsersAnnotated] =
        useState<any[]>([]);

    const addLastAnsweredAt = async (users: any[]) => {
        if (users.length > 0 && formDefinitions.length > 0) {
            const activeFormDefId = formDefinitions[0].id;

            const usersAnnotated = await Promise.all(users.map(async (u: any) => {
                const user = users.find((us: any) => us.Username === u.Username);
                if (user) {
                    const lastAnsweredAt = await getLatestUserFormUpdatedAtForUser(user.Username, activeFormDefId);
                    return { ...user, lastAnsweredAt: lastAnsweredAt };
                } else {
                    return u;
                }
            }));
            setAllAvailableUsersAnnotated(usersAnnotated);
        }
    };

    useEffect(() => {
        if (allAvailableUsers && groupLeaders && groups && users && formDefinitions) {
            const annotated = allAvailableUsers.map((u: any) => {
                const user = users.find((us: any) => us.id === u.Username);
                if (user) {
                    const groupId = user.groupID;
                    const group = groups.find((g: any) => g.id === groupId);
                    const groupLeaderUsername = group?.groupLeaderUsername;
                    const groupLeader = groupLeaders?.find(
                        (gl: any) => gl.Username === groupLeaderUsername
                    );
                    return { ...u, groupId, groupLeader };
                } else {
                    return u;
                }
            });
            if (formDefinitions.length > 0) {
                addLastAnsweredAt(annotated);
            } else {
                setAllAvailableUsersAnnotated(annotated);
            }
        }
    }, [allAvailableUsers, groupLeaders, groups, users, formDefinitions]);

    useEffect(() => {
        if (allAvailableUsersAnnotated) {
            setMembers(
                allAvailableUsersAnnotated.filter(
                    (u: any) => groupId && u.groupId === groupId
                )
            );
        }
    }, [allAvailableUsersAnnotated, setMembers, groupId]);

    return (
        <div className={style.container}>
            {activeSubmenuItem === "MAIN" ? (
                <Main
                    allAvailableUsersAnnotated={allAvailableUsersAnnotated}
                    members={members}
                    groupId={groupId}
                    isError={isError}
                    isLoading={isLoading}
                    addMembersToGroup={addMembersToGroup}
                    deleteMember={deleteMember}
                    setShowDeleteUserFromGroupDialog={
                        setShowDeleteUserFromGroupDialog
                    }
                    showDeleteUserFromGroupDialog={
                        showDeleteUserFromGroupDialog
                    }
                    memberToDelete={memberToDelete}
                    setMemberToDelete={setMemberToDelete}
                    deleteMemberConfirm={deleteMemberConfirm}
                    viewMember={(id: string) => setActiveSubmenuItem(id)}
                />
            ) : (
                <GroupMember members={members} userId={activeSubmenuItem} />
            )}
        </div>
    );
};

export { GroupLeaderPanel };
