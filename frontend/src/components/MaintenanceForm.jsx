import React, { useState, useEffect } from 'react';
import { Save, X, Wrench, Camera, ImageIcon, Clock } from 'lucide-react';

const statusOptions = [
  { value: 'pending', label: 'PENDENTE' },
  { value: 'in_progress', label: 'EM ANDAMENTO' },
  { value: 'completed', label: 'CONCLUÍDO' },
  { value: 'canceled', label: 'CANCELADO' },
];

const MaintenanceForm = ({ onSuccess, editingMaintenance, onCancel, theme }) => {
  const isDark = theme === 'dark';
  const labelStyle = !isDark ? { color: '#000000', fontWeight: '900' } : {};
  const inputClass = `w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-black font-black placeholder-gray-400'}`;

  const initialState = {
    device: '',
    technician: '',
    description: '',
    status: 'pending',
  };

  const [formData, setFormData] = useState(initialState);
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [newUpdate, setNewUpdate] = useState('');
  const [savingUpdate, setSavingUpdate] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/devices/');
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        }
      } catch (err) {
        console.error('Erro ao buscar dispositivos:', err);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        device: editingMaintenance.device,
        technician: editingMaintenance.technician,
        description: editingMaintenance.description,
        status: editingMaintenance.status,
      });
      setExistingPhotos(editingMaintenance.photos || []);
    } else {
      setFormData(initialState);
      setPhotos([]);
      setExistingPhotos([]);
    }
  }, [editingMaintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPhotos(prev => [...prev, ...files]);
    }
  };

  const removeNewPhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = async (photoId) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto permanentemente?')) {
      try {
         await fetch(`http://localhost:8000/api/maintenance-photos/${photoId}/`, { method: 'DELETE' });
         setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
      } catch (err) {
         console.error('Erro ao excluir foto', err);
      }
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) return;
    setSavingUpdate(true);
    setMsg({ type: '', text: '' });
    try {
      const response = await fetch('http://localhost:8000/api/maintenance-updates/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenance: editingMaintenance.id,
          technician: formData.technician || 'Sistema',
          description: newUpdate
        })
      });
      if (!response.ok) throw new Error('Erro ao adicionar evolução');
      const data = await response.json();
      
      if (editingMaintenance) {
         if(!editingMaintenance.updates) editingMaintenance.updates = [];
         editingMaintenance.updates = [data, ...editingMaintenance.updates];
         setFormData({...formData}); // trigger re-render
      }
      setNewUpdate('');
      setMsg({ type: 'success', text: 'Evolução adicionada com sucesso!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const url = editingMaintenance 
      ? `http://localhost:8000/api/maintenances/${editingMaintenance.id}/` 
      : 'http://localhost:8000/api/maintenances/';
    
    const dataToSend = new FormData();
    dataToSend.append('device', formData.device);
    dataToSend.append('technician', formData.technician);
    dataToSend.append('description', formData.description);
    dataToSend.append('status', formData.status);
    photos.forEach(f => {
      dataToSend.append('photos', f);
    });

    const method = editingMaintenance ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: dataToSend,
      });

      if (!response.ok) throw new Error('Erro ao salvar manutenção.');

      setMsg({ type: 'success', text: editingMaintenance ? 'OS atualizada com sucesso!' : 'Manutenção registrada com sucesso!' });
      
      if (!editingMaintenance) {
        setFormData(initialState);
        setPhotos([]);
        setExistingPhotos([]);
      }

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

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="form-maintenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>MONITOR / DISPOSITIVO</label>
              <select name="device" value={formData.device} onChange={handleChange} required className={inputClass} style={!isDark? {color: '#000000'}:{}}>
                <option value="" className="dark:bg-slate-800">Selecione um monitor</option>
                {devices.map((dev) => (
                  <option key={dev.id} value={dev.id} className="dark:bg-slate-800">
                    [{dev.moqa_id || `#${dev.id}`}] {dev.zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>TÉCNICO RESPONSÁVEL</label>
              <input type="text" name="technician" value={formData.technician} onChange={handleChange} required placeholder="Nome do técnico" className={inputClass} style={!isDark? {color: '#000000'}:{}} />
            </div>

            <div>
              <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>STATUS</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass} style={!isDark? {color: '#000000'}:{}}>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-slate-800">{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>FOTOS DA MANUTENÇÃO</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {existingPhotos.map(p => {
                 const url = p.photo.startsWith('http') ? p.photo : `http://localhost:8000${p.photo}`;
                 return (
                 <div key={p.id} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 aspect-square">
                   <img src={url} alt="Foto" className="w-full h-full object-cover" />
                   <button type="button" onClick={() => removeExistingPhoto(p.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                     <X size={16} />
                   </button>
                 </div>
              )})}
              
              {photos.map((f, i) => (
                 <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 aspect-square">
                   <img src={URL.createObjectURL(f)} alt="Nova foto" className="w-full h-full object-cover" />
                   <button type="button" onClick={() => removeNewPhoto(i)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                     <X size={16} />
                   </button>
                 </div>
              ))}

              <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 transition-all cursor-pointer aspect-square group">
                 <ImageIcon size={28} className="text-gray-400 dark:text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
                 <p className="text-xs font-black uppercase tracking-tighter text-gray-500 text-center" style={labelStyle}>Adicionar <br/> Fotos</p>
                 <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>{editingMaintenance ? 'DESCRIÇÃO INICIAL DO SERVIÇO' : 'DESCRIÇÃO DO SERVIÇO'}</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Descreva o defeito inicial..." className={inputClass} style={!isDark? {color: '#000000'}:{}} />
        </div>

        {editingMaintenance && (
          <div className="pt-2 border-t-2 border-gray-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2 mt-4" style={labelStyle}>
              <Clock size={16} className="text-indigo-500" />
              Histórico de Evolução
            </h3>
            
            <div className="space-y-4 mb-6 max-h-48 overflow-y-auto px-2 custom-scrollbar">
              {editingMaintenance.updates && editingMaintenance.updates.length > 0 ? (
                editingMaintenance.updates.map((update, idx) => (
                  <div key={update.id || idx} className={`p-4 rounded-xl border-l-4 border-indigo-500 ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{update.technician}</span>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                         {new Date(update.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm dark:text-slate-300">{update.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-gray-500 italic py-4">Nenhuma evolução registrada.</p>
              )}
            </div>

            <div className={`p-4 rounded-xl border-2 ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
              <label className="block text-xs mb-2 uppercase tracking-wide text-gray-500 font-bold">Nova Evolução</label>
              <div className="flex flex-col gap-2">
                <textarea 
                  value={newUpdate} 
                  onChange={(e) => setNewUpdate(e.target.value)} 
                  rows={2} 
                  placeholder="Relate o acompanhamento ou atualização de hoje..." 
                  className={`w-full px-3 py-2 border-2 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-gray-50 border-gray-300 text-black placeholder-gray-400'}`}
                />
                <button 
                  type="button"
                  onClick={handleAddUpdate}
                  disabled={!newUpdate.trim() || savingUpdate}
                  className="self-end px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/40 dark:text-indigo-300 rounded-lg font-bold transition-all disabled:opacity-50 text-xs uppercase cursor-pointer"
                >
                  {savingUpdate ? 'Adicionando...' : 'Adicionar Evolução'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3 border-t-2 border-gray-100 dark:border-slate-800">
          <button 
            type="button" 
            onClick={onCancel} 
            className={`px-8 py-3 rounded-xl transition-all shadow-sm ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-black hover:bg-gray-100 border-2 border-gray-200'}`}
            style={!isDark ? { fontWeight: '900' } : {}}
          >
            CANCELAR
          </button>
          <button
            type="submit"
            disabled={loading}
            className={"px-10 py-3 rounded-xl text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2 " + (editingMaintenance ? "bg-amber-600 hover:bg-amber-700" : "bg-indigo-600 hover:bg-indigo-700")}
            style={{ fontWeight: '900' }}
          >
            <Save size={18} />
            {loading ? 'SALVANDO...' : (editingMaintenance ? 'ATUALIZAR ORDEM' : 'SALVAR MANUTENÇÃO')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
