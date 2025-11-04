const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4000",
    reporter: 'cypress-mochawesome-reporter',
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
