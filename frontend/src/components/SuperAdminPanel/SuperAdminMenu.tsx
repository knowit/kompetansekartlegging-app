import React from "react";
import { Panel } from "../../types";
import { Button } from "@material-ui/core";
import clsx from "clsx";

type SuperAdminMenuProps = {
    show: boolean;
    selected: boolean;
    setShowFab: React.Dispatch<React.SetStateAction<boolean>>;
    style: any;
    activeSubmenuItem: any;
    setActiveSubmenuItem: any;
    setActivePanel: any;
};
const SuperAdminMenu = ({
    show,
    selected,
    setShowFab,
    style,
    activeSubmenuItem,
    setActiveSubmenuItem,
    setActivePanel,
}: SuperAdminMenuProps) => {
    if (!show) return null;

    const items = [
        {
            text: "Rediger organisasjoner",
        },
        {
            text: "Rediger super-administratorer",
        },
        {
            text: "Rediger organisasjon-administratorer",
        },
        // refactor this one out once the whole app uses routing
        {
            text: "hidden",
            hidden: true,
        },
    ];

    return (
        <>
            <Button
                className={clsx(style.MenuButton, {
                    [style.menuButtonActive]: selected,
                })}
                onClick={() => {
                    // main pane is same as edit group leader pane atm
                    setShowFab(false);
                    setActiveSubmenuItem("Rediger organisasjoner");
                    setActivePanel(Panel.SuperAdmin);
                }}
            >
                <div className={clsx(style.menuButtonText)}>SUPER-ADMIN</div>
            </Button>

            {selected &&
                items
                    .filter((x) => !x.hidden)
                    .map((cat) => (
                        <Button
                            key={cat.text}
                            className={clsx(style.MenuButton, {
                                [style.menuButtonActive]:
                                    activeSubmenuItem === cat.text,
                            })}
                            onClick={async () => {
                                setActiveSubmenuItem(cat.text);
                            }}
                        >
                            <span
                                className={clsx(
                                    style.menuButtonText,
                                    style.menuButtonCategoryText
                                )}
                            >
                                {cat.text}
                            </span>
                        </Button>
                    ))}
        </>
    );
};

export { SuperAdminMenu };