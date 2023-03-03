import React, { useState } from "react";

import { CardContent, Typography } from "@material-ui/core";
import { listAllFormDefinitionsForLoggedInUser } from "./catalogApi";
import useApiGet from "./useApiGet";
import { API, Auth } from "aws-amplify";

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import GetAppIcon from "@material-ui/icons/GetApp";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "../mui/Button";
import Table from "../mui/Table";
import commonStyles from "./common.module.css";

type FormDefinition = {
    id: string;
    label: string;
    createdAt: string;
    updatedAt: string;
};

interface FormDefinitions {
    formDefinitions: FormDefinition[];
}

const DownloadExcel = () => {
    const {
        result: formDefinitions,
        error,
        loading,
    } = useApiGet({
        getFn: listAllFormDefinitionsForLoggedInUser,
    });

    return (
        <Container maxWidth="md" className={commonStyles.container}>
            <Card style={{ marginBottom: "24px" }} variant="outlined">
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Last ned kataloger
                    </Typography>
                    På denne siden kan du laste ned Excel-rapport fra katalogen
                    du ønsker.
                </CardContent>
            </Card>
            {error && <p>An error occured: {error}</p>}
            {loading && <CircularProgress />}
            {!error && !loading && formDefinitions && (
                <DownloadExcelTable formDefinitions={formDefinitions} />
            )}
        </Container>
    );
};

const DownloadExcelTable = ({ formDefinitions }: FormDefinitions) => {
    const [idOfDownloadingForm, setIdOfDownloadingForm] = useState<string>("");
    const [isExcelError, setIsExcelError] = useState<boolean>(false);

    const downloadExcel = async (formDefId: string, formDefLabel: string) => {
        setIsExcelError(false);
        setIdOfDownloadingForm(formDefId);
        try {
            const data = await API.get("CreateExcelAPI", "", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${(await Auth.currentSession())
                        .getAccessToken()
                        .getJwtToken()}`,
                },
                queryStringParameters: {
                    formDefId: `${formDefId}`,
                    formDefLabel: `${formDefLabel}`,
                },
            });
            download(data, "report.xlsx");
            setIdOfDownloadingForm("");
        } catch (e) {
            setIsExcelError(true);
        }
    };

    const download = (path: string, filename: string) => {
        // Create a new link
        const anchor = document.createElement("a");
        anchor.href = path;
        anchor.download = filename;

        // Append to the DOM
        document.body.appendChild(anchor);

        // Trigger `click` event
        anchor.click();

        // Remove element from DOM
        document.body.removeChild(anchor);
    };

    return (
        <TableContainer>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Katalog</TableCell>
                        <TableCell>Opprettet</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {formDefinitions.map((formDef: FormDefinition) => (
                        <TableRow key={formDef.id}>
                            <TableCell>{formDef.label}</TableCell>
                            <TableCell>
                                {new Date(formDef.createdAt).toLocaleDateString(
                                    "nb-NO"
                                )}
                            </TableCell>
                            <TableCell align="center">
                                <div
                                    style={{
                                        height: "5.65rem",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {formDef.id === idOfDownloadingForm ? (
                                        <>
                                            {isExcelError ? (
                                                <p
                                                    style={{
                                                        whiteSpace: "pre-wrap",
                                                        margin: "0 auto",
                                                    }}
                                                >
                                                    {
                                                        "Nedlasting feilet.\nEr katalogen tom?"
                                                    }
                                                </p>
                                            ) : (
                                                <CircularProgress
                                                    style={{ margin: "0 auto" }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <Button
                                            style={{ margin: "0 auto" }}
                                            variant="contained"
                                            color="primary"
                                            endIcon={<GetAppIcon />}
                                            onClick={() => {
                                                downloadExcel(
                                                    formDef.id,
                                                    formDef.label
                                                );
                                            }}
                                        >
                                            Last ned
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DownloadExcel;
