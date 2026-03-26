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
    if (window.confirm('Tem certeza que deseja excluir este monitor?')) {
      try {
        const resp = await fetch(`http://localhost:8000/api/devices/${id}/`, { method: 'DELETE' });
        if (resp.ok) fetchDevices();
      } catch (e) {
        alert('Erro ao excluir dispositivo.');
      }
    }
  };

  if (loading) return <div className="text-center py-8 font-black" style={{ color: '#000000' }}>Buscando monitores...</div>;

  const isDark = theme === 'dark';
  const dataStyle = !isDark ? { color: '#000000', fontWeight: '900' } : {};
  const headerStyle = !isDark ? { color: '#1a1c2e', fontWeight: '900' } : {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Busque por zona ou bairro..."
          className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl leading-5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-black font-black placeholder-gray-400'}`}
          style={!isDark ? { color: '#000000' } : {}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela Desktop */}
      <div className={`hidden md:block overflow-hidden rounded-xl border-2 transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-200'} text-[11px] uppercase tracking-widest`}>
              <th className="px-6 py-5" style={headerStyle}>ID</th>
              <th className="px-6 py-5" style={headerStyle}>ZONA / NOME</th>
              <th className="px-6 py-5" style={headerStyle}>BAIRRO</th>
              <th className="px-6 py-5" style={headerStyle}>REFERÊNCIA</th>
              <th className="px-6 py-5 text-right" style={headerStyle}>AÇÕES</th>
            </tr>
          </thead>
          <tbody className={`divide-y-2 ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
            {filteredDevices.map(dev => (
              <tr key={dev.id} className={`group transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-indigo-50/50'}`}>
                <td className="px-6 py-5 text-xs" style={dataStyle}>#{dev.id}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className={isDark ? "text-indigo-400" : "text-indigo-700"} />
                    <span className="text-base" style={dataStyle}>{dev.zone}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm" style={dataStyle}>{dev.neighborhood || '—'}</td>
                <td className="px-6 py-5 text-sm italic" style={dataStyle}>{dev.reference || '—'}</td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    {dev.google_locator && (
                      <a 
                        href={dev.google_locator} 
                        target="_blank" 
                        rel="noreferrer" 
                        className={`p-2 rounded-lg transition-all shadow-sm ${isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button 
                      onClick={() => onEdit(dev)}
                      data-testid="edit-device-btn"
                      className={`p-2 rounded-lg transition-all shadow-sm ${isDark ? 'text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 border border-slate-700' : 'text-gray-900 bg-gray-50 hover:bg-amber-100 border border-gray-200'}`}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(dev.id)}
                      data-testid="delete-device-btn"
                      className={`p-2 rounded-lg transition-all shadow-sm ${isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/20 border border-slate-700' : 'text-gray-900 bg-gray-50 hover:bg-red-100 border border-gray-200'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para Mobile */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredDevices.map(dev => (
          <div key={dev.id} className={`p-6 rounded-2xl border-2 transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl" style={dataStyle}>{dev.zone}</h3>
              <div className="flex gap-2">
                <button onClick={() => onEdit(dev)} data-testid="edit-device-btn-mobile" className="p-2 border-2 rounded-lg"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(dev.id)} data-testid="delete-device-btn-mobile" className="p-2 border-2 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="space-y-3">
              <p className="flex justify-between border-b pb-1 border-gray-50">
                <span className="text-xs font-bold text-gray-500">Bairro</span>
                <span className="text-sm" style={dataStyle}>{dev.neighborhood || 'N/A'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-xs font-bold text-gray-500">Referência</span>
                <span className="text-sm" style={dataStyle}>{dev.reference || 'N/A'}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
