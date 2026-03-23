import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeviceForm from './DeviceForm';
import React from 'react';

global.fetch = vi.fn();

describe('DeviceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve permitir preencher o campo zona e enviar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    render(<DeviceForm onSuccess={vi.fn()} />);

    const zoneInput = screen.getByPlaceholderText(/Ex: Zona Norte - Setor A/i);
    fireEvent.change(zoneInput, { target: { value: 'NOVA ZONA', name: 'zone' } });
    
    const form = screen.getByLabelText('form-device');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
