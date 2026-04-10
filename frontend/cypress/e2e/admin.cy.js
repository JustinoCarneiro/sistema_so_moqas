describe('MoQa OS - Gestão Administrativa e Filtros', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve realizar a edição de um monitor existente', () => {
      cy.get('[data-testid="nav-devices"]').click();
      
      // Espera a tabela carregar e verifica se há itens
      cy.get('table', { timeout: 10000 }).then($table => {
        if ($table.find('[data-testid="edit-device-btn"]').length === 0) {
          cy.get('[data-testid="new-device-btn"]').click();
          cy.get('input[name="zone"]').type('MONITOR TESTE EDIÇÃO');
          cy.get('input[name="latitude"]').type('0');
          cy.get('input[name="longitude"]').type('0');
          cy.contains(/salvar monitor/i).click();
          cy.get('[data-testid="success-alert"]').should('be.visible');
          cy.get('[data-testid="success-alert"]', { timeout: 10000 }).should('not.exist');
        }
      });

      // Recarrega a busca do botão para garantir que ele está no DOM após o IF
      cy.get('[data-testid="edit-device-btn"]').first().should('be.visible').click({ force: true });
      
      cy.intercept('PUT', '**/api/devices/*').as('updateDevice');
      
      // Altera a zona e salva
      cy.get('input[name="zone"]').should('be.visible').clear().type('ZONA ATUALIZADA');
      cy.contains(/atualizar dados/i).click();
      
      // Verifica sucesso esperando a API
      cy.wait('@updateDevice');
      cy.get('[data-testid="success-alert"]', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');
        
      cy.get('table').scrollIntoView().should('contain', 'ZONA ATUALIZADA');
    });
  
    it('deve filtrar manutenções por período de data', () => {
      cy.get('[data-testid="nav-maintenance"]').click();
      cy.get('input[type="date"]').first().type('1990-01-01');
      cy.get('input[type="date"]').last().type('1990-01-01');
      cy.contains(/nenhuma manutenção encontrada/i, { timeout: 10000 }).should('be.visible');
      cy.contains(/limpar/i).click();
      cy.contains(/histórico/i).should('be.visible');
    });
  
    it('deve navegar até configurações e verificar status do sistema', () => {
        cy.get('[data-testid="nav-settings"]').click();
        cy.contains(/repositório de dados/i).should('be.visible');
        cy.contains(/v2.1.0/i).should('be.visible');
    });
  });
