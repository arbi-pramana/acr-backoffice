import KloterForm from "../../src/pages/kloter-form";
import { storage } from "../local-storage";
import MountWithProviders from "../mount-with-providers";

before(() => {
  console.log("before all tests in kloter-form.cy.tsx");
  cy.request({
    method: "POST",
    url: "https://api-dev.acrdigital.id/v1/auth/login",
    body: { email: "admin@acrdigital.id", password: "AcrDigital@25" },
  }).then((response) => {
    storage.setItem("session", JSON.stringify(response.body));
    expect(response.status).to.eq(200);
  });
});

describe("<KloterForm />", () => {
  it("renders", () => {
    cy.mount(
      <MountWithProviders>
        <KloterForm />
      </MountWithProviders>
    );
    cy.intercept("POST", "/v1/backoffice/catalogs").as("createCatalog");
    cy.get("[data-testid=title]").type("Tes title");
    cy.get("[data-testid=groupId]").type(Date.now().toString());
    cy.get("[data-testid=capacity]").type("50");
    cy.get("[data-testid=cycleDay]").type("7");
    cy.get("[data-testid=startAt]").click().type("2025-04-20{enter}");
    cy.get("[data-testid=endAt]").click().type("2025-05-20{enter}");
    cy.get("[data-testid=payout]").type("1000000");
    cy.get("[data-testid=adminFee]").type("50000");
    cy.get("[data-testid=minimumInitialAmount]").type("200000");
    cy.get("[data-testid=availableAt]")
      .click()
      .type("2025-04-25 10:00:00{enter}");
    cy.get("[data-testid=submit-down]").click();
    cy.wait("@createCatalog").its("response.statusCode").should("eq", 201);
  });
});
