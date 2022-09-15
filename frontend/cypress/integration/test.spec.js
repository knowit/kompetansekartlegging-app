/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});

it('lflf', () => {
    cy.visit('/', {
        onBeforeLoad: win => {
          win.sessionStorage.clear();
        }
      });
    cy.wait(5000)
    cy.get("button").contains("Dev login").click();

})