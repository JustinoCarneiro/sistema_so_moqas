import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Trash2, Edit3 } from 'lucide-react';

const DeviceList = ({ refreshKey, onEdit }) => {
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

  if (loading) return <div className="text-center py-8 text-gray-500 font-medium">Buscando monitores...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Filtrar por zona, bairro ou referência..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredDevices.map(dev => (
          <div key={dev.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group/card">
            
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{dev.zone}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(dev)}
                  className="p-1.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                  title="Editar"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(dev.id)}
                  className="p-1.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-400">Bairro:</span> {dev.neighborhood || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-400">Referência:</span> {dev.reference || 'N/A'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs">
              <span className="text-gray-400">ID: #{dev.id}</span>
              {dev.google_locator && (
                <a href={dev.google_locator} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                  Ver no Mapa <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredDevices.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">Nenhum monitor encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default DeviceList;
