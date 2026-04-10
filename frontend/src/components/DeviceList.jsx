import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Search, Trash2, Edit3, FileSpreadsheet, Map } from 'lucide-react';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const DeviceList = ({ refreshKey, onEdit, theme }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedChunks, setOptimizedChunks] = useState([]);

  useEffect(() => {
    setOptimizedChunks([]);
  }, [selectedDevices]);

  const toggleSelection = (devId) => {
    setSelectedDevices(prev => 
      prev.includes(devId) ? prev.filter(id => id !== devId) : [...prev, devId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length && filteredDevices.length > 0) {
       setSelectedDevices([]);
    } else {
       setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handleOptimize = () => {
      setIsOptimizing(true);
      const processOptimization = (startLat, startLng) => {
        let unvisited = devices.filter(d => selectedDevices.includes(d.id) && d.latitude !== null && d.longitude !== null);
        if (unvisited.length === 0) {
            setIsOptimizing(false);
            alert("Nenhum dos monitores selecionados possui coordenadas.");
            return;
        }
        let currentLat = startLat;
        let currentLng = startLng;
        const ordered = [];
        while (unvisited.length > 0) {
            let nearestIdx = 0;
            let minDest = Infinity;
            for (let i = 0; i < unvisited.length; i++) {
                const dist = haversineDistance(currentLat, currentLng, unvisited[i].latitude, unvisited[i].longitude);
                if (dist < minDest) {
                    minDest = dist;
                    nearestIdx = i;
                }
            }
            const nearest = unvisited[nearestIdx];
            ordered.push(nearest);
            unvisited.splice(nearestIdx, 1);
            currentLat = nearest.latitude;
            currentLng = nearest.longitude;
        }
        const chunks = [];
        for (let i = 0; i < ordered.length; i += 10) {
            chunks.push(ordered.slice(i, i + 10));
        }
        setOptimizedChunks(chunks);
        setIsOptimizing(false);
      };

      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (pos) => processOptimization(pos.coords.latitude, pos.coords.longitude),
              (err) => {
                 const first = devices.find(d => selectedDevices.includes(d.id) && d.latitude && d.longitude);
                 if (first) processOptimization(first.latitude, first.longitude);
                 else { setIsOptimizing(false); alert("GPS falhou e nenhum monitor tem coordenadas para ser origem."); }
              },
              { timeout: 8000, enableHighAccuracy: true }
          );
      } else {
           const first = devices.find(d => selectedDevices.includes(d.id) && d.latitude && d.longitude);
           if (first) processOptimization(first.latitude, first.longitude);
           else { setIsOptimizing(false); alert("Dispositivo sem GPS."); }
      }
  };

  const openChunk = (chunk) => {
      const coords = chunk.map(d => `${d.latitude},${d.longitude}`).join('/');
      window.open(`https://www.google.com/maps/dir/Current+Location/${coords}`, '_blank');
  };

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
      (dev.moqa_id && dev.moqa_id.toLowerCase().includes(term)) ||
      (dev.legacy_id && dev.legacy_id.toLowerCase().includes(term)) ||
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

  const downloadCSV = () => {
    if (filteredDevices.length === 0) return;
    const headers = ['ID do MoQa', 'ID Antigo', 'Zona', 'Bairro', 'Referência', 'Google Locator'];
    const rows = filteredDevices.map(dev => [
      dev.moqa_id || `#${dev.id}`,
      dev.legacy_id || '',
      dev.zone || '',
      dev.neighborhood || '',
      dev.reference || '',
      dev.google_locator || ''
    ]);
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'lista_monitores_moqa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-8 font-black" style={{ color: '#000000' }}>Buscando monitores...</div>;

  const isDark = theme === 'dark';
  const dataStyle = !isDark ? { color: '#000000', fontWeight: '900' } : {};
  const headerStyle = !isDark ? { color: '#1a1c2e', fontWeight: '900' } : {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Busque por ID, zona ou bairro..."
            className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl leading-5 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDark ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-gray-300 text-black font-black placeholder-gray-400'}`}
            style={!isDark ? { color: '#000000' } : {}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={downloadCSV}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold text-white transition-all shadow-md active:scale-95 ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
        >
          <FileSpreadsheet size={18} />
          <span className="hidden sm:inline">CSV</span>
        </button>
      </div>

      {selectedDevices.length > 0 && (
        <div className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-indigo-900/30 border-indigo-500/50' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`}>
           <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-md">
                 {selectedDevices.length}
              </div>
              <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-indigo-200' : 'text-indigo-800'}`}>Monitores Selecionados</span>
           </div>
           
           <div className="flex items-center gap-2 flex-wrap justify-center">
             {optimizedChunks.length === 0 ? (
               <button onClick={handleOptimize} disabled={isOptimizing} className={`px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm active:scale-95 ${isOptimizing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                 <Map size={18} className={isOptimizing ? "animate-pulse" : ""} /> 
                 {isOptimizing ? "OTIMIZANDO..." : "OTIMIZAR ROTA"}
               </button>
             ) : (
               <>
                 <span className={`text-xs font-bold mr-2 hidden sm:inline ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>Rota Inteligente:</span>
                 <div className="flex gap-2 flex-wrap justify-center">
                    {optimizedChunks.map((chunk, i) => (
                      <button key={i} onClick={() => openChunk(chunk)} className="px-4 py-2 flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-black rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 text-xs active:scale-95">
                        <Map size={14} /> IR ROTA {i + 1}
                      </button>
                    ))}
                 </div>
               </>
             )}
             <button onClick={() => setSelectedDevices([])} className={`px-4 py-2 font-bold rounded-lg transition-all text-xs active:scale-95 ${isDark ? 'bg-slate-800 text-red-400 hover:bg-slate-700' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                Cancelar
             </button>
           </div>
        </div>
      )}

      {/* Tabela Desktop */}
      <div className={`hidden md:block overflow-hidden rounded-xl border-2 transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`${isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-200'} text-[11px] uppercase tracking-widest`}>
              <th className="px-4 py-5 w-12 text-center align-middle" style={headerStyle}>
                 <input type="checkbox" checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0} onChange={toggleSelectAll} className="w-5 h-5 cursor-pointer accent-indigo-600 rounded" />
              </th>
              <th className="px-6 py-5" style={headerStyle}>ID</th>
              <th className="px-6 py-5" style={headerStyle}>ZONA / NOME</th>
              <th className="px-6 py-5" style={headerStyle}>BAIRRO</th>
              <th className="px-6 py-5" style={headerStyle}>REFERÊNCIA</th>
              <th className="px-6 py-5 text-right" style={headerStyle}>AÇÕES</th>
            </tr>
          </thead>
          <tbody className={`divide-y-2 ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
            {filteredDevices.map(dev => (
              <tr key={dev.id} className={`group transition-colors ${selectedDevices.includes(dev.id) ? (isDark ? 'bg-indigo-900/30' : 'bg-indigo-50/80') : (isDark ? 'hover:bg-slate-800/30' : 'hover:bg-indigo-50/50')}`}>
                <td className="px-4 py-5 text-center align-middle">
                  <input type="checkbox" checked={selectedDevices.includes(dev.id)} onChange={() => toggleSelection(dev.id)} className="w-5 h-5 cursor-pointer accent-indigo-600 rounded" />
                </td>
                <td className="px-6 py-5 text-sm font-black" style={dataStyle}>
                  {dev.moqa_id || `#${dev.id}`}
                  {dev.legacy_id && <div className="text-xs text-gray-400 font-normal mt-1">Antigo: {dev.legacy_id}</div>}
                </td>
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
          <div key={dev.id} className={`p-6 rounded-2xl border-2 transition-all ${selectedDevices.includes(dev.id) ? (isDark ? 'bg-indigo-900/40 border-indigo-700' : 'bg-indigo-50 border-indigo-300') : (isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200')}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-4">
                <input type="checkbox" checked={selectedDevices.includes(dev.id)} onChange={() => toggleSelection(dev.id)} className="w-6 h-6 mt-1 cursor-pointer accent-indigo-600 rounded" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    {dev.moqa_id || `#${dev.id}`}
                    {dev.legacy_id && ` (ANTIGO: ${dev.legacy_id})`}
                  </span>
                  <h3 className="text-xl" style={dataStyle}>{dev.zone}</h3>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
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
