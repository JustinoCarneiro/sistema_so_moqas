import React, { useState } from 'react';
import { Home, Settings as IconSettings, MapPin, Wrench, ChevronRight, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeviceForm from './components/DeviceForm';
import DeviceList from './components/DeviceList';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'devices', label: 'Monitoramento', icon: MapPin },
  { id: 'maintenance', label: 'Operacional', icon: Wrench },
  { id: 'settings', label: 'Configurações', icon: IconSettings },
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingDevice, setEditingDevice] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);
  const resetEditing = () => {
    setEditingDevice(null);
    setEditingMaintenance(null);
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    resetEditing();
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar Luxo */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="glass-nav relative flex flex-col z-50 h-screen transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <span className="font-black text-xs">M</span>
              </div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent uppercase">MoQa OS</h1>
            </motion.div>
          )}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all ml-auto"
          >
            {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group
                  ${isActive ? 'sidebar-item-active' : 'sidebar-item-hover text-slate-500'}
                `}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                  <Icon size={20} />
                </div>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill" 
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" 
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
           <div className={`p-4 rounded-xl shadow-inner ${isSidebarOpen ? 'bg-indigo-50/50' : 'bg-transparent'}`}>
             {isSidebarOpen && (
               <div className="flex flex-col gap-1">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Unidade Local</p>
                 <p className="text-xs font-bold text-slate-600">CENTRAL 01</p>
               </div>
             )}
           </div>
        </div>
      </motion.aside>

      {/* Main Content Luxo */}
      <main className="flex-1 overflow-y-auto relative bg-transparent px-4 py-4 md:px-12 md:py-12 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              
              {activeTab === 'dashboard' && <Dashboard />}

              {activeTab === 'devices' && (
                <div className="grid grid-cols-1 gap-8">
                  <DeviceForm onSuccess={handleRefresh} editingDevice={editingDevice} onCancel={resetEditing} />
                  <DeviceList refreshKey={refreshKey} onEdit={(dev) => { setEditingDevice(dev); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="grid grid-cols-1 gap-8">
                  <MaintenanceForm onSuccess={handleRefresh} editingMaintenance={editingMaintenance} onCancel={resetEditing} />
                  <MaintenanceList refreshKey={refreshKey} onEdit={(m) => { setEditingMaintenance(m); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                </div>
              )}

              {activeTab === 'settings' && <Settings />}

            </motion.div>
          </AnimatePresence>

          <footer className="pt-12 text-center text-slate-300">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase">Built with MoQa Design System ∙ 2026</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
