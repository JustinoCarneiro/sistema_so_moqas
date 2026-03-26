describe('MoQa OS - Fluxo de Cadastros', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
      
      cy.intercept('POST', '**/api/devices/').as('createDevice');
      cy.intercept('POST', '**/api/maintenances/').as('createMaint');
      cy.intercept('GET', '**/api/maintenances/').as('getMaints');
    });
  
    it('deve cadastrar um novo monitor e então registrar uma manutenção para ele', () => {
      // 1. Cadastro do Monitor
      cy.get('[data-testid="nav-devices"]').click();
      cy.get('[data-testid="new-device-btn"]').click();
      
      const zoneUnique = 'WFLOW-' + Date.now();
      cy.get('input[name="zone"]').type(zoneUnique);
      cy.get('input[name="latitude"]').type('-23.0');
      cy.get('input[name="longitude"]').type('-46.0');
      
      cy.contains(/salvar monitor/i).click();
      cy.wait('@createDevice');
      
      // Verifica via data-testid para maior robustez
      cy.get('[data-testid="success-alert"]', { timeout: 15000 }).should('be.visible');
      // Espera o modal fechar
      cy.get('[data-testid="success-alert"]', { timeout: 15000 }).should('not.exist');
      
      // 2. Transição para Operacional
      cy.get('[data-testid="nav-maintenance"]').click();
      cy.wait('@getMaints');
      
      // 3. Registro de Manutenção
      cy.get('[data-testid="new-maint-btn"]').should('be.visible').click();
      
      cy.get('select[name="device"] option', { timeout: 15000 }).should('have.length.at.least', 2);
      cy.get('select[name="device"]').contains(zoneUnique).then($opt => {
        cy.get('select[name="device"]').select($opt.val(), { force: true });
      });
      
      const techName = 'TECH-AUTO-' + Date.now();
      cy.get('input[name="technician"]').clear().type(techName);
      cy.get('textarea[name="description"]').type('Flush sync intercept test.');
      
      cy.contains(/salvar manutenção/i).click();
      cy.wait('@createMaint');
      
      // Verifica via data-testid
      cy.get('[data-testid="success-alert"]', { timeout: 15000 }).should('be.visible');
      
      // 4. Verificação Final (espera o modal fechar e a lista recarregar)
      cy.get('[data-testid="success-alert"]', { timeout: 15000 }).should('not.exist');
      cy.wait('@getMaints');
      
      cy.contains(techName).scrollIntoView().should('exist');
    });
  });
