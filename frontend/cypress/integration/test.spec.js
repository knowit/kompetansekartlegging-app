/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});


it('lflf', () => {
    cy.visit("http://localhost:3000");
})