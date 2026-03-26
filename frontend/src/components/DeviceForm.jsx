import React, { useState, useEffect } from 'react';
import { MapPin, Save, X } from 'lucide-react';

const DeviceForm = ({ onSuccess, editingDevice, onCancel, theme }) => {
  const initialState = {
    zone: '',
    latitude: '',
    longitude: '',
    neighborhood: '',
    reference: '',
    google_locator: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (editingDevice) {
      setFormData(editingDevice);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setFormData(initialState);
    }
  }, [editingDevice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const url = editingDevice 
      ? `http://localhost:8000/api/devices/${editingDevice.id}/` 
      : 'http://localhost:8000/api/devices/';
    
    const method = editingDevice ? 'PUT' : 'POST';

    try {
      const resp = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!resp.ok) throw new Error('Erro ao salvar dispositivo');
      
      setMsg({ type: 'success', text: editingDevice ? 'Alterações salvas com sucesso!' : 'Dispositivo cadastrado com sucesso!' });
      
      if (!editingDevice) setFormData(initialState);
      if (onSuccess) onSuccess();
      if (editingDevice && onCancel) onCancel(); // Reseta estado de edição no pai
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const containerClass = `p-6 rounded-xl shadow-sm border mb-8 max-w-4xl mx-auto ring-2 ring-transparent transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`;
  const inputStyle = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`;

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className={editingDevice ? "text-amber-500" : "text-blue-600 dark:text-blue-500"} size={24} />
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
            {editingDevice ? 'Editar Monitor' : 'Novo Monitor'}
          </h2>
        </div>
        {editingDevice && (
          <button 
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-full transition-colors"
            title="Cancelar Edição"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {msg.text && (
        <div className={'mb-4 p-3 rounded-md text-sm ' + (msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30')}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="form-device">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Zona / Nome</label>
          <input name="zone" value={formData.zone} onChange={handleChange} required placeholder="Ex: Zona Norte - Setor A" className={inputStyle} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Latitude</label>
          <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} required placeholder="0.0000" className={inputStyle} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Longitude</label>
          <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} required placeholder="0.0000" className={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Bairro</label>
          <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Ex: Centro" className={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Ponto de Referência</label>
          <input name="reference" value={formData.reference} onChange={handleChange} placeholder="Ex: Próximo à praça" className={inputStyle} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Google Locator</label>
          <input name="google_locator" value={formData.google_locator} onChange={handleChange} placeholder="Link do Google Maps" className={inputStyle} />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
          {editingDevice && (
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2 rounded-lg font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button disabled={loading} className={"flex items-center gap-2 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 " + (editingDevice ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700")}>
            <Save size={18} />
            {loading ? 'Salvando...' : (editingDevice ? 'Atualizar Dados' : 'Salvar Dispositivo')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceForm;
