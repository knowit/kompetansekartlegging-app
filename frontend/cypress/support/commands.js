Cypress.Commands.add("login", () => {
    cy.get("button").contains("Dev login").click();

    cy.get("amplify-sign-in.hydrated").shadow().find("#email").as("email");
    cy.wait(1000);
    cy.get("@email").should("not.to.be.disabled");
    cy.get("@email")
        .debug()
        .type("Victoria.weber@knowit.no", { delay: 100 }, { force: true });

    cy.get("amplify-sign-in.hydrated")
        .shadow()
        .find("#password")
        .as("password");
    cy.wait(1000);
    cy.get("@password").should("not.to.be.disabled");
    cy.get("@password")
        .debug()
        .type("OlaTestesen1", { delay: 100 }, { log: false }, { force: true });
    cy.wait(1000);
    cy.get("@password").type("{enter}", { force: true });
});

Cypress.Commands.add("fillInn", (x) => {
    const minimum = 0;
    const maximum = 50;

    cy.get(".MuiSlider-root").as("sliders");
    for (let j = 0; j < x; j++) {
        const i = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        cy.get("@sliders")
            .eq(j)
            .children('[data-index="' + i + '"' + "]")
            .click({ force: true, multiple: true });
    }
});

Cypress.Commands.add("clickAndStay", () => {
    cy.get(".makeStyles-menu-28").contains("MINE SVAR").click();
    cy.get("#alert-dialog-title").should("be.visible");
    cy.get(".makeStyles-confirmButton-51").click();
});
