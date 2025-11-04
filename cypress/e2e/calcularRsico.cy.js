describe('Registrar Paciente', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.FazerLoginComCredenciaisValidas()
    })

    it('Calcular Risco', () => {

        cy.get('[data-tab="calcular-risco"] > a > span').click({ force: true })
        cy.get('#patientSelect').select(1)
        cy.get('.is-warning').click()

        cy.get('#riskResult > .box > .title').should('be.visible')
    })
})