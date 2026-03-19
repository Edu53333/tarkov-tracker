import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { CheckCircle, Circle, Check, Map, ExternalLink, Trophy, Lock } from 'lucide-react';

const KappaTracker: React.FC = () => {
  const { state, addCompletedQuest, removeCompletedQuest, apiData } = useAppContext();
  const [expandedTrader, setExpandedTrader] = useState<string | null>('Prapor');

  if (!apiData) return null;

  // Global Kappa Progress
  const kappaQuests = useMemo(() => apiData.tasks.filter(q => q.kappaRequired), [apiData]);
  const completedKappaCount = kappaQuests.filter(q => state.completedQuests.includes(q.id)).length;
  const missingKappaCount = kappaQuests.length - completedKappaCount;
  const globalProgress = kappaQuests.length > 0 ? Math.round((completedKappaCount / kappaQuests.length) * 100) : 0;
  
  const pLevel = state.playerLevel || 1;
  const traderImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    kappaQuests.forEach(q => {
      if (q.trader.name && q.trader.imageLink && !map[q.trader.name]) {
        map[q.trader.name] = q.trader.imageLink;
      }
    });
    return map;
  }, [kappaQuests]);

  const traders = Object.keys(traderImagesMap).sort();

  if (expandedTrader && !traders.includes(expandedTrader)) {
     setExpandedTrader(traders[0]);
  }

  // Pre-sort quests based on current progression constraints and state
  const questsToDisplay = kappaQuests
    .filter(q => q.trader.name === expandedTrader)
    .sort((a, b) => {
      const aComp = state.completedQuests.includes(a.id);
      const bComp = state.completedQuests.includes(b.id);
      
      const aLocked = a.minPlayerLevel ? a.minPlayerLevel > pLevel : false;
      const bLocked = b.minPlayerLevel ? b.minPlayerLevel > pLevel : false;

      // Completed pushes to bottom
      if (aComp && !bComp) return 1;
      if (!aComp && bComp) return -1;
      
      // Locked pushes below available, but above completed
      if (aLocked && !bLocked) return 1;
      if (!aLocked && bLocked) return -1;

      return (a.minPlayerLevel || 0) - (b.minPlayerLevel || 0);
    });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      
      {/* Global Kappa Progress Header */}
      <div className="mb-8 shrink-0 bg-gradient-to-br from-tactical-panel to-[#0f120f] border border-yellow-600/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/20 transition-all duration-700"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
           <div>
             <div className="flex items-center gap-3 mb-2">
               <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
               <h2 className="text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Collector Protocols</h2>
             </div>
             
             {/* Big totals requested by user */}
             <div className="flex items-center gap-4 mt-3">
               <span className="bg-yellow-900/30 text-yellow-500 border border-yellow-600/40 px-3 py-1 font-black uppercase tracking-widest rounded shadow-sm text-sm">
                 {kappaQuests.length} Total Needed
               </span>
               <span className="bg-red-900/20 text-red-500 border border-red-900/40 px-3 py-1 font-black uppercase tracking-widest rounded shadow-sm text-sm">
                 {missingKappaCount} Remaining
               </span>
             </div>
           </div>

           <div className="flex-1 md:max-w-md">
             <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-black tracking-widest uppercase text-yellow-500/80">Global Completion</span>
               <span className="text-2xl font-black text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">{globalProgress}%</span>
             </div>
             <div className="h-4 w-full bg-black/60 rounded-full border border-yellow-900/40 overflow-hidden shadow-inner flex relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-pulse z-20 pointer-events-none"></div>
                <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.8)] relative z-10" style={{ width: `${globalProgress}%` }}></div>
             </div>
             <div className="mt-2 text-right text-[10px] font-black uppercase tracking-widest text-tactical-gray">
               {completedKappaCount} / {kappaQuests.length} Secured
             </div>
           </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0">
        {/* Traders Sidebar */}
        <div className="w-full md:w-64 flex md:flex-col gap-3 overflow-x-auto overflow-y-auto pb-4 md:pb-0 pr-2 custom-scrollbar shrink-0">
          {traders.map(t => {
            const traderKappaQuests = kappaQuests.filter(q => q.trader.name === t);
            const traderCompleted = traderKappaQuests.filter(q => state.completedQuests.includes(q.id)).length;
            const traderMissing = traderKappaQuests.length - traderCompleted;
            const isFinishedTrader = traderKappaQuests.length > 0 && traderCompleted === traderKappaQuests.length;

            return (
              <button
                key={t}
                onClick={() => setExpandedTrader(t)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 relative overflow-hidden group border
                  ${expandedTrader === t 
                    ? 'bg-gradient-to-r from-yellow-900/40 to-tactical-panel border-yellow-600/50 text-white shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                    : 'bg-tactical-panel/60 backdrop-blur-sm border-tactical-border/40 text-tactical-gray hover:text-white hover:border-yellow-600/30 hover:bg-tactical-panel/90'}`}
              >
                {expandedTrader === t && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 z-10 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>}
                
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border overflow-hidden shrink-0 transition-colors ${isFinishedTrader ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] bg-yellow-500/20' : 'bg-black/50 border-tactical-border group-hover:border-tactical-gray'}`}>
                  {isFinishedTrader && <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40"><CheckCircle className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,1)]" /></div>}
                  {traderImagesMap[t] ? (
                    <img src={traderImagesMap[t]} alt={t} className={`w-full h-full object-cover ${isFinishedTrader ? 'opacity-30 mix-blend-luminosity' : ''}`} />
                  ) : (
                    <span className="font-bold text-xs">{t.substring(0,2).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col relative z-10 w-full overflow-hidden shrink min-w-0">
                  <span className="font-black tracking-wide truncate">{t}</span>
                  <div className="flex justify-between items-center mt-0.5">
                     {isFinishedTrader ? (
                       <span className="text-[10px] uppercase font-black tracking-widest text-yellow-500">Completed</span>
                     ) : (
                       <>
                         <span className="text-[9px] uppercase font-bold text-red-400 truncate">{traderMissing} Missing</span>
                         <span className="text-[10px] font-black tracking-widest text-tactical-gray">{traderCompleted}/{traderKappaQuests.length}</span>
                       </>
                     )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quest List */}
        <div className="flex-1 space-y-5 overflow-y-auto pr-3 pb-10 custom-scrollbar">
          {questsToDisplay.map(q => {
             const isCompleted = state.completedQuests.includes(q.id);
             const isLocked = !isCompleted && (q.minPlayerLevel ? q.minPlayerLevel > pLevel : false);

             return (
               <div key={q.id} className={`relative overflow-hidden border rounded-xl p-6 transition-all duration-300 shadow-lg group
                 ${isCompleted 
                    ? 'border-yellow-900/30 bg-[#0f120f]/80 backdrop-blur-sm opacity-50' 
                    : isLocked
                      ? 'border-red-900/30 bg-black/60 opacity-60 grayscale'
                      : 'border-yellow-600/30 bg-tactical-panel/80 backdrop-blur-md hover:border-yellow-500/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:-translate-y-0.5'}`}>
                 
                 {!isCompleted && !isLocked && <div className="absolute -right-20 -top-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/10 transition-colors"></div>}
                 
                 {!isCompleted && q.taskImageLink && (
                   <div className={`absolute top-0 right-0 w-1/2 h-full pointer-events-none mix-blend-screen overflow-hidden transition-opacity duration-1000 ${isLocked ? 'opacity-5 mix-blend-luminosity' : 'opacity-10 group-hover:opacity-[0.15] grayscale group-hover:grayscale-0 sepia'}`}>
                     <div className="absolute inset-0 bg-gradient-to-r from-tactical-panel via-transparent to-transparent z-10"></div>
                     <img src={q.taskImageLink} className="w-full h-full object-cover" loading="lazy" />
                   </div>
                 )}

                 <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6 relative z-10">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {isLocked ? (
                         <span className="bg-red-900/20 text-red-500 border border-red-900/40 px-2.5 py-1 text-xs font-black uppercase tracking-widest rounded shadow-[0_0_10px_rgba(153,27,27,0.3)] flex items-center gap-1.5 backdrop-blur-sm">
                           <Lock className="w-3.5 h-3.5" /> Blocked (Req. Lvl {q.minPlayerLevel})
                         </span>
                        ) : (
                          q.minPlayerLevel && q.minPlayerLevel > 1 && (
                            <span className="bg-tactical-bg text-tactical-gray border border-tactical-border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded shadow-inner">
                              Lvl {q.minPlayerLevel} Unlock
                            </span>
                          )
                        )}
                        {q.map?.name && (
                          <span className="bg-yellow-900/20 text-yellow-600/80 border border-yellow-900/50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                            <Map className="w-3 h-3" /> Area: {q.map.name}
                          </span>
                        )}
                     </div>
                     <h3 className={`text-2xl font-black flex items-center gap-3 tracking-wide ${isCompleted ? 'text-yellow-700 line-through' : isLocked ? 'text-tactical-gray' : 'text-yellow-500'}`}>
                       {isCompleted ? <CheckCircle className="w-7 h-7 shrink-0 drop-shadow-[0_0_5px_rgba(202,138,4,0.8)]" /> : isLocked ? <Lock className="w-6 h-6 shrink-0 text-red-500/50" /> : <Trophy className="w-6 h-6 shrink-0 text-yellow-600" />}
                       {q.name}
                     </h3>
                     
                     <div className="mt-5 bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-tactical-border/40 shadow-inner">
                       <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {q.objectives.map((obj, i) => (
                           <li key={i} className={`flex items-start gap-4 p-3 rounded-lg bg-tactical-panel/50 border border-tactical-border/50 transition-colors ${!isLocked && !isCompleted ? 'hover:bg-tactical-panel' : ''} ${isCompleted ? 'opacity-40 grayscale' : ''}`}>
                             {obj.item ? (
                               <>
                                 <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-tactical-bg to-black rounded-lg flex items-center justify-center p-1.5 border border-tactical-border shadow-sm">
                                   {obj.item.iconLink ? (
                                     <img src={obj.item.iconLink} alt={obj.item.name} className="max-w-full max-h-full object-contain drop-shadow-md" loading="lazy" />
                                   ) : (
                                     <div className="w-4 h-4 rounded-full bg-tactical-gray"></div>
                                   )}
                                 </div>
                                 <div className="flex-1 min-w-0 flex flex-col justify-center">
                                   <p className="text-sm font-bold text-gray-100 truncate" title={obj.item.name}>{obj.item.name}</p>
                                   <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                     <p className={`text-xs font-black px-2 py-0.5 rounded border ${isLocked ? 'bg-red-900/20 text-red-500 border-red-900/30' : 'bg-orange-500/10 text-tactical-orange border-orange-500/20 shadow-sm'}`}>Target: {obj.count}</p>
                                     {obj.foundInRaid && <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 text-[10px] uppercase font-black tracking-wider shadow-sm">FiR</span>}
                                   </div>
                                   {obj.description && <p className="text-xs text-tactical-gray mt-2 italic leading-relaxed">{obj.description}</p>}
                                 </div>
                               </>
                             ) : (
                               <div className="flex-1 min-w-0 py-1.5">
                                 <div className="flex items-start gap-3">
                                   <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isLocked ? 'bg-red-900' : 'bg-yellow-600 shadow-[0_0_5px_rgba(202,138,4,0.8)]'}`}></div>
                                   <p className="text-sm font-medium text-gray-300 leading-snug">{obj.description || 'Unknown Directive'}</p>
                                 </div>
                               </div>
                             )}
                           </li>
                         ))}
                       </ul>

                       {q.wikiLink && !isLocked && (
                         <div className="mt-5 pt-4 border-t border-tactical-border/30 flex justify-end">
                           <a 
                             href={q.wikiLink} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="text-[10px] font-black tracking-widest uppercase text-yellow-600 hover:text-yellow-400 flex items-center gap-1.5 transition-colors bg-tactical-bg border border-tactical-border hover:border-yellow-600/50 px-3 py-1.5 rounded"
                           >
                              <ExternalLink className="w-3.5 h-3.5" /> Launch External Topography Data
                           </a>
                         </div>
                       )}
                     </div>
                   </div>
                   
                   <button
                     onClick={() => !isLocked ? (isCompleted ? removeCompletedQuest(q.id) : addCompletedQuest(q.id)) : null}
                     disabled={isLocked}
                     className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-black tracking-widest uppercase transition-all xl:self-start w-full xl:w-auto
                       ${isCompleted 
                          ? 'bg-transparent text-tactical-gray border-2 border-tactical-border hover:text-white hover:border-tactical-gray hover:bg-tactical-panel' 
                          : isLocked
                            ? 'bg-tactical-bg border border-tactical-border text-tactical-gray/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-yellow-700 to-yellow-600 text-black hover:brightness-110 shadow-[0_0_20px_rgba(202,138,4,0.4)] hover:shadow-[0_0_25px_rgba(202,138,4,0.6)] border border-yellow-500/50 hover:bg-yellow-500'}`}
                   >
                     {isLocked ? <><Lock className="w-5 h-5" /> Classified</> : (isCompleted ? 'Reactivate' : <><Check className="w-5 h-5" /> Mark Secure</>)}
                   </button>
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};
export default KappaTracker;
