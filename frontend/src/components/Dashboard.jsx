import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Monitor, Wrench, DollarSign, Clock } from 'lucide-react';

const Dashboard = ({ theme }) => {
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

  const isDark = theme === 'dark';
  const cardStyle = `p-6 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;
  const sectionStyle = `p-8 rounded-xl border-2 transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;
  const subCardStyle = `p-4 rounded-lg border-2 transition-all duration-300`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>
          <LayoutDashboard size={24} />
        </div>
        <h2 className={`text-2xl font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-black'}`}>Painel Geral</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cardStyle}>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Monitores Totais</p>
            <h3 className={`text-3xl font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{stats.totalDevices}</h3>
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Monitor size={28} />
          </div>
        </div>

        <div className={cardStyle}>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Serviços Ativos</p>
            <h3 className={`text-3xl font-black mt-1 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>{stats.activeMaintenances}</h3>
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
            <Clock size={28} />
          </div>
        </div>

        <div className={cardStyle}>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Total Concluídos</p>
            <h3 className={`text-3xl font-black mt-1 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`}>{stats.completed}</h3>
          </div>
          <div className={`p-3 rounded-full ${isDark ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
            <Wrench size={28} />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className={sectionStyle}>
        <h4 className={`font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
          <Wrench size={18} className={isDark ? 'text-slate-500' : 'text-slate-400'} /> 
          Progresso das Manutenções
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${subCardStyle} ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-300'}`}>
            <span className={`text-xs font-black block mb-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>AGUARDANDO</span>
            <span className={`text-3xl font-black ${isDark ? 'text-slate-300' : 'text-black'}`}>{stats.pending}</span>
          </div>
          <div className={`${subCardStyle} ${isDark ? 'bg-blue-900/20 border-blue-900/30' : 'bg-blue-50 border-blue-300'}`}>
            <span className={`text-xs font-black block mb-1 ${isDark ? 'text-blue-50' : 'text-blue-700'}`}>EM ANDAMENTO</span>
            <span className={`text-3xl font-black ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>{stats.in_progress}</span>
          </div>
          <div className={`${subCardStyle} ${isDark ? 'bg-green-900/20 border-green-900/30' : 'bg-green-50 border-green-300'}`}>
            <span className={`text-xs font-black block mb-1 ${isDark ? 'text-green-500' : 'text-green-800'}`}>CONCLUÍDOS</span>
            <span className={`text-3xl font-black ${isDark ? 'text-green-300' : 'text-green-900'}`}>{stats.completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
