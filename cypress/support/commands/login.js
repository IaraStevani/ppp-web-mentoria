Cypress.Commands.add('FazerLoginComCredenciaisValidas', () => {
    cy.fixture('credenciais').then((credenciais) => {

        cy.get('#nome')
            .click()
            .type(credenciais.valida.usuario)

        cy.get('#senha')
            .click()
            .type(credenciais.valida.senha)
    })

    cy.contains('button', 'Entrar').click()
})

Cypress.Commands.add('FazerLoginComCredenciaisInvalidas', () => {
    cy.fixture('credenciais').then((credenciais) => {

        cy.get('#nome')
            .click()
            .type(credenciais.invalida.usuario)

        cy.get('#senha')
            .click()
            .type(credenciais.invalida.senha)
    })

    cy.contains('button', 'Entrar').click()
})