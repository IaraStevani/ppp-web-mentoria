describe('Login Paciente', ()=>{

    it('Realizar login com o paciente ', ()=>{
        cy.visit('/')
        cy.get('#nome').type('paciente')
        cy.get('#senha').type('123')
        cy.get('#loginBtn').click()   
        
        cy.get('.fa-user').should('be.visible')
    })

})