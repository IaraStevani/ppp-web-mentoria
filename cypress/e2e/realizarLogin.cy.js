describe('Login', () => {

  beforeEach(() => {
    cy.visit('/')
  })

  it('Realizar login sem informar o usuário', () => {

    cy.fixture('credenciais').then((credenciais) => {

      cy.get('#senha')
        .click()
        .type(credenciais.valida.senha)
    })

    cy.contains('button', 'Entrar').click()

    cy.verificarMensagemDeErro('#nome', 'Preencha este campo.');
  })

  it('Realizar login sem informar a senha', () => {

    cy.fixture('credenciais').then((credenciais) => {

      cy.get('#nome')
        .click()
        .type(credenciais.valida.usuario)
    })

    cy.contains('button', 'Entrar').click()

    cy.verificarMensagemDeErro('#senha', 'Preencha este campo.');
  })

  it('Realizar login com credenciais inválidas', () => {

    cy.FazerLoginComCredenciaisInvalidas()

    cy.contains('#errorText', 'Usuário ou senha inválidos').should('be.visible')
  })

  it('Realizar login com credenciais válidas', () => {

    cy.FazerLoginComCredenciaisValidas()

    cy.contains('#pacientes > .box > .title', 'Lista de Pacientes').should('be.visible')
  })
})