import { faker } from '@faker-js/faker';

describe('Registrar Paciente', () => {

  beforeEach(() => {
    cy.visit('/')
    cy.FazerLoginComCredenciaisValidas()
  })

  it('Registrar paciente sem informar campos obrigatórios', () => {

    cy.registrarPaciente('Paciente sem informar campos obrigatórios', '70', '40', ' ');

    cy.verificarMensagemDeErro('#patientPressure', 'Preencha este campo.');
  })

  it('Registrar paciente informando dados invalidos', () => {

    cy.registrarPaciente('Paciente com dados invalidos', '0', '40', '160');

    cy.get('#patientAge:invalid')
      .should('have.prop', 'validationMessage', 'O valor deve ser maior ou igual a 1.')
  })

  it('Registrar paciente com sucesso', () => {
 
  const nome = faker.person.fullName();
  const idade = faker.number.int({ min: 18, max: 90 }).toString();
  const imc = faker.number.int({ min: 18, max: 40 }).toString(); 
  const pressaoArterial = faker.number.int({ min: 100, max: 180 }).toString();

  cy.registrarPaciente(nome, idade, imc, pressaoArterial);

  cy.contains('.notification.is-success', 'Paciente registrado com sucesso!').should('be.visible')
  })
})