import React, { useState, useEffect } from 'react';
import { MapPin, Save, X } from 'lucide-react';

const DeviceForm = ({ onSuccess, editingDevice, onCancel, theme }) => {
  const initialState = {
    moqa_id: '',
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
      
      // Pequeno delay para o usuário ver a mensagem antes do modal fechar
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';
  const labelStyle = !isDark ? { color: '#000000', fontWeight: '900' } : {};
  const inputStyle = `w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-black font-black placeholder-gray-400'}`;

  return (
    <div className="font-sans">
      {msg.text && (
        <div 
          data-testid="success-alert"
          className={'mb-4 p-4 rounded-xl text-sm border-2 ' + (msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200')}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="form-device">
        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>MoQA_ID</label>
          <input name="moqa_id" value={formData.moqa_id} onChange={handleChange} placeholder="Ex: EDA13C" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>
        
        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>ZONA / NOME</label>
          <input name="zone" value={formData.zone} onChange={handleChange} required placeholder="Ex: Zona Norte" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>
        
        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>LATITUDE</label>
          <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} required placeholder="0.0000" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>
        
        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>LONGITUDE</label>
          <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} required placeholder="0.0000" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>

        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>BAIRRO</label>
          <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Ex: Centro" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>

        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>PONTO DE REFERÊNCIA</label>
          <input name="reference" value={formData.reference} onChange={handleChange} placeholder="Ex: Próximo à praça" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>GOOGLE LOCATOR</label>
          <input name="google_locator" value={formData.google_locator} onChange={handleChange} placeholder="Link do Google Maps" className={inputStyle} style={!isDark? {color:'#000000'}:{}} />
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t-2 border-gray-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={onCancel}
            className={`px-8 py-3 rounded-xl transition-all shadow-sm ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-black hover:bg-gray-100 border-2 border-gray-200'}`}
            style={!isDark ? { fontWeight: '900' } : {}}
          >
            CANCELAR
          </button>
          <button 
            disabled={loading} 
            type="submit"
            className={"flex items-center gap-2 text-white px-10 py-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 " + (editingDevice ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700")}
            style={{ fontWeight: '900' }}
          >
            <Save size={18} />
            {loading ? 'SALVANDO...' : (editingDevice ? 'ATUALIZAR DADOS' : 'SALVAR MONITOR')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceForm;
