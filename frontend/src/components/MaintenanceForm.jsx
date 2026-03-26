import React, { useState, useEffect } from 'react';
import { Save, X, Wrench, Camera, ImageIcon } from 'lucide-react';

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'canceled', label: 'Cancelado' },
];

const MaintenanceForm = ({ onSuccess, editingMaintenance, onCancel, theme }) => {
  const isDark = theme === 'dark';
  const containerClass = `max-w-4xl mx-auto p-8 rounded-xl shadow-sm border font-sans transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`;
  const inputClass = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`;
  const labelClass = `block text-sm font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`;

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Usando FormData para enviar arquivo
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
        body: dataToSend, // Não envia Content-Type header manual
      });

      if (!response.ok) throw new Error('Erro ao salvar manutenção.');

      setMsg({ type: 'success', text: editingMaintenance ? 'Ordem de serviço atualizada!' : 'Manutenção registrada com sucesso!' });
      
      if (!editingMaintenance) {
        setFormData(initialState);
        setPhoto(null);
        setPreview(null);
      }
      if (onSuccess) onSuccess();
      if (editingMaintenance && onCancel) onCancel();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Wrench className={editingMaintenance ? "text-amber-500" : "text-blue-600 dark:text-blue-500"} size={26} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            {editingMaintenance ? 'Editar Ordem de Serviço' : 'Registrar Manutenção'}
          </h2>
        </div>
        {editingMaintenance && (
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {msg.text && (
        <div className={'mb-6 p-4 rounded-lg text-sm border ' + (msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30')}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="form-maintenance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Monitor / Dispositivo</label>
              <select name="device" value={formData.device} onChange={handleChange} required className={inputClass}>
                <option value="" className="dark:bg-slate-800">Selecione um monitor</option>
                {devices.map((dev) => (
                  <option key={dev.id} value={dev.id} className="dark:bg-slate-800">
                    Monitor {dev.id} — {dev.zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Técnico Responsável</label>
              <input type="text" name="technician" value={formData.technician} onChange={handleChange} required placeholder="Nome do técnico" className={inputClass} />
            </div>



            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="dark:bg-slate-800">{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Area de Foto */}
          <div className="flex flex-col">
            <label className={labelClass}>Foto da Manutenção</label>
            <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative overflow-hidden group">
              {preview ? (
                <div className="w-full h-full relative">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                       <Camera size={14} /> Trocar Foto
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon size={32} className="text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Clique para anexar foto</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Descrição do Serviço</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Descreva o defeito e as peças trocadas..." className={inputClass} />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          {editingMaintenance && (
            <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={"px-8 py-2.5 rounded-lg text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 " + (editingMaintenance ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700")}
          >
            <Save size={18} />
            {loading ? 'Salvando...' : (editingMaintenance ? 'Atualizar Ordem' : 'Salvar Manutenção')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceForm;
