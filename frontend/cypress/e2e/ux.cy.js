describe('MoQa OS - Testes de Navegação e UX', () => {
    beforeEach(() => {
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve carregar o Dashboard e mostrar o título MoQa OS', () => {
      cy.get('aside').contains('MoQa OS', { matchCase: false }).should('be.visible');
    });
  
    it('deve alternar entre as abas da Sidebar', () => {
      cy.get('[data-testid="nav-devices"]').click();
      cy.get('[data-testid="new-device-btn"]').should('be.visible');
  
      cy.get('[data-testid="nav-maintenance"]').click();
      cy.get('[data-testid="new-maint-btn"]').should('be.visible');
    });
  
    it('deve permitir fechar e abrir a Sidebar', () => {
      // Verifica se o texto "Dashboard" existe inicialmente (dentro do span)
      cy.get('[data-testid="nav-dashboard"]').contains('Dashboard').should('be.visible');
      
      // Fecha
      cy.get('[data-testid="sidebar-toggle"]').click();
      
      // Quando fechada, o span ({isSidebarOpen && <span>}) some do DOM.
      // O botão (data-testid) continua lá, mas sem o texto "Dashboard".
      cy.get('[data-testid="nav-dashboard"]').should('not.contain', 'Dashboard');
      
      // Abre
      cy.get('[data-testid="sidebar-toggle"]').click();
      cy.get('[data-testid="nav-dashboard"]').contains('Dashboard').should('be.visible');
    });

    it('deve mostrar tabela no desktop e cards no mobile', () => {
      cy.get('[data-testid="nav-devices"]').click();
      
      // Desktop
      cy.get('table').should('be.visible');

      // Mobile
      cy.viewport('iphone-xr');
      cy.get('table').should('not.be.visible');
      cy.get('.md\\:hidden').should('be.visible');
    });
  });
