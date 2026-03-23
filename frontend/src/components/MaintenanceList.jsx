import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, XCircle, Wrench, Trash2, Edit3, Download, ImageIcon, Calendar, Filter, Eraser } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const statusMap = {
  completed: {
    label: 'Concluído',
    className: 'text-green-700 bg-green-100',
    Icon: CheckCircle2,
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'text-blue-700 bg-blue-100',
    Icon: Wrench,
  },
  canceled: {
    label: 'Cancelado',
    className: 'text-red-700 bg-red-100',
    Icon: XCircle,
  },
  pending: {
    label: 'Pendente',
    className: 'text-yellow-700 bg-yellow-100',
    Icon: Clock,
  },
};

const MaintenanceList = ({ refreshKey, onEdit }) => {
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('RELATÓRIO DE MANUTENÇÕES - MOQA OS', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    let subtitle = `Emitido em: ${new Date().toLocaleString('pt-BR')}`;
    if (dateStart || dateEnd) {
      subtitle += ` | Período: ${dateStart || '?'} até ${dateEnd || 'hoje'}`;
    }
    doc.text(subtitle, 14, 28);

    const tableRows = filteredMaints.map(m => [
      `#${m.device}`,
      m.technician,
      m.description,
      m.status.toUpperCase(),
      new Date(m.created_at).toLocaleDateString('pt-BR')
    ]);

    doc.autoTable({
      startY: 35,
      head: [['MONITOR', 'TÉCNICO', 'DESCRIÇÃO DO SERVIÇO', 'STATUS', 'DATA']],
      body: tableRows,
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8, cellPadding: 4 }
    });

    doc.save('relatorio-filtrado-moqa.pdf');
  };

  if (loading) return <div className="flex justify-center items-center py-12 text-gray-500 font-medium font-sans italic">Carregando histórico...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans">
      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-in fade-in duration-300">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
            <Calendar size={12} /> Data Inicial
          </label>
          <input 
            type="date" 
            value={dateStart} 
            onChange={(e) => setDateStart(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
            <Calendar size={12} /> Data Final
          </label>
          <input 
            type="date" 
            value={dateEnd} 
            onChange={(e) => setDateEnd(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearFilters}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all border border-gray-200"
          >
            <Eraser size={14} /> LIMPAR
          </button>
          {filteredMaints.length > 0 && (
            <button 
              onClick={downloadPDF} 
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-900 transition-all shadow-md active:scale-95"
            >
              <Download size={14} /> PDF
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-200 rounded-lg">
              <Filter size={20} className="text-slate-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Histórico {filteredMaints.length < maintenances.length ? 'Filtrado' : ''} 
              <span className="text-gray-400 text-sm ml-2 font-normal">({filteredMaints.length} registros)</span>
            </h2>
          </div>
        </div>

        {filteredMaints.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm italic font-medium">
            Nenhuma manutenção encontrada no período selecionado.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredMaints.map((m) => {
              const info = statusMap[m.status] || statusMap.pending;
              const { Icon } = info;
              return (
                <li key={m.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {m.photo ? (
                        <img src={`http://localhost:8000${m.photo}`} alt="Foto serviço" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center text-gray-300">
                          <ImageIcon size={24} className="mx-auto" />
                          <span className="text-[10px] uppercase font-black tracking-tighter block mt-1">SEM FOTO</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900">Monitor #{m.device}</h3>
                        <span className={'flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border border-current opacity-90 ' + info.className}>
                          <Icon size={14} /> {info.label.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">{m.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
                        <span className="bg-gray-100 px-2 py-1 rounded-md border border-gray-200">TÉCNICO: {m.technician}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{new Date(m.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => onEdit(m)} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200 rounded-lg transition-all shadow-sm">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm">
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
