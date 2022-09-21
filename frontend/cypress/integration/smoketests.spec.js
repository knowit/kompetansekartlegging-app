/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});

it("should check the page content", () => {
    cy.visit("/");
    cy.get(".makeStyles-buttonAlign-11").should("exist");

    cy.get(".makeStyles-buttonAlign-11").children();

    cy.get("button").contains("Logg inn (Knowit Objectnet)").should("exist");
    cy.get("button")
        .contains("Logg inn (Andre Knowit Selskaper)")
        .should("exist");
    cy.get("button").contains("Dev login").should("exist");

    cy.login();

    cy.get(".makeStyles-menu-28").as("meny").should("exist");
    cy.get("@meny")
        .should("contain", "OVERSIKT")
        .and("contain", "MINE SVAR")
        .and("contain", "ADMIN");
});
