describe('MoQa OS - Testes de Navegação e UX', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve carregar o Dashboard e mostrar o título premium', () => {
      cy.contains('PAINEL GERAL', { matchCase: false }).should('be.visible');
      cy.contains('MoQa OS', { matchCase: false }).should('be.visible');
    });
  
    it('deve alternar entre as abas da Sidebar', () => {
      // Clica em Monitoramento
      cy.contains(/monitoramento/i).click();
      cy.contains(/novo monitor/i).should('be.visible'); // Termo correto do DeviceForm.jsx
  
      // Clica em Operacional
      cy.contains(/operacional/i).click();
      cy.contains(/registrar manutenção/i).should('be.visible'); // Termo do MaintenanceForm.jsx
    });
  
    it('deve permitir fechar e abrir a Sidebar', () => {
      cy.contains(/dashboard/i).should('be.visible');
      cy.get('aside button').first().click();
      cy.contains(/dashboard/i).should('not.exist');
      cy.get('aside button').first().click();
      cy.contains(/dashboard/i).should('be.visible');
    });
  });
