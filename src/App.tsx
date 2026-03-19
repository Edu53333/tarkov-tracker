import React, { useState, useEffect } from 'react';
import { LayoutGrid, ListTodo, Wrench, Package, Menu, ServerCrash, Trophy, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuestManager from './components/QuestManager';
import HideoutManager from './components/HideoutManager';
import ItemTracker from './components/ItemTracker';
import KappaTracker from './components/KappaTracker';
import { useTarkovData } from './hooks/useTarkovData';
import { useAppContext } from './store/AppContext';
import { translations } from './i18n/translations';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, setApiData, setPlayerLevel, setLanguage } = useAppContext();
  const { data, loading, error } = useTarkovData(state.language);
  const t = translations[state.language || 'en'];

  useEffect(() => {
    if (data) {
      setApiData(data);
    }
  }, [data, setApiData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c0e] text-[#4d5e46] overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#2a2d32] border-t-[#4d5e46] rounded-full animate-spin"></div>
          <p className="mt-6 font-bold tracking-widest uppercase text-xl text-[#868f97]">
            {state.language === 'es' ? 'Cargando Inteligencia...' : 'Loading Intelligence...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c0e] text-red-500 overflow-hidden text-center p-6">
        <div>
          <ServerCrash className="w-20 h-20 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-3 tracking-wider">
            {state.language === 'es' ? 'Fallo de Conexión al Servidor' : 'Server Connection Failed'}
          </h2>
          <p className="text-[#868f97] mb-8 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: t.sidebar.dashboard, icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'quests', name: t.sidebar.quests, icon: <ListTodo className="w-5 h-5" /> },
    { id: 'items', name: t.sidebar.items, icon: <Package className="w-5 h-5" /> },
    { id: 'hideout', name: t.sidebar.hideout, icon: <Wrench className="w-5 h-5" /> },
    { id: 'kappa', name: t.sidebar.kappa, icon: <Trophy className="w-5 h-5" /> }
  ];

  return (
    <div className="flex h-screen bg-[#0b0c0e] text-[#e8e6e3] overflow-hidden">
      
      {/* Background Image Setup mimicking the woodland blur */}
      <div className="absolute inset-0 z-0">
         <img src="https://assets.tarkov.dev/maps/woods.jpg" alt="Woods" className="w-full h-full object-cover opacity-60 filter blur-xl shadow-2xl brightness-50" />
         <div className="absolute inset-0 bg-[#0b0c0e]/60"></div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar based exactly on screenshot styling */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#111315] border-r border-[#2a2d32] transform transition-transform duration-300 z-50 md:relative md:translate-x-0 shadow-2xl flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Section */}
        <div className="flex flex-col items-center py-8">
           <Compass className="w-[80px] h-[80px] text-[#e0dfdc] opacity-90 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-4" />
           <h1 className="font-bold text-2xl tracking-widest text-[#e8e6e3] uppercase text-center leading-tight px-4">Tarkov Tracker</h1>
        </div>

        {/* Level block */}
        <div className="w-full px-4 mb-4">
           <div className="flex flex-col items-end py-2 opacity-90 hover:opacity-100 transition-opacity bg-[#1c1e21]/50 p-4 rounded border border-[#2a2d32]/50">
               <div className="flex items-center gap-2 mb-1 w-full justify-between">
                 <span className="text-[11px] text-[#868f97] uppercase tracking-widest font-bold">{t.sidebar.pmcLevel}</span>
                 <button onClick={() => setPlayerLevel(Math.min(75, (state.playerLevel || 1) + 1))} className="text-[#868f97] hover:text-[#e8e6e3]"><ChevronUp className="w-4 h-4" /></button>
               </div>
               <div className="flex items-center justify-between gap-2 w-full">
                 <button onClick={() => setPlayerLevel(Math.max(1, (state.playerLevel || 1) - 1))} className="text-[#868f97] hover:text-[#e8e6e3] pt-2"><ChevronDown className="w-4 h-4" /></button>
                 <span className="text-[46px] leading-none font-bold text-[#e8e6e3] drop-shadow-md">{state.playerLevel || 1}</span>
               </div>
           </div>
        </div>

        {/* Language Selector */}
        <div className="w-full px-4 mb-8">
           <div className="flex items-center justify-between bg-[#1c1e21]/30 p-2 rounded border border-[#2a2d32]/30">
              <span className="text-[10px] text-[#868f97] uppercase tracking-[0.2em] font-black pl-2">{t.sidebar.language}</span>
              <div className="flex gap-1">
                 <button 
                   onClick={() => setLanguage('en')}
                   className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${state.language === 'en' ? 'bg-tactical-olive text-white shadow-sm' : 'text-[#868f97] hover:text-white'}`}
                 >
                   EN
                 </button>
                 <button 
                   onClick={() => setLanguage('es')}
                   className={`px-2 py-1 rounded text-[10px] font-black uppercase transition-all ${state.language === 'es' ? 'bg-tactical-olive text-white shadow-sm' : 'text-[#868f97] hover:text-white'}`}
                 >
                   ES
                 </button>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="w-full flex flex-col px-2 gap-0.5 flex-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-sm text-left transition-all font-semibold uppercase tracking-wide text-[13px]
                ${activeTab === tab.id 
                  ? 'bg-[#2b3036] text-[#e8e6e3] border-l-[3px] border-[#aeb3b7] shadow-sm' 
                  : 'text-[#868f97] hover:bg-[#1c1e21] border-l-[3px] border-transparent hover:text-[#aeb3b7]'}`}
            >
              <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-70'}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <header className="h-14 flex items-center px-4 bg-[#111315]/90 backdrop-blur border-b border-[#2a2d32] md:hidden shrink-0 shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-[#868f97] hover:text-[#e8e6e3]">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-bold text-lg tracking-wide uppercase">{tabs.find(t => t.id === activeTab)?.name}</span>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12">
          {/* Header Bar internal to the App */}
          <div className="max-w-7xl mx-auto flex items-center gap-4 border-b border-[#2a2d32]/50 pb-4 mb-8">
             <Menu className="w-5 h-5 text-[#868f97]" />
             <h2 className="text-xl font-bold text-[#e8e6e3] uppercase tracking-wider">{tabs.find(t => t.id === activeTab)?.name}</h2>
          </div>

          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'quests' && <QuestManager />}
            {activeTab === 'kappa' && <KappaTracker />}
            {activeTab === 'hideout' && <HideoutManager />}
            {activeTab === 'items' && <ItemTracker />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
