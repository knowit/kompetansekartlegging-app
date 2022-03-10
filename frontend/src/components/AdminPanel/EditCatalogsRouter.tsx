import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Route, Switch } from "react-router";

import Root from "./EditCatalogs/Root";
import EditCatalog from "./EditCatalogs/EditCatalog";
import EditCategory from "./EditCatalogs/EditCategory";

const EditCatalogsRouter = () => {
    return (
        <MemoryRouter>
            <Switch>
                <Route exact path="/">
                    <Root />
                </Route>
                <Route path="/edit/:formDefinitionID/:id">
                    <EditCategory />
                </Route>
                <Route path="/edit/:id">
                    <EditCatalog />
                </Route>
            </Switch>
        </MemoryRouter>
    );
};

export default EditCatalogsRouter;
