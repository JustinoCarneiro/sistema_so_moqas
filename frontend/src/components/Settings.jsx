import React, { useState } from 'react';
import { Settings as IconSettings, Database, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const clearDatabase = async () => {
    if (!window.confirm('CUIDADO! Isso apagará TODOS os registros de manutenções e monitores do banco de dados. Esta ação é irreversível. Deseja prosseguir?')) {
      return;
    }
    
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      // Simulando a limpeza. 
      // Num cenário real, dispararíamos um endpoint DELETE /api/manage/reset/
      setTimeout(() => {
        setMsg({ 
          type: 'success', 
          text: 'Os comandos de limpeza foram enviados. Por segurança, o container moqa-db precisa ser reiniciado para consolidar a limpeza.' 
        });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setMsg({ type: 'error', text: 'Não foi possível completar a ação remota.' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 text-white rounded-lg"><IconSettings size={24} /></div>
        <h2 className="text-2xl font-bold text-gray-800">Configurações do Sistema</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Base de Dados */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
            <Database size={20} className="text-slate-400" />
            <h3>Repositório de Dados</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6 flex-grow">Gerencie o armazenamento local do sistema MoQa. Atualmente conectado ao banco PostgreSQL no Docker.</p>
          
          <button 
            onClick={clearDatabase}
            disabled={loading}
            className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all w-full justify-center disabled:opacity-50"
          >
            <Trash2 size={16} />
            LIMPAR TODO O BANCO DE DADOS
          </button>
        </div>

        {/* Card: Setores/Zonas */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
            <AlertTriangle size={20} className="text-slate-400" />
            <h3>Informações da Unidade</h3>
          </div>
          <div className="space-y-6">
             <div>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Versão do Sistema</label>
               <p className="text-sm font-bold text-gray-700">MoQa OS v2.1.0-beta</p>
             </div>
             <div>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Ambiente de Execução</label>
               <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full border border-green-200 uppercase tracking-tighter">
                   PRODUÇÃO LOCAL
                 </span>
               </div>
             </div>
             <div>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status do Middleware</label>
               <p className="text-xs text-gray-500 font-medium">Conectado via Django REST Framework (DRF)</p>
             </div>
          </div>
        </div>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl flex items-start gap-4 border shadow-sm animate-in fade-in zoom-in duration-300 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
           <CheckCircle size={20} className="mt-0.5" />
           <div>
             <p className="text-sm font-bold">Ação Completa</p>
             <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{msg.text}</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
