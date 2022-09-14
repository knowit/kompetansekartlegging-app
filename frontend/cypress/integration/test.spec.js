/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});

it('lflf', () => {
    cy.visit("https://kompetanse.knowit.no", { timeout: 10000 });
    cy.wait(5000)
    cy.get("button").contains("Logg inn").click();

})