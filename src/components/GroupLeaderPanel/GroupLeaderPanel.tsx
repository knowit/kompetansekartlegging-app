import React, { useState, useEffect } from "react";
import style from "./GroupLeaderPanel.module.css";

import { Group } from "../../API";
import useApiGet from "../AdminPanel/useApiGet";
import {
    listAllUsersInOrganization as listAllAvailableUsersInOrganization,
    listAllUsers as listAllAvailableUsers,
    listGroupLeaders,
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
import {ORGANIZATION_ID_ATTRIBUTE} from "../../constants";
import {useSelector} from 'react-redux';
import {selectGroupLeaderCognitoGroupName, selectUserState} from '../../redux/User';

const GroupLeaderPanel = ({
    members,
    setMembers,
    activeSubmenuItem,
    setActiveSubmenuItem
}: any) => {

    const userState = useSelector(selectUserState);

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
        getFn: listGroupLeaders,
    });
    const {
        result: allAvailableUsers,
        error: allAvailableUsersError,
        loading: allAvailableUsersLoading,
    } = useApiGet({
        getFn: listAllAvailableUsersInOrganization,
        params: userState.organizationID
    });

    const group = groups?.find(
        (g: Group) => g.groupLeaderUsername === userState.userName
    );
    const groupId = group?.id;
    const [
        showDeleteUserFromGroupDialog,
        setShowDeleteUserFromGroupDialog,
    ] = useState<boolean>(false);
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
                    return addUserToGroup(u.Username, groupId, userState.organizationID);
                }
            })
        );
        refreshAllUsers();
    };

    const isLoading =
        groupsLoading ||
        usersLoading ||
        allAvailableUsersLoading ||
        groupLeadersLoading;
    const isError =
        groupsError ||
        usersError ||
        allAvailableUsersError ||
        groupLeadersError;

    const [
        allAvailableUsersAnnotated,
        setAllAvailableUsersAnnotated,
    ] = useState<any[]>([]);

    useEffect(() => {
        if (allAvailableUsers && groupLeaders && groups && users) {
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
            setAllAvailableUsersAnnotated(annotated);
        }
    }, [allAvailableUsers, groupLeaders, groups, users]);

    useEffect(() => {
        if (allAvailableUsersAnnotated) {
            setMembers(
                allAvailableUsersAnnotated.filter(
                    (u: any) => u.groupId === groupId
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
