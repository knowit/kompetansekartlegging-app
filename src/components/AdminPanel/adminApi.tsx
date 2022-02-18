import { API, Auth,  } from "aws-amplify";
import { ADMIN_COGNITOGROUP_SUFFIX, GROUPLEADER_COGNITOGROUP_SUFFIX } from '../../constants';



export interface Response<T> {
    result: T;
}

export interface Failure {
    error: string;
}

export type ApiResponse<T> = Response<T> | Failure;

export const removeUserFromGroup = async (
    groupname: string,
    username: string
): Promise<ApiResponse<any>> => {
    let apiName = "AdminQueries";
    let path = "/removeUserFromGroup";
    let myInit = {
        body: {
            groupname,
            username,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `${(await Auth.currentSession())
                .getAccessToken()
                .getJwtToken()}`,
        },
    };

    try {
        await API.post(apiName, path, myInit);
        return { result: `Removed '${username}' from '${groupname}'.` };
    } catch (e) {
        return {
            error: `Could not remove user '${username}' from group '${groupname}'.`,
        };
    }
};

const removeGroupLeader = async (user: any, org: any) =>
    await removeUserFromGroup(`${org}0groupLeader`, user.Username);
const removeAdmin = async (user: any, org: any) =>
    await removeUserFromGroup(`${org}0admin`, user.Username);

export const addUserToGroup = async (
    groupname: string,  
    username: string
): Promise<ApiResponse<any>> => {
    let apiName = "AdminQueries";
    let path = "/addUserToGroup";
    let myInit = {
        body: {
            groupname,
            username,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `${(await Auth.currentSession())
                .getAccessToken()
                .getJwtToken()}`,
        },
    };

    try {
        await API.post(apiName, path, myInit);
        return { result: `Added '${username}' to '${groupname}'.` };
    } catch (e) {
        return {
            error: `Could not add user '${username}' to group '${groupname}'.`,
        };
    }
};

const listUsersInGroup = async (
    groupname: string
): Promise<ApiResponse<any[]>> => {
    let apiName = "AdminQueries";
    let path = "/listUsersInGroup";
    let myInit: any = {
        queryStringParameters: {
            groupname,
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: `${(await Auth.currentSession())
                .getAccessToken()
                .getJwtToken()}`,
        },
    };

    try {
        let response = await API.get(apiName, path, myInit);
        console.log(response);
        const Users: any[] = [];
        let nextToken = (response.NextToken) ? response.NextToken : null;
        Users.push(...response.Users);
        while (nextToken) {
            myInit.queryStringParameters["token"] = nextToken;
            response = await API.get(apiName, path, myInit);
            Users.push(...response.Users);
            if (response.NextToken && response.NextToken != nextToken) {
                nextToken = response.NextToken;
            } else {
                nextToken = null
            }
        // nextToken = () ? response.NextToken : null;
        }
        return { result: Users };
    } catch (e) {
        return {
            error: `Could not get a list of users in group '${groupname}'.`,
        };
    }
};

const listAllUsersInOrganization = async (organizationID: string) => await listUsersInGroup(organizationID);
const listGroupLeadersInOrganization = async (organizationID: string) => await listUsersInGroup(`${organizationID}${GROUPLEADER_COGNITOGROUP_SUFFIX}`);
const listGroupLeaders = async () => await listUsersInGroup("groupLeader");
const listAdminsInOrganization = async (organizationID: string) => await listUsersInGroup(`${organizationID}${ADMIN_COGNITOGROUP_SUFFIX}`);
const listAdmins = async () => await listUsersInGroup("admin");

const listAllUsers = async (
    limit: number = 60
): Promise<ApiResponse<any[]>> => {
    let nextToken: string = "";
    let allUsers: any[] = [];
    try {
        do {
            let apiName = "AdminQueries";
            let path = "/listUsers";
            let variables = {
                queryStringParameters: {
                    limit: `${limit}`,
                    token: nextToken,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${(await Auth.currentSession())
                        .getAccessToken()
                        .getJwtToken()}`,
                },
            };
            const res = await API.get(apiName, path, variables);
            const { Users, NextToken } = res;
            nextToken = NextToken;
            allUsers = [...allUsers, ...Users];
        } while (nextToken);
    } catch (e) {
        return { error: "Could not get a list of all users." };
    }
    return { result: allUsers };
};


export {
    listAllUsers,
    listAllUsersInOrganization,
    listGroupLeaders,
    listGroupLeadersInOrganization,
    listAdmins,
    listAdminsInOrganization,
};
