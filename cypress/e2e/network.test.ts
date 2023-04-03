describe("dashboard page tests", () => {
  it("should load network page", () => {
    cy.visit("/network")

    cy.on("uncaught:exception", (err, runnable) => {
      expect(err.message).to.include("loggerProvider")
      // return false to prevent the error from
      // failing this test
      return false
    })

    // should have network summary nodes staked
    cy.findByRole("heading", { name: /nodes staked/i }).should("be.visible")
    // should have network summary apps staked
    cy.findByRole("heading", { name: /apps staked/i }).should("be.visible")
    // should have network summary networks. using string so it matches only this card and not "available networks" card
    cy.findByRole("heading", { name: "Networks" }).should("be.visible")

    //should have relay count
    cy.findByRole("heading", { name: /relay count/i }).should("be.visible")

    // should have available networks
    cy.findByRole("heading", { name: /available networks/i }).should("be.visible")

    // should have latest block
    cy.findByRole("heading", { name: /latest block/i }).should("be.visible")

    // should have relay performance
    cy.findByRole("heading", { name: /relay performance/i }).should("be.visible")

    // should have share feedback
    cy.findByRole("heading", { name: /share feedback/i }).should("be.visible")
  })
})
