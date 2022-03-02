import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import List from "@material-ui/core/List";

import {
    updateCategoryIndex,
    updateCategoryTextAndDescription,
    deleteCategory as deleteCategoryApi,
} from "../catalogApi";
import { Category } from "../../../API";
import CategoryListItem from "./CategoryListItem";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

const CategoryList = ({
    categories,
    refresh,
    formDefinitionID,
    formDefinitionLabel,
}: any) => {
    const history = useHistory();
    const [enableUpdates, setEnableUpdates] = useState<boolean>(true);

    const [
        showDeleteCategoryDialog,
        setShowDeleteCategoryDialog,
    ] = useState<boolean>(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any>();
    const deleteCategory = (category: any) => {
        setShowDeleteCategoryDialog(true);
        setCategoryToDelete(category);
    };
    const deleteCategoryConfirm = async () => {
        await deleteCategoryApi(categoryToDelete.id);
        setShowDeleteCategoryDialog(false);
        refresh();
    };

    const moveCategory = async (category: any, direction: number) => {
        setEnableUpdates(false);

        const me = category;
        const swapWith = categories.find(
            (c: any) => c.index === me.index - direction
        );
        await updateCategoryIndex(me, swapWith.index);
        await updateCategoryIndex(swapWith, me.index);

        setEnableUpdates(true);
        refresh();
    };

    const saveCategory = async (
        category: any,
        text: string,
        description: string
    ) => {
        await updateCategoryTextAndDescription(category, text, description);
        refresh();
    };

    return (
        <>
            {categories.length === 0 && (
                <p>Ingen kategorier i denne katalogen ennå.</p>
            )}
            <List>
                {categories.map((c: Category, ind: number) => {
                    const editPathName = `/edit/${formDefinitionID}/${c.id}`;
                    const editSearch = `?formDefinitionLabel=${formDefinitionLabel}&label=${c.text}`;

                    return (
                        <CategoryListItem
                            key={c.id}
                            onClick={() =>
                                history.push(`${editPathName}${editSearch}`)
                            }
                            category={c}
                            index={ind}
                            moveCategory={moveCategory}
                            saveCategory={saveCategory}
                            deleteCategory={deleteCategory}
                            enableUpdates={enableUpdates}
                            categories={categories}
                        />
                    );
                })}
            </List>
            {categoryToDelete && (
                <DeleteCategoryDialog
                    open={showDeleteCategoryDialog}
                    onCancel={() => setShowDeleteCategoryDialog(false)}
                    onExited={() => setCategoryToDelete(null)}
                    onConfirm={deleteCategoryConfirm}
                    category={categoryToDelete}
                />
            )}
        </>
    );
};

export default CategoryList;
