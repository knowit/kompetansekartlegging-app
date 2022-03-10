import React from "react";
import * as Icon from "../icons/iconController";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { KnowitColors } from "../styles";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";

export const CloseIcon = () => (
    <SvgIcon>
        <svg viewBox="0 0 32 32">
            <path d="M21,18.5L18.5,21l11,10.9l2.5-2.5L21,18.5z" />
            <path d="M2.5,0L0,2.5l11,10.9l2.5-2.5L2.5,0z" />
            <path d="M29.5,0.1L0,29.5L2.5,32L32,2.6L29.5,0.1z" />
        </svg>
    </SvgIcon>
);

const DescTableStyle = makeStyles({
    root: {
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "inherit",
        borderRadius: "inherit",
        display: "flex",
        flexDirection: "column",
        color: KnowitColors.darkBrown,
    },
    overflowContainer: {
        overflow: "auto",
        borderRadius: "inherit",
    },
    scaleRow: {
        margin: "15px 20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    scaleTitle: {
        display: "flex",
        fontSize: "18px",
        lineHeight: "17px",
        fontFamily: "Arial",
        fontWeight: 700,
        textTransform: "uppercase",
        margin: "20px 0",
    },
    mobileTitleRow: {
        margin: "20px 20px 0 20px",
    },
    mobileTitle: {
        fontSize: "22px",
        margin: "0px",
    },
    closeButton: {
        color: "black",
    },
    container: {
        display: "flex",
        alignItems: "center",
        margin: "5px 0",
    },
    iconArea: {
        height: 30,
        paddingRight: 5,
    },
    icon: {
        height: "100%",
    },
    textBlock: {
        display: "flex",
        flexDirection: "column",
    },
    heading: {
        textAlign: "left",
        fontSize: 12,
        fontWeight: "bold",
    },
    text: {
        textAlign: "left",
        fontSize: 12,
    },
});

type ScaleContainerProps = {
    icon: JSX.Element;
    heading: string;
    text: string;
};

type ScaleContainerObject = {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    heading: string;
    text: string;
};

// Possibly a better way to do this...
const COMPETENCE: ScaleContainerObject[] = [
    {
        icon: Icon.K5,
        heading: "Superstjerne",
        text:
            "En etterspurt spesialist, som fungerer som nyskapende eller strategisk kraft på området",
    },
    {
        icon: Icon.K4,
        heading: "Ekspert",
        text: "Har særdeles god kontroll og en etablert posisjon på området",
    },
    {
        icon: Icon.K3,
        heading: "Profesjonelt nivå",
        text:
            "Har god kontroll og kan jobbe selvstendig med ikke-trivielle problemstillinger innenfor området",
    },
    {
        icon: Icon.K2,
        heading: "Potensielt brukbar kompetanse",
        text:
            "Kompetanse som enten ikke er testet i oppdrag eller der man inntil videre trenger støtte fra andre i teamet",
    },

    {
        icon: Icon.K1,
        heading: "Noe innsikt",
        text:
            "Har noe innsikt i området, samt evne til å resonnere over eller løse oppgaver på et ikke-profesjonelt nivå innenfor området",
    },
    {
        icon: Icon.K0,
        heading: "Kjenner ikke til området",
        text: "",
    },
];

const MOTIVATION: ScaleContainerObject[] = [
    {
        icon: Icon.M5,
        heading: "Ildsjel. Jeg brenner for dette.",
        text: "",
    },
    {
        icon: Icon.M4,
        heading: "Godt. Dette er det jeg ønsker å jobbe med.",
        text: "",
    },
    {
        icon: Icon.M3,
        heading: "Nysgjerring. Dette vil jeg lære mer om.",
        text: "",
    },
    {
        icon: Icon.M2,
        heading: "Tja. Kan hvis det er behov.",
        text: "",
    },
    {
        icon: Icon.M1,
        heading: "Nøytral. Ingen formening.",
        text: "",
    },
    {
        icon: Icon.M0,
        heading: "Nei. Dette vil jeg ikke jobbe med.",
        text: "",
    },
];

type DescriptionTableProps = {
    onClose: React.MouseEventHandler<HTMLButtonElement>;
    isMobile: boolean;
};

export const DescriptionTable = ({
    onClose,
    isMobile,
}: DescriptionTableProps) => {
    const style = DescTableStyle();

    const ScaleContainer = ({ ...props }: ScaleContainerProps) => (
        <div className={style.container}>
            <div className={style.iconArea}>{props.icon}</div>
            <div className={style.textBlock}>
                <div className={style.heading}>{props.heading}</div>
                <div className={style.text}>{props.text}</div>
            </div>
        </div>
    );

    return (
        <div className={style.root}>
            {isMobile && (
                <div className={clsx([style.scaleRow, style.mobileTitleRow])}>
                    <header className={style.header}>
                        <h2
                            className={clsx([
                                style.scaleTitle,
                                style.mobileTitle,
                            ])}
                        >
                            Skalabeskrivelse
                        </h2>
                        <IconButton
                            aria-label="close"
                            className={style.closeButton}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </header>
                </div>
            )}

            <div className={style.overflowContainer}>
                <div className={style.scaleRow}>
                    <header className={style.header}>
                        <h2 className={style.scaleTitle}>Kompetanseskala</h2>
                        {!isMobile && (
                            <IconButton
                                aria-label="close"
                                className={style.closeButton}
                                onClick={onClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        )}
                    </header>

                    {COMPETENCE.map((obj, i) => {
                        const Icon = obj.icon;
                        return (
                            <ScaleContainer
                                key={`competence-${i}`}
                                icon={<Icon className={style.iconArea} />}
                                heading={obj.heading}
                                text={obj.text}
                            />
                        );
                    })}
                </div>

                <div className={style.scaleRow}>
                    <header className={style.header}>
                        <h2 className={style.scaleTitle}>Motivasjonsskala</h2>
                    </header>
                    {MOTIVATION.map((obj, i) => {
                        const Icon = obj.icon;
                        return (
                            <ScaleContainer
                                key={`motivation-${i}`}
                                icon={<Icon className={style.iconArea} />}
                                heading={obj.heading}
                                text={obj.text}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DescriptionTable;
