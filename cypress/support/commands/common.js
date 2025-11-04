Cypress.Commands.add('verificarMensagemDeErro', (selector, mensagem) => {
  cy.get(selector)
    .should('have.prop', 'validationMessage', mensagem)
})