import { storage } from "../local-storage";

// import { storage } from "../../src/helper/local-storage";

beforeEach(() => {
  localStorage.setItem(
    "session",
    "U2FsdGVkX1++pKbGsJWtVssVjUq0GYQyRyL1GH4rxAmkZROiSLCSQWOoC2M0pYVpCMjkyMu61KS4P2BrELSIa4NMM/sfOAqXX77auWWTabG+pMa+P99ZT6//GwZE/CsAu86v2c/CHmCELlhFOsLtccMIzlZA1g+dS3gDSaaKmV+aPrEgIaXGLGGFPSnzhOj67Guz0LnRHbpTipXznF8Pfxwg7YfS2MA+bZhu2Uj/0MX1KwHxsmwnqq+Yf5iK+bAA3JZy0wFJP31fB5fxFKyzjWrmzSmLcz0akLUFtRkkhM8ga/mryzskI4HFc3WLGezL"
  );
  cy.request({
    method: "POST",
    url: "https://api-dev.acrdigital.id/v1/auth/login",
    body: { email: "admin@acrdigital.id", password: "AcrDigital@25" },
  }).then((response) => {
    // Cannot read properties of undefined (reading 'AES')
    console.log(CryptoJS);
    storage.setItem("session", JSON.stringify(response.body));
    expect(response.status).to.eq(200);
  });
});

describe("My First Test", () => {
  it("in dashboard page", () => {
    cy.visit("/dashboard?tab=kloter");
    expect(cy.contains("KYC Management"));
  });
});
// it("", () => {
//   cy.visit("http://localhost:3000/dashboard?tab=kyc");
// });
