describe('MoQa OS - Fluxo de Cadastros', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve cadastrar um novo monitor e visualizar na lista', () => {
      cy.contains(/monitoramento/i).click();
      
      cy.get('input[name="zone"]').type('SANTANA - TESTE CYPRESS');
      cy.get('input[name="latitude"]').type('-23.5');
      cy.get('input[name="longitude"]').type('-46.6');
      
      cy.contains(/salvar dispositivo/i).click();
      
      // Ajuste para scroll e espera da mensagem
      cy.contains(/sucesso/i).scrollIntoView().should('be.visible');
      
      cy.get('input[placeholder*="Filtrar"]').type('SANTANA - TESTE CYPRESS');
      cy.contains('SANTANA - TESTE CYPRESS').should('exist');
    });
  
    it('deve registrar uma manutenção técnica', () => {
      cy.contains(/operacional/i).click();
      
      // Garante que a lista carregou antes de selecionar
      cy.get('select[name="device"]').should('be.visible').select(1);
      cy.get('input[name="technician"]').clear().type('ROBOT-CYPRESS');
      cy.get('textarea[name="description"]').type('Automatizado.');
      
      cy.contains(/salvar manutenção/i).click();
      
      // ScrollIntoView para garantir que o scroll da animação não esconda o alerta
      cy.contains(/sucesso/i).scrollIntoView().should('be.visible');
      
      // Verifica no final da lista se o nome do robô aparece (podemos ter muitos itens)
      cy.contains('ROBOT-CYPRESS').scrollIntoView().should('be.visible');
    });
  });
