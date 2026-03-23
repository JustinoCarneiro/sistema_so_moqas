import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import React from 'react';

// Mock do fetch global
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('Dashboard Component', () => {
  it('deve renderizar o título do painel corretamente', async () => {
    render(<Dashboard />);
    const title = await screen.findByText(/Painel Geral/i);
    expect(title).toBeInTheDocument();
  });

  it('deve mostrar contagem zero inicialmente nos monitores', async () => {
    render(<Dashboard />);
    
    // Procuramos o texto 0 dentro do contexto de "Monitores Totais"
    // ou apenas verificamos se existem múltiplos zeros (contadores vazios)
    const counts = await screen.findAllByText('0');
    expect(counts.length).toBeGreaterThan(0);
  });
});
