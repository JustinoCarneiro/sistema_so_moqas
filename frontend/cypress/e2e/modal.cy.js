describe('MoQa OS - Interações de Modal', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve abrir e fechar o modal de Novo Monitor pelo botão Cancelar', () => {
      cy.contains(/monitoramento/i).click();
      cy.contains(/novo monitor/i).click();
      cy.get('[aria-label="form-device"]').should('be.visible');
      
      cy.contains(/cancelar/i).click();
      cy.get('[aria-label="form-device"]').should('not.exist');
    });

    it('deve fechar o modal ao clicar no botão X no topo', () => {
      cy.contains(/operacional/i).click();
      cy.contains(/nova manutenção/i).click();
      
      // Usa o novo aria-label
      cy.get('[aria-label="close-modal"]').click();
      cy.get('form').should('not.exist');
    });

    it('deve limpar os campos ao fechar e reabrir o modal', () => {
      cy.contains(/monitoramento/i).click();
      cy.contains(/novo monitor/i).click();
      cy.get('input[name="zone"]').type('LIXO PARA LIMPAR');
      
      // Fecha via X para testar o unmount
      cy.get('[aria-label="close-modal"]').click();
      cy.get('[aria-label="form-device"]').should('not.exist');

      // Reabre
      cy.contains(/novo monitor/i).click();
      cy.get('input[name="zone"]').should('have.value', '');
    });
  });
