describe('Login', () => {  

  it('Realizar login com credenciais inválidas', () => {
    cy.visit('http://localhost:4000/login')
    cy.get('#nome')
      .click()
      .type('medico')

    cy.get('#senha')
      .click()
      .type('senha_incorreta')

    cy.get('#loginBtn')
    .click()

    cy.contains('#errorText','Usuário ou senha inválidos').should('be.visible')
  })

  it('Realizar login com credenciais válidas', () => {
    cy.visit('http://localhost:4000/login')
    cy.get('#nome')
      .click()
      .type('medico')

    cy.get('#senha')
      .click()
      .type('123')

    cy.get('#loginBtn')
    .click()

    cy.contains('#pacientes > .box > .title', 'Lista de Pacientes').should('be.visible')
  })
})