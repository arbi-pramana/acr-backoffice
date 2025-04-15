import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
  },

  component: {
    specPattern: "cypress/components/**/*.cy.{js,jsx,ts,tsx}",
    port: 3000,
    env: {
      VITE_APP_BASE_URL: "https://api-dev.acrdigital.id/",
    },
    chromeWebSecurity: false,
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
