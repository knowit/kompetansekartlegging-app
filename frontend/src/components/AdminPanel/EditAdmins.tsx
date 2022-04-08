import React, { useState } from "react";

import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/Delete";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import Typography from "@material-ui/core/Typography";

import commonStyles from "./common.module.css";
import AddUserToGroupDialog from "./AddUserToGroupDialog";
import DeleteUserFromGroupDialog from "./DeleteUserFromGroupDialog";
import useApiGet from "./useApiGet";
import { listAllUsers, listAllUsersInOrganization, listAdmins, removeUserFromGroup, addUserToGroup } from "./adminApi";
import { getAttribute } from "./helpers";
import Button from "../mui/Button";
import Table from "../mui/Table";
import PictureAndNameCell from "./PictureAndNameCell";
import {useSelector} from 'react-redux';
import {selectAdminCognitoGroupName } from '../../redux/User';
import { API, Auth } from "aws-amplify";
import exports from "../../exports";

const Admin = (props: any) => {
    const { admin, deleteAdmin } = props;
    const username = admin.Username;
    const name = getAttribute(admin, "name");
    const email = getAttribute(admin, "email");
    const picture = getAttribute(admin, "picture");

    return (
        <>
            <TableRow>
                <TableCell>
                    <PictureAndNameCell name={name} picture={picture} />
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{username}</TableCell>
                <TableCell>
                    <IconButton edge="end" onClick={() => deleteAdmin(admin)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    );
};

const AdminTable = ({ admins, deleteAdmin }: any) => {
    return (
        <TableContainer className={commonStyles.tableContainer}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Ansatt</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Brukernavn</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.map((gl: any) => (
                        <Admin
                            key={gl.Username}
                            admin={gl}
                            deleteAdmin={deleteAdmin}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const EditAdmins = () => {

    const adminCognitoGroupName = useSelector(selectAdminCognitoGroupName);

    const { result: admins, error, loading, refresh } = useApiGet({
        getFn: listAllUsersInOrganization,
        params: adminCognitoGroupName
    });
    const [showAddAdmin, setShowAddAdmin] = useState<boolean>(false);
    const download = (path: string, filename: string) => {
        // Create a new link
        const anchor = document.createElement('a');
        anchor.href = path;
        anchor.download = filename;
    
        // Append to the DOM
        document.body.appendChild(anchor);
    
        // Trigger `click` event
        anchor.click();
    
        // Remove element from DOM
        document.body.removeChild(anchor);
    }; 
    const downloadExcel = async () => {
        const data = await API.get("CreateExcelAPI", "", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        });
        console.log("log")
        // const blob = new Blob([data], {type: "application/application/vnd.ms-excel"})
        // const url = URL.createObjectURL(blob);
        download(data, "report.xlsx");
        // const wind = window.open(`${window.location.hostname}/report.xlsx`,"_blank")
        // if (wind) {
        //     wind.document.write(data)
        // }
    }

    const [
        showDeleteUserFromGroupDialog,
        setShowDeleteUserFromGroupDialog,
    ] = useState<boolean>(false);
    const [adminToDelete, setAdminToDelete] = useState<any>();

    const deleteAdmin = (user: any) => {
        setShowDeleteUserFromGroupDialog(true);
        setAdminToDelete(user);
    };
    const deleteAdminConfirm = async () => {
        await removeUserFromGroup(adminCognitoGroupName, adminToDelete.Username);
        setShowDeleteUserFromGroupDialog(false);
        refresh();
    };
    const clearSelectedAdmin = () => setAdminToDelete(null);
    const hideShowAddAdmin = () => setShowAddAdmin(false);
    const addAdminConfirm = async (newAdminUser: any) => {
        await addUserToGroup(adminCognitoGroupName, newAdminUser.Username);
        setShowAddAdmin(false);
        refresh();
    };

    return (
        <Container maxWidth="md" className={commonStyles.container}>
            {error && <p>An error occured: {error}</p>}
            {loading && <CircularProgress />}
            {!error && !loading && admins && (
                <>
                    <Card style={{ marginBottom: "24px" }} variant="outlined">
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Rediger administratorer
                            </Typography>
                            Administratorer har tilgang til alles svar. De kan
                            også velge hvem som er gruppeledere og
                            administratorer og kan lage og fjerne grupper. På
                            denne siden kan du legge til og fjerne gruppeledere.
                        </CardContent>
                    </Card>
                    <AdminTable admins={admins} deleteAdmin={deleteAdmin} />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        style={{ marginTop: "24px" }}
                        onClick={() => setShowAddAdmin(true)}
                    >
                        Legg til administrator
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAddIcon />}
                        style={{ marginTop: "24px" }}
                        onClick={() => downloadExcel()}>
                        Last ned resultater (Excel)
                    </Button>
                </>
            )}
            <DeleteUserFromGroupDialog
                open={showDeleteUserFromGroupDialog}
                onCancel={() => setShowDeleteUserFromGroupDialog(false)}
                onExited={clearSelectedAdmin}
                onConfirm={deleteAdminConfirm}
                user={adminToDelete}
                roleName="administrator"
            />
            {showAddAdmin && (
                <AddUserToGroupDialog
                    open={showAddAdmin}
                    currentUsersInGroup={admins}
                    userGetFn={listAllUsersInOrganization}
                    onCancel={hideShowAddAdmin}
                    onConfirm={addAdminConfirm}
                    roleName="administrator"
                />
            )}
        </Container>
    );
};

export default EditAdmins;
