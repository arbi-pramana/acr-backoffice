import KloterForm from "../../src/pages/kloter-form";
import MountWithProviders from "../mount-with-providers";

describe("<KloterForm />", () => {
  it("renders", () => {
    cy.mount(
      <MountWithProviders>
        <KloterForm />
      </MountWithProviders>
    );
    cy.get("[data-testid=title]").type("Tes title");
    cy.get("[data-testid=groupId]").type("G123");
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
  });
});
