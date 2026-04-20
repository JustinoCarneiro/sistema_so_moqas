import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings as IconSettings, MapPin, Wrench, ChevronLeft, Menu, Moon, Sun, ChevronUp, ChevronDown, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeviceForm from './components/DeviceForm';
import DeviceList from './components/DeviceList';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Modal from './components/Modal';
import { Plus } from 'lucide-react';

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
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false); // Default closed on mobile
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (root.classList.contains('dark')) root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleRefresh = () => setRefreshKey(prev => prev + 1);
  const resetEditing = () => {
    setEditingDevice(null);
    setEditingMaintenance(null);
    setIsDeviceModalOpen(false);
    setIsMaintenanceModalOpen(false);
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    resetEditing();
    if (isMobile) setSidebarOpen(false); 
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop > 300) setShowScrollTop(true);
    else setShowScrollTop(false);
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden text-black dark:text-slate-100 font-sans transition-colors duration-500 ${theme === 'dark' ? 'dark' : ''} bg-slate-950`}>
      
      {/* Botão Scroll to Top - Lado Direito Inferior */}
      <AnimatePresence>
        {isMobile && showScrollTop && !isSidebarOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-[60] p-3 bg-indigo-600 text-white rounded-full shadow-2xl border-2 border-indigo-400/50 flex items-center justify-center hover:bg-indigo-500 active:scale-90 transition-all"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Gatilho para fechar menu (apenas quando aberto no mobile) */}
      {isMobile && isSidebarOpen && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed bottom-6 right-6 z-[70] p-3 bg-slate-800 text-white rounded-full shadow-2xl border-2 border-slate-700 flex items-center justify-center active:scale-90 transition-all"
        >
          <ChevronDown size={24} />
        </motion.button>
      )}

      {/* Sidebar Luxo */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isMobile ? '100vw' : (isSidebarOpen ? 280 : 80),
          y: isMobile ? (isSidebarOpen ? 0 : '100vh') : 0,
          x: 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`glass-nav fixed md:relative z-50 h-screen transition-all overflow-hidden ${!isSidebarOpen && isMobile ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <div className={`p-4 flex h-20 items-center ${isSidebarOpen || isMobile ? 'justify-between' : 'justify-center flex-col gap-2'}`}>
          {(isSidebarOpen || isMobile) && (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="flex items-center gap-2"
            >
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent uppercase">
                MoQa OS
              </h1>
            </motion.div>
          )}
          <div className={`flex items-center gap-1 ${isSidebarOpen || isMobile ? 'ml-auto' : 'flex-col gap-2'}`}>
            {(isSidebarOpen || isMobile) && (
              <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            )}
            {!isMobile && (
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                aria-label="toggle-sidebar"
                data-testid="sidebar-toggle"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                data-testid={`nav-${item.id}`}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 group
                  ${isActive ? 'sidebar-item-active' : 'sidebar-item-hover text-slate-500'}
                `}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                  <Icon size={20} />
                </div>
                {(isSidebarOpen || isMobile) && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (isSidebarOpen || isMobile) && (
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
           <div className={`p-4 rounded-xl border-2 ${(isSidebarOpen || isMobile) ? (theme === 'dark' ? 'bg-indigo-900/20 border-indigo-800/50' : 'bg-indigo-50/50 border-indigo-100') : 'bg-transparent border-transparent'}`}>
             {(isSidebarOpen || isMobile) && (
               <div className="flex flex-col gap-1">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Unidade Local</p>
                 <p className="text-xs font-bold text-slate-600 dark:text-slate-400">CENTRAL 01</p>
               </div>
             )}
           </div>
        </div>
      </motion.aside>

      {/* Main Content Container */}
      <motion.div 
        animate={{
          y: isMobile && isSidebarOpen ? '-100vh' : 0,
          scale: isMobile && isSidebarOpen ? 0.9 : 1,
          opacity: isMobile && isSidebarOpen ? 0.5 : 1
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex-1 flex flex-col h-screen overflow-hidden"
      >
        {/* Header Mobile */}
        {isMobile && (
          <header className={`h-16 px-4 flex items-center justify-between z-40 border-b transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 to-slate-500 bg-clip-text text-transparent uppercase">
              MoQa OS
            </h1>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>
          </header>
        )}

        {/* Main View Area */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className={`flex-1 overflow-y-auto relative px-4 py-6 md:px-12 md:py-12 custom-scrollbar ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}
        >
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                
                {activeTab === 'dashboard' && <Dashboard theme={theme} />}

                {activeTab === 'devices' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-2xl font-black tracking-tight ${theme === 'light' ? 'text-black' : 'text-slate-100'}`}>Gerenciar Monitores</h2>
                      <button 
                        onClick={() => setIsDeviceModalOpen(true)}
                        data-testid="new-device-btn"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                      >
                        <Plus size={18} /> Novo Monitor
                      </button>
                    </div>
                    <DeviceList 
                      refreshKey={refreshKey} 
                      onEdit={(dev) => { 
                        setEditingDevice(dev); 
                        setIsDeviceModalOpen(true);
                      }} 
                      theme={theme} 
                    />
                    <Modal 
                      isOpen={isDeviceModalOpen} 
                      onClose={resetEditing} 
                      title={editingDevice ? "Editar Monitor" : "Cadastrar Novo Monitor"}
                      theme={theme}
                    >
                      <DeviceForm 
                        onSuccess={() => { handleRefresh(); resetEditing(); }} 
                        editingDevice={editingDevice} 
                        onCancel={resetEditing} 
                        theme={theme} 
                      />
                    </Modal>
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className={`text-2xl font-black tracking-tight ${theme === 'light' ? 'text-black' : 'text-slate-100'}`}>Ordens de Serviço</h2>
                      <button 
                        onClick={() => setIsMaintenanceModalOpen(true)}
                        data-testid="new-maint-btn"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                      >
                        <Plus size={18} /> Nova Manutenção
                      </button>
                    </div>
                    <MaintenanceList 
                      refreshKey={refreshKey} 
                      onEdit={(m) => { 
                        setEditingMaintenance(m); 
                        setIsMaintenanceModalOpen(true);
                      }} 
                      theme={theme} 
                    />
                    <Modal 
                      isOpen={isMaintenanceModalOpen} 
                      onClose={resetEditing} 
                      title={editingMaintenance ? "Editar Ordem de Serviço" : "Nova Manutenção"}
                      theme={theme}
                    >
                      <MaintenanceForm 
                        onSuccess={() => { handleRefresh(); resetEditing(); }} 
                        editingMaintenance={editingMaintenance} 
                        onCancel={resetEditing} 
                        theme={theme} 
                      />
                    </Modal>
                  </div>
                )}

                {activeTab === 'settings' && <Settings theme={theme} />}

              </motion.div>
            </AnimatePresence>

            <footer className="pt-12 text-center text-slate-300 dark:text-slate-600">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase">Built with MoQa Design System ∙ 2026</p>
            </footer>
          </div>
        </main>
      </motion.div>
    </div>
  );
}

export default App;
