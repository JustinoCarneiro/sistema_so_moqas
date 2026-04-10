import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Wrench, Trash2, Edit3, ImageIcon, Calendar, Filter, Eraser, FileSpreadsheet } from 'lucide-react';

const statusMap = {
  completed: {
    label: 'Concluído',
    className: 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
    Icon: CheckCircle2,
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
    Icon: Wrench,
  },
  canceled: {
    label: 'Cancelado',
    className: 'text-red-700 bg-red-100 dark:text-red-500 dark:bg-red-900/20',
    Icon: XCircle,
  },
  pending: {
    label: 'Pendente',
    className: 'text-yellow-700 bg-yellow-100 dark:text-yellow-500 dark:bg-yellow-900/20',
    Icon: Clock,
  },
};

const MaintenanceList = ({ refreshKey, onEdit, theme }) => {
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaints, setFilteredMaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtro
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const fetchMaintenances = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/maintenances/');
      if (response.ok) {
        const data = await response.json();
        setMaintenances(data);
        setFilteredMaints(data);
      }
    } catch (err) {
      console.error('Erro ao buscar manutenções:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances();
  }, [refreshKey]);

  // Lógica de Filtro em tempo real
  useEffect(() => {
    let result = [...maintenances];

    if (dateStart) {
      const start = new Date(dateStart + "T00:00:00");
      result = result.filter(m => new Date(m.created_at) >= start);
    }

    if (dateEnd) {
      const end = new Date(dateEnd + "T23:59:59");
      result = result.filter(m => new Date(m.created_at) <= end);
    }

    setFilteredMaints(result);
  }, [dateStart, dateEnd, maintenances]);

  const clearFilters = () => {
    setDateStart('');
    setDateEnd('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/maintenances/${id}/`, { method: 'DELETE' });
        if (response.ok) fetchMaintenances();
      } catch (err) {
        alert('Erro ao excluir manutenção.');
      }
    }
  };



  const downloadCSV = () => {
    if (filteredMaints.length === 0) return;
    const headers = ['MONITOR', 'ID ANTIGO', 'ZONA', 'BAIRRO', 'REFERÊNCIA', 'TÉCNICO', 'DESCRIÇÃO DO SERVIÇO', 'STATUS', 'DATA'];
    const rows = filteredMaints.map(m => [
      m.device_moqa_id || `#${m.device}`,
      m.device_legacy_id || '',
      m.device_zone || '',
      m.device_neighborhood || '',
      m.device_reference || '',
      m.technician,
      m.description,
      m.status.toUpperCase(),
      new Date(m.created_at).toLocaleDateString('pt-BR')
    ]);
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'relatorio_manutencoes_moqa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center items-center py-12 text-gray-500 dark:text-slate-400 font-medium font-sans italic">Carregando histórico...</div>;

  const isDark = theme === 'dark';
  const filterContainerClass = `p-5 rounded-xl border-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-in fade-in duration-300 transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`;
  const listContainerClass = `rounded-xl border-2 overflow-hidden transition-colors ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'}`;
  const inputClass = `w-full px-4 py-2 border-2 rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-300 text-black font-bold'}`;

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      {/* Barra de Filtros */}
      <div className={filterContainerClass}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
            <Calendar size={12} /> Data Inicial
          </label>
          <input 
            type="date" 
            value={dateStart} 
            onChange={(e) => setDateStart(e.target.value)}
            className={inputClass} 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
            <Calendar size={12} /> Data Final
          </label>
          <input 
            type="date" 
            value={dateEnd} 
            onChange={(e) => setDateEnd(e.target.value)}
            className={inputClass} 
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearFilters}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'}`}
          >
            <Eraser size={14} /> LIMPAR
          </button>
          {filteredMaints.length > 0 && (
            <button 
              onClick={downloadCSV} 
              className={`flex-1 flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            >
              <FileSpreadsheet size={14} /> CSV
            </button>
          )}
        </div>
      </div>

      <div className={listContainerClass}>
        <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <Filter size={20} className={isDark ? 'text-slate-300' : 'text-slate-700'} />
            </div>
            <h2 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-black'}`}>
              Histórico {filteredMaints.length < maintenances.length ? 'Filtrado' : ''} 
              <span className={`text-sm ml-2 font-bold ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>({filteredMaints.length} registros)</span>
            </h2>
          </div>
        </div>

        {filteredMaints.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm italic font-medium">
            Nenhuma manutenção encontrada no período selecionado.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredMaints.map((m) => {
              const info = statusMap[m.status] || statusMap.pending;
              const { Icon } = info;
              return (
                <li key={m.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-6">
                    <div className={`w-24 h-24 flex-shrink-0 border rounded-lg overflow-hidden flex items-center justify-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                      {m.photos && m.photos.length > 0 ? (
                        <div className="w-full h-full relative">
                          <img src={m.photos[0].photo.startsWith('http') ? m.photos[0].photo : `http://localhost:8000${m.photos[0].photo}`} alt="Foto serviço" className="w-full h-full object-cover" />
                          {m.photos.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                              +{m.photos.length - 1} FOTOS
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`text-center ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>
                          <ImageIcon size={24} className="mx-auto" />
                          <span className="text-[10px] uppercase font-black tracking-tighter block mt-1">SEM FOTOS</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">Monitor {m.device_moqa_id || `#${m.device}`}</h3>
                        <span className={'flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border border-current opacity-90 ' + info.className}>
                          <Icon size={14} /> {info.label.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 leading-relaxed line-clamp-2">{m.description}</p>
                      <div className={`flex flex-wrap gap-2 text-xs font-black uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-900'}`}>
                        <span className={`px-2 py-1 rounded-md border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>TÉCNICO: {m.technician}</span>
                        <span className={`px-2 py-1 rounded-md border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>{new Date(m.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => onEdit(m)} data-testid="edit-maint-btn" className={`p-2 border rounded-lg transition-all shadow-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-amber-400 hover:bg-amber-900/20 hover:border-amber-900/30' : 'bg-white border-gray-200 text-gray-400 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200'}`}>
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} data-testid="delete-maint-btn" className={`p-2 border rounded-lg transition-all shadow-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-red-400 hover:bg-red-900/20 hover:border-red-900/30' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200'}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;
