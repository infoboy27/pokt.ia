describe("dashboard page tests", () => {
  it("should login and show dashboard", () => {
    cy.login(Cypress.env("auth0_user"), Cypress.env("auth0_password"))

    cy.on("uncaught:exception", (err, runnable) => {
      expect(err.message).to.include("loggerProvider")
      // return false to prevent the error from
      // failing this test
      return false
    })

    // should have network summary heading
    cy.findByRole("tab", { name: /my applications/i }).should("be.visible")
  })
})
