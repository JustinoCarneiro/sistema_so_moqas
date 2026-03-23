import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Monitor, Wrench, DollarSign, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeMaintenances: 0,
    pending: 0,
    in_progress: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devResp, maintResp] = await Promise.all([
          fetch('http://localhost:8000/api/devices/'),
          fetch('http://localhost:8000/api/maintenances/')
        ]);
        
        const devices = await devResp.json();
        const maints = await maintResp.json();

        const activeCounter = maints.filter(m => m.status !== 'completed' && m.status !== 'canceled').length;
        setStats({
          totalDevices: devices.length,
          activeMaintenances: activeCounter,
          pending: maints.filter(m => m.status === 'pending').length,
          in_progress: maints.filter(m => m.status === 'in_progress').length,
          completed: maints.filter(m => m.status === 'completed').length
        });
      } catch (err) {
        console.error('Erro ao processar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Analisando dados...</div>;

  const cardStyle = "bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 text-white rounded-lg"><LayoutDashboard size={24} /></div>
        <h2 className="text-2xl font-bold text-gray-800">Painel Geral</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Monitores Totais</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalDevices}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Monitor size={28} /></div>
        </div>

        <div className={cardStyle}>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Serviços Ativos</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">{stats.activeMaintenances}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full"><Clock size={28} /></div>
        </div>

        <div className={cardStyle}>
          <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Concluídos</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full"><Wrench size={28} /></div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wrench size={18} className="text-slate-400" /> 
          Progresso das Manutenções
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-400 block mb-1">AGUARDANDO</span>
            <span className="text-xl font-black text-gray-700">{stats.pending}</span>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-xs font-bold text-blue-400 block mb-1">EM ANDAMENTO</span>
            <span className="text-xl font-black text-blue-700">{stats.in_progress}</span>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <span className="text-xs font-bold text-green-400 block mb-1">CONCLUÍDOS</span>
            <span className="text-xl font-black text-green-700">{stats.completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
