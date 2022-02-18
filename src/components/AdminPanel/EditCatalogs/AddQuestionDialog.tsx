import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { QuestionType } from "../../../API";
import { dialogStyles } from "../../../styles";
import { CloseIcon } from "../../DescriptionTable";

const AddQuestionDialog = ({ onCancel, onConfirm, open }: any) => {
    const style = dialogStyles();
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [questionType, setQuestionType] = useState<QuestionType>(
        QuestionType.knowledgeMotivation
    );
    const [questionConfig, setQuestionConfig] = useState<any>({});

    // const isKnowledgeMotivation =
    //     questionType === QuestionType.knowledgeMotivation;
    const isCustomScaleLabels = questionType === QuestionType.customScaleLabels;
    const isCompleted = (() => {
        if (topic === "" || description === "") return false;
        return true;
    })();

    const onQuestionTypeChange = (e: any) => {
        const qtype = e.target.value;
        if (qtype === QuestionType.customScaleLabels) {
            setQuestionConfig({
                scaleStart: "",
                scaleMiddle: "",
                scaleEnd: "",
            });
        } else {
            setQuestionConfig({});
        }
        setQuestionType(qtype);
    };

    const onQuestionConfigChange = (property: string) => (e: any) => {
        e.persist(); // what on god's green earth is this!?
        setQuestionConfig((config: any) => ({
            ...config,
            [property]: e.target.value,
        }));
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                style: { borderRadius: 30 },
            }}
        >
            <DialogTitle>
                <Box
                    component="div"
                    mb={1}
                    display="flex"
                    justifyContent="space-between"
                >
                    <span className={style.dialogTitleText}>
                        Legg til nytt spørsmål
                    </span>
                    <IconButton
                        className={style.closeButton}
                        onClick={onCancel}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TextField
                    fullWidth
                    label="Emnet på det nye spørsmålet"
                    variant="outlined"
                    error={topic === ""}
                    helperText={topic === "" && "Emnet kan ikke være tomt."}
                    value={topic}
                    className={style.textField}
                    onChange={(e: any) => setTopic(e.target.value)}
                />
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    rowsMax={6}
                    label="Beskrivelse"
                    variant="outlined"
                    error={description === ""}
                    helperText={
                        description === "" && "Beskrivelsen kan ikke være tom."
                    }
                    value={description}
                    className={style.textField}
                    onChange={(e: any) => setDescription(e.target.value)}
                />
                <FormControl component="fieldset">
                    <FormLabel component="legend">Spørsmålstype</FormLabel>
                    <RadioGroup
                        row
                        value={questionType}
                        onChange={onQuestionTypeChange}
                    >
                        <FormControlLabel
                            value={QuestionType.knowledgeMotivation}
                            control={<Radio />}
                            label="Kunnskap / Motivasjon"
                        />
                        <FormControlLabel
                            value={QuestionType.customScaleLabels}
                            control={<Radio />}
                            label="Egendefinerte skala overskrifter"
                        />
                    </RadioGroup>
                </FormControl>
                {isCustomScaleLabels && (
                    <FormControl fullWidth component="fieldset">
                        <Box display="flex" justifyContent="space-between">
                            <TextField
                                label="Start"
                                variant="outlined"
                                value={questionConfig.scaleStart}
                                className={style.textField}
                                onChange={onQuestionConfigChange("scaleStart")}
                            />
                            <TextField
                                label="Midt"
                                variant="outlined"
                                value={questionConfig.scaleMiddle}
                                className={style.textField}
                                onChange={onQuestionConfigChange("scaleMiddle")}
                            />
                            <TextField
                                label="Slutt"
                                variant="outlined"
                                value={questionConfig.scaleEnd}
                                className={style.textField}
                                onChange={onQuestionConfigChange("scaleEnd")}
                            />
                        </Box>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions className={style.alertButtons}>
                <Button onClick={onCancel} className={style.cancelButton}>
                    <span className={style.buttonText}>Avbryt</span>
                </Button>
                <Button
                    disabled={!isCompleted}
                    onClick={() =>
                        onConfirm(
                            topic,
                            description,
                            questionType,
                            questionConfig
                        )
                    }
                    className={style.confirmButton}
                >
                    <span className={style.buttonText}>Legg til</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddQuestionDialog;
