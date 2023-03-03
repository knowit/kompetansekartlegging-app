import React from "react";

import EditGroupLeaders from "./EditGroupLeaders";
import EditAdmins from "./EditAdmins";
import EditGroups from "./EditGroups";
import EditCatalogsRouter from "./EditCatalogsRouter";
import style from "./AdminPanel.module.css";
import DownloadExcel from "./DownloadExcel";

type AdminPanelProps = {
    activeSubmenuItem: string;
};

enum SubmenuCategory {
    MAIN,
    HIDDEN,
    EDIT_GROUP_LEADERS,
    EDIT_GROUPS,
    EDIT_ADMINS,
    EDIT_CATALOGS,
    DOWNLOAD_CATALOGS,
}

const activeSubmenuItemToSubmenuCategory = (
    activeCategory: string
): SubmenuCategory => {
    switch (activeCategory) {
        case "Rediger gruppeledere":
            return SubmenuCategory.EDIT_GROUP_LEADERS;
        case "Rediger grupper":
            return SubmenuCategory.EDIT_GROUPS;
        case "Rediger administratorer":
            return SubmenuCategory.EDIT_ADMINS;
        case "Rediger kataloger":
            return SubmenuCategory.EDIT_CATALOGS;
        case "Last ned kataloger":
            return SubmenuCategory.DOWNLOAD_CATALOGS;
        case "hidden":
            return SubmenuCategory.HIDDEN;
        default:
            return SubmenuCategory.MAIN;
    }
};

const AdminPanel = ({ activeSubmenuItem }: AdminPanelProps) => {
    const category = activeSubmenuItemToSubmenuCategory(activeSubmenuItem);

    return (
        <div className={style.container}>
            {(category === SubmenuCategory.MAIN ||
                category === SubmenuCategory.EDIT_GROUP_LEADERS) && (
                <EditGroupLeaders />
            )}
            {category === SubmenuCategory.EDIT_ADMINS && <EditAdmins />}
            {category === SubmenuCategory.EDIT_GROUPS && (
                <EditGroups showLastAnsweredAt={false} />
            )}
            {category === SubmenuCategory.EDIT_CATALOGS && (
                <EditCatalogsRouter />
            )}
            {category === SubmenuCategory.DOWNLOAD_CATALOGS && (
                <DownloadExcel />
            )}
        </div>
    );
};

export { AdminPanel };
