import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Trash2, Edit3 } from 'lucide-react';

const DeviceList = ({ refreshKey, onEdit, theme }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDevices = () => {
    fetch('http://localhost:8000/api/devices/')
      .then(r => r.json())
      .then(d => {
        setDevices(d);
        setFilteredDevices(d);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
  }, [refreshKey]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = devices.filter(dev => 
      dev.zone.toLowerCase().includes(term) ||
      (dev.neighborhood && dev.neighborhood.toLowerCase().includes(term)) ||
      (dev.reference && dev.reference.toLowerCase().includes(term))
    );
    setFilteredDevices(filtered);
  }, [searchTerm, devices]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este monitor? Toda a história de manutenções vinculada a ele também será removida.')) {
      try {
        const resp = await fetch(`http://localhost:8000/api/devices/${id}/`, { method: 'DELETE' });
        if (resp.ok) fetchDevices();
      } catch (e) {
        alert('Erro ao excluir dispositivo.');
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500 dark:text-slate-400 font-medium">Buscando monitores...</div>;

  const isDark = theme === 'dark';
  const cardClass = `p-5 rounded-xl border hover:shadow-md transition-all relative group/card ${isDark ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-gray-100 shadow-sm'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Filtrar por zona, bairro ou referência..."
          className={`block w-full pl-10 pr-3 py-3 border rounded-xl leading-5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredDevices.map(dev => (
          <div key={dev.id} className={cardClass}>
            
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800 dark:text-slate-100 text-lg">{dev.zone}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(dev)}
                  className={`p-1.5 rounded-md transition-all shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 hover:border-blue-900/30' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200'}`}
                  title="Editar"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(dev.id)}
                  className={`p-1.5 rounded-md transition-all shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-900/20 hover:border-red-900/30' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200'}`}
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-400 dark:text-slate-500">Bairro:</span> {dev.neighborhood || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-400 dark:text-slate-500">Referência:</span> {dev.reference || 'N/A'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center text-xs text-gray-400 dark:text-slate-500">
              <span>ID: #{dev.id}</span>
              {dev.google_locator && (
                <a href={dev.google_locator} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Ver no Mapa <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredDevices.length === 0 && (
        <div className={`text-center py-12 rounded-xl border-2 border-dashed transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-gray-400 dark:text-slate-500 text-sm font-medium">Nenhum monitor encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
