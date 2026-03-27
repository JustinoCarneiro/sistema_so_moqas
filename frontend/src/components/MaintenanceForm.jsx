import React, { useState, useEffect } from 'react';
import { Save, X, Wrench, Camera, ImageIcon } from 'lucide-react';

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
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

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
      setPreview(editingMaintenance.photo ? `http://localhost:8000${editingMaintenance.photo}` : null);
    } else {
      setFormData(initialState);
      setPhoto(null);
      setPreview(null);
    }
  }, [editingMaintenance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
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
    if (photo) dataToSend.append('photo', photo);

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
        setPhoto(null);
        setPreview(null);
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
            <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>FOTO DA MANUTENÇÃO</label>
            <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 transition-all cursor-pointer relative overflow-hidden group">
              {preview ? (
                <div className="w-full h-full relative">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-2">
                       <Camera size={18} /> Trocar Foto
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="text-gray-400 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-black uppercase tracking-tighter" style={labelStyle}>Clique para anexar foto</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 uppercase tracking-wide" style={labelStyle}>DESCRIÇÃO DO SERVIÇO</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Descreva o defeito..." className={inputClass} style={!isDark? {color: '#000000'}:{}} />
        </div>

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
