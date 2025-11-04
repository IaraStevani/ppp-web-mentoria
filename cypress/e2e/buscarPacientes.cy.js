describe('Buscar Paciente', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.FazerLoginComCredenciaisValidas()
    })

    it('Lista de pacientes', () => {
        cy.get('#pacientes > :nth-child(1) > .is-4').click()
        cy.contains('#pacientes > .box > .title', 'Lista de Pacientes').should('be.visible')
    })

    it('Detalhes do Paciente', () => {
        cy.get('#pacientes > :nth-child(1) > .is-4').click()
        cy.get(':nth-child(1) > .columns > .is-narrow > .button').click()
        cy.get('.modal-card-title').should('be.visible').and('contain', 'Detalhes do Paciente');
    })
})