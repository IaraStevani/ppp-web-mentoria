Cypress.Commands.add('registrarPaciente', (nome, idade, imc, pressaoArterial) => {
    cy.get('.fas.fa-user-plus').click();
    cy.get('#patientName').type(nome);
    cy.get('#patientAge').type(idade);
    cy.get('#patientIMC').type(imc);
    cy.get('#patientPressure').type(pressaoArterial);
    cy.get('.fa-save').click();
});