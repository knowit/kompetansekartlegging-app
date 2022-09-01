/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
    return false;
});

describe("should add competance", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.login();
        cy.wait(1000);
        cy.get(".MuiFab-root").click();
        cy.get(".makeStyles-header-68 > .MuiButtonBase-root").click();
        cy.get(".makeStyles-menu-28")
            .contains("MINE SVAR")
            .click({ force: true });
    });
    it("should add competance in Design module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("1. Design").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(36);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Mobil module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("2. Mobil").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(30);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Frontend module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("3. Frontend").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(34);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Backend module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("4. Backend").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(38);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in AI og Data Engineering module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28")
            .contains("5. AI og Data Engineering")
            .click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(38);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in IoT og Hardware module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("6. IoT og Hardware").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(34);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Cloud og DevOps module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("7. Cloud og DevOps").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(40);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Smidig metodikk og produktledelse module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28")
            .contains("8. Smidig metodikk og produktledelse")
            .click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(30);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Salg og forretningsutvikling module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28")
            .contains("9. Salg og forretningsutvikling")
            .click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(22);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Jobbrotasjon module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("10. Jobbrotasjon").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(2);
        cy.clickAndStay();
        cy.get("button").contains("Lagre og gå videre").click();
    });
    it("should add competance in Softskills module", () => {
        cy.wait(1000);
        cy.get(".makeStyles-menu-28").contains("11. Softskills").click();
        cy.get("button").contains("Fyll ut").click();
        cy.fillInn(11);
        cy.clickAndStay();
        cy.get("button").contains("Send inn svar og avslutt").click();
    });
});
