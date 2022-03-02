import React, { useEffect, useState, useCallback } from "react";

import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import commonStyles from "../AdminPanel/common.module.css";
import Button from "../mui/Button";
import Table from "../mui/Table";
import CircularProgress from "@material-ui/core/CircularProgress";


import { getOrganizations, removeOrganization, addOrganization} from './SuperAdminAPI'; 
import { OrganizationInfo } from "./SuperAdminTypes";
import AddIcon from "@material-ui/icons/Add";
import AddOrganizationDialog from './AddOrganizationDialog';
import DeleteOrganizationDialog from "./DeleteOrganizationDialog";
import useApiGet from "../AdminPanel/useApiGet";


interface OrganizationProps {
    organization: OrganizationInfo,
    deleteOrganization: (id: OrganizationInfo) => void
};

const Organization : React.FC<OrganizationProps> = ({
    organization, deleteOrganization
}) => {
    return (
        <>
            <TableRow>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.id}</TableCell>
                <TableCell>{organization.identifierAttribute}</TableCell>
                <TableCell align="center">
                    <IconButton edge="end" onClick={() => deleteOrganization(organization)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        </>
    );
};

interface OrganizationTableProps {
    organizations: OrganizationInfo[], 
    deleteOrganization: (id: OrganizationInfo) => void
};

const OrganizationTable : React.FC<OrganizationTableProps> = ({
    organizations, deleteOrganization
}) => {
    return (
        <TableContainer className={commonStyles.tableContainer}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Identifier Attribute</TableCell>
                        <TableCell>Slett</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {organizations.map((organization) => (
                        <Organization
                            organization={organization}
                            deleteOrganization={deleteOrganization}
                            key={organization.id}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const EditOrganizations = () => {


    const {
        result: organizations,
        error: error,
        loading: loading,
        refresh: refreshOrganizations
    } = useApiGet({
        getFn: getOrganizations  
    });


    const [mutationError, setMutationError] = useState<string>("");

    const [showAddOrganization, setShowAddOrganization] = useState<boolean>(false);
    const [showDeleteOrganization, setShowDeleteOrganization] = useState<boolean>(false);
    const [organizationToBeDeleted, setOrganizationToBeDeleted] = useState<OrganizationInfo | null>(null);


    const addOrganizationConfirm = (organization: OrganizationInfo) => {
        addOrganization(organization).then((res) => {
            setMutationError("");
        }).catch((err) => {
            setMutationError(err);
        }).finally(() => {
            setShowAddOrganization(false);
            refreshOrganizations();
        })
    };

    const openDeleteOrganizationDialog = (organization: OrganizationInfo) => {
        setOrganizationToBeDeleted(organization);
        setShowDeleteOrganization(true);
    };

    const deleteOrganizationConfirm = (organization : OrganizationInfo) => {
        removeOrganization(organization).then((res) => {
            setMutationError("");
        }).catch((err) => {
            setMutationError(err);
        }).finally(() => {
            refreshOrganizations();
        });
    };

    return (
        <Container maxWidth="md" className={commonStyles.container}>
            {error && <p>An error occured: {error}</p>}
            {mutationError && 
                <>
                    <p>An error occured: {mutationError}</p>
                </>
            }
            {loading && <CircularProgress />}
            {!error && !loading &&
            <>
                <Card style={{ marginBottom: "24px" }} variant="outlined">
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Rediger organisasjoner.
                        </Typography>
                        Her man man legge til, fjerne eller oppdatere organizasjoner. 
                    </CardContent>
                </Card>
                <OrganizationTable organizations={organizations} deleteOrganization={openDeleteOrganizationDialog} />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    style={{ marginTop: "24px" }}
                    onClick={() => setShowAddOrganization(true)}
                >
                    Legg til organisasjon
                </Button>
            </>
            }   
            {showAddOrganization && (
                <AddOrganizationDialog
                    open={showAddOrganization}
                    onCancel={() => {setShowAddOrganization(false)}}
                    onConfirm={addOrganizationConfirm}
                />
            )}
            {showDeleteOrganization && organizationToBeDeleted && (
                <DeleteOrganizationDialog
                    open={showDeleteOrganization}
                    onCancel={() => {
                        setShowDeleteOrganization(false);
                        setOrganizationToBeDeleted(null);
                    }}
                    onConfirm={(organization) => {
                        setShowDeleteOrganization(false);
                        setOrganizationToBeDeleted(null);
                        deleteOrganizationConfirm(organization);
                    }}
                    organization={organizationToBeDeleted}
                />
            )}
        </Container>
    );
};

export default EditOrganizations;