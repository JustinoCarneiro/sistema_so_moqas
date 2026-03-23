describe('MoQa OS - Gestão Administrativa e Filtros', () => {
    beforeEach(() => {
      // Ignora exceções soltas do navegador
      cy.on('uncaught:exception', () => false);
      cy.visit('/');
    });
  
    it('deve realizar a edição de um monitor existente', () => {
      cy.contains(/monitoramento/i).click();
      
      // Se não houver nenhum monitor na lista, criamos um primeiro para garantir o teste
      cy.get('body').then(($body) => {
        if ($body.find('button[title="Editar"]').length === 0) {
          cy.get('input[name="zone"]').type('MONITOR TEMPORARIO PARA TESTE');
          cy.get('input[name="latitude"]').type('0');
          cy.get('input[name="longitude"]').type('0');
          cy.contains(/salvar dispositivo/i).click();
          
          // Scroll e checagem de existência para evitar erros de overflow
          cy.contains(/sucesso/i).scrollIntoView().should('exist');
          cy.wait(500); // Pequena pausa para garantir a atualização da lista
        }
      });

      // Busca o botão de editar e clica
      cy.get('button[title="Editar"]').first().scrollIntoView().click({ force: true });
      
      // Altera a zona e salva
      cy.get('input[name="zone"]').clear().type('ZONA ATUALIZADA CYPRESS');
      cy.contains(/atualizar dados/i).click();
      
      // Verifica sucesso
      cy.contains(/alterações salvas/i).scrollIntoView().should('exist');
      cy.contains('ZONA ATUALIZADA CYPRESS').should('exist');
    });
  
    it('deve filtrar manutenções por período de data', () => {
      cy.contains(/operacional/i).click();
      
      // Define uma data antiga
      cy.get('input[type="date"]').first().type('1990-01-01');
      cy.get('input[type="date"]').last().type('1990-01-01');
      
      // Verifica feedback de lista vazia
      cy.contains(/nenhuma manutenção encontrada/i).should('be.visible');
      
      // Limpa filtros
      cy.contains(/limpar/i).click();
      cy.contains(/histórico/i).should('be.visible');
    });
  
    it('deve navegar até configurações e verificar status do sistema', () => {
        cy.contains(/configurações/i).click();
        cy.contains(/repositório de dados/i).should('be.visible');
        cy.contains(/v2.1.0/i).should('be.visible');
    });
  });
