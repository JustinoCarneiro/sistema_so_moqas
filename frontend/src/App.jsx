import React from 'react';
import { Home, Settings, MapPin } from 'lucide-react';

function App() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <h1 className="text-2xl font-bold">MoQa OS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-700 transition-colors">
            <MapPin size={20} />
            <span>Dispositivos</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-slate-700 transition-colors">
            <Settings size={20} />
            <span>Configurações</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Sistema de Manutenção de Monitores</h2>
        </header>

        {/* Dynamic Page Content would go here */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao Novo MoQa</h3>
            <p className="text-gray-600 mb-6">A migração para a nova stack (React + Django) foi concluída com sucesso. A estrutura está limpa e pronta para receber as futuras telas do sistema.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-blue-50 rounded-md border border-blue-100 group hover:shadow-md transition-shadow">
                 <h4 className="font-semibold text-blue-800">Frontend Restruturado</h4>
                 <p className="text-sm text-blue-600 mt-1">Componentes funcionais, sem legado PO UI, com Tailwind CSS configurado.</p>
               </div>
               <div className="p-4 bg-green-50 rounded-md border border-green-100 group hover:shadow-md transition-shadow">
                 <h4 className="font-semibold text-green-800">Backend API-Livre</h4>
                 <p className="text-sm text-green-600 mt-1">Django Rest Framework integrado e comunicando com o banco PostgreSQL no Docker.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
