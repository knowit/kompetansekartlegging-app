import { MenuItem, Select, SvgIcon } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { availableLanguages } from "../i18n/i18n";

export const LanguageSelect = ({ isMobile } : {isMobile: boolean}) => {

    const getFlagIcon = (
        language: string,
        size: "small" | "medium" | "large" = "medium"
    ) => {
        const Flag = availableLanguages[language].flag;
        return (
            <SvgIcon fontSize={size}>
                <Flag/>
            </SvgIcon>
        )
    }

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
        localStorage.setItem("language", language);
    }

    const textStyle = {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "bold"
    }

    const { i18n } = useTranslation();

    return (
        <Select
            value={i18n.language}
            onChange={(event) => changeLanguage(event.target.value as string)}
            renderValue={(language) => getFlagIcon(language as string, isMobile ? "medium" : "small")}
            style={isMobile ? { paddingLeft: 9 } : undefined}
        >
            {Object.keys(availableLanguages).map((language) => 
                <MenuItem key={language} value={language}>
                    <>
                        {getFlagIcon(language, isMobile ? "small" : "medium")}
                        {<div style={textStyle}>{availableLanguages[language].nativeName}</div>}
                    </>
                </MenuItem>
            )}
        </Select>
    )
}