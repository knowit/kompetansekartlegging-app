/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});

it('lflf', () => {
    cy.visit("http://localhost:3000", { timeout: 10000 });
    cy.wait(5000)
    cy.get("button").contains("Dev login").click();

})