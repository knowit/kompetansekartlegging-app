import React from "react";

import commonStyles from "./common.module.css";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Paper from "@material-ui/core/Paper";

import { getAttribute } from "./helpers";
import Table from "../mui/Table";
import TableRow from "../mui/TableRow"
import PictureAndNameCell from "./PictureAndNameCell";

const User = ({ user, selected, setSelectedUser }: any) => {
    const name = getAttribute(user, "name");
    const email = getAttribute(user, "email");
    const picture = getAttribute(user, "picture");

    return (
        <>
            <TableRow
                hover
                selected={selected}
                onClick={() => setSelectedUser(user)}
            >
                <TableCell>
                    <PictureAndNameCell name={name} picture={picture} />
                </TableCell>
                <TableCell>{email}</TableCell>
            </TableRow>
        </>
    );
};

const UsersTable = ({ users, selectedUser, setSelectedUser }: any) => {
    const isSelected = (user: any) =>
        selectedUser && user.Username === selectedUser.Username;

    return (
        <TableContainer
            component={Paper}
            className={commonStyles.usersTableContainer}
        >
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Ansatt</TableCell>
                        <TableCell>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u: any) => (
                        <User
                            key={u.Username}
                            user={u}
                            selected={isSelected(u)}
                            setSelectedUser={setSelectedUser}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
