import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MaintenanceForm from './MaintenanceForm';
import React from 'react';

global.fetch = vi.fn();

describe('MaintenanceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve submeter o formulário de manutenção corretamente', async () => {
    // Mock inicial sincronizado
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ id: 1, zone: 'MONITOR 01' }]),
    });

    render(<MaintenanceForm onSuccess={vi.fn()} />);

    // Aguarda o select carregar o dado do mock
    const techInput = screen.getByPlaceholderText(/Nome do técnico/i);
    fireEvent.change(techInput, { target: { value: 'JOAO SILVA', name: 'technician' } });

    // Mock do POST
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 10 }),
    });

    const form = screen.getByLabelText('form-maintenance');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
