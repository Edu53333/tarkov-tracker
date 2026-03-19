import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { CheckCircle, Circle, Check, Map, ExternalLink, Search } from 'lucide-react';
import { translations } from '../i18n/translations';

const QuestManager: React.FC = () => {
  const { state, addCompletedQuest, removeCompletedQuest, apiData } = useAppContext();
  const t = translations[state.language || 'en'];
  const [expandedTrader, setExpandedTrader] = useState<string | null>(t.quests.allTraders);
  const [selectedMap, setSelectedMap] = useState<string>(t.quests.allMaps);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!apiData) return null;

  const pLevel = state.playerLevel || 1;
  const allUnlockedQuests = apiData.tasks.filter(q => {
    // 1. Basic level check
    if (q.minPlayerLevel && q.minPlayerLevel > pLevel) return false;
    
    // 2. Objectives check (must have objectives to be valid)
    if (!q.objectives || q.objectives.length === 0) return false;

    // 3. Dependencies check
    if (q.taskRequirements && q.taskRequirements.length > 0) {
      const allDepsMet = q.taskRequirements.every(req => {
        // Check if any status in the requirement counts as "Completed"
        const isCompleteReq = req.status.some(s => s.toLowerCase() === 'complete' || s.toLowerCase() === 'completed');
        if (isCompleteReq) {
          return state.completedQuests.includes(req.task.id);
        }
        return true;
      });
      if (!allDepsMet) return false;
    }

    return true;
  });
  
  const maps = useMemo(() => {
    const mapSet = new Set<string>();
    apiData.tasks.forEach(q => {
      if (q.map?.name) mapSet.add(q.map.name);
    });
    return [t.quests.allMaps, ...Array.from(mapSet).sort()];
  }, [apiData, t.quests.allMaps]);

  const traderImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    apiData.tasks.forEach(q => {
      if (q.trader.name && q.trader.imageLink && !map[q.trader.name]) {
        map[q.trader.name] = q.trader.imageLink;
      }
    });
    return map;
  }, [apiData]);

  const traders = [t.quests.allTraders, ...Object.keys(traderImagesMap).sort()];

  if (expandedTrader && expandedTrader !== t.quests.allTraders && !traders.includes(expandedTrader)) {
     setExpandedTrader(t.quests.allTraders);
  }

  const questsToDisplay = allUnlockedQuests
    .filter(q => {
      const matchTrader = expandedTrader === t.quests.allTraders || q.trader.name === expandedTrader;
      const matchMap = selectedMap === t.quests.allMaps || q.map?.name === selectedMap;
      const matchSearch = !searchQuery || q.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTrader && matchMap && matchSearch;
    })
    .sort((a, b) => {
      const aComp = state.completedQuests.includes(a.id);
      const bComp = state.completedQuests.includes(b.id);
      
      if (aComp && !bComp) return 1;
      if (!aComp && bComp) return -1;
      
      return (a.minPlayerLevel || 0) - (b.minPlayerLevel || 0);
    });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.quests.title}</h2>
        <span className="bg-tactical-olive/20 text-tactical-olive border border-tactical-olive/30 px-3 py-1 text-sm font-bold rounded-full shadow-[0_0_10px_rgba(75,83,32,0.2)]">
          {questsToDisplay.length} {t.quests.availableAt} {pLevel}
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0 overflow-hidden">
        {/* Traders Sidebar */}
        <div className="w-full md:w-64 flex md:flex-col gap-3 overflow-x-auto overflow-y-auto pb-4 md:pb-0 pr-2 custom-scrollbar shrink-0">
          {traders.map(t_trader => {
            const unlockedForTrader = t_trader === t.quests.allTraders 
              ? allUnlockedQuests.length 
              : allUnlockedQuests.filter(q => q.trader.name === t_trader).length;
            
            return (
              <button
                key={t_trader}
                onClick={() => setExpandedTrader(t_trader)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 relative overflow-hidden group border
                  ${expandedTrader === t_trader 
                    ? 'bg-gradient-to-r from-tactical-olive/80 to-tactical-panel border-tactical-olive text-white shadow-[0_0_15px_rgba(75,83,32,0.3)]' 
                    : 'bg-tactical-panel/60 backdrop-blur-sm border-tactical-border/40 text-tactical-gray hover:text-white hover:border-tactical-gray/50 hover:bg-tactical-panel'}`}
              >
                {expandedTrader === t_trader && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tactical-orange z-10 shadow-[0_0_8px_#d35400]"></div>}
                
                <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 border border-tactical-border overflow-hidden shrink-0 group-hover:border-tactical-gray transition-colors">
                  {t_trader === t.quests.allTraders ? (
                    <CheckCircle className="w-6 h-6 text-tactical-olive" />
                  ) : traderImagesMap[t_trader] ? (
                    <img src={traderImagesMap[t_trader]} alt={t_trader} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-xs">{t_trader.substring(0,2).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex flex-col relative z-10 w-full overflow-hidden shrink min-w-0">
                  <span className="font-black tracking-wide truncate">{t_trader}</span>
                  <span className={`text-[10px] uppercase font-bold truncate ${unlockedForTrader > 0 ? 'text-tactical-olive' : 'text-tactical-gray/60'}`}>{unlockedForTrader} Unlocked</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quest List with Map Filter Top Bar */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Map Selection Bar & Search Bar */}
          <div className="flex flex-col xl:flex-row gap-4 mb-4 shrink-0">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {maps.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMap(m)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border
                    ${selectedMap === m 
                      ? 'bg-tactical-orange text-white border-tactical-orange shadow-[0_0_10px_rgba(211,84,0,0.3)]' 
                      : 'bg-black/40 text-tactical-gray border-tactical-border/40 hover:border-tactical-gray hover:text-white'}`}
                >
                  <Map className="w-3.5 h-3.5" />
                  {m}
                </button>
              ))}
            </div>
            
            <div className="relative group w-full xl:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-tactical-gray group-focus-within:text-tactical-orange transition-colors" />
              </div>
              <input
                type="text"
                placeholder={t.quests.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-tactical-border/60 text-white rounded-lg pl-10 pr-4 py-2 text-xs font-black uppercase tracking-widest placeholder-tactical-gray/40 focus:outline-none focus:border-tactical-orange/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pr-3 pb-10 custom-scrollbar">
            {questsToDisplay.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-tactical-gray/40 gap-4 opacity-50 bg-black/20 rounded-xl border border-dashed border-tactical-border/30">
                <Map className="w-16 h-16" />
                <p className="font-black uppercase tracking-widest">{t.quests.noDirectives}</p>
              </div>
            ) : (
              questsToDisplay.map(q => {
                const isCompleted = state.completedQuests.includes(q.id);

                return (
                  <div key={q.id} className={`relative overflow-hidden border rounded-xl p-6 transition-all duration-300 shadow-lg group
                    ${isCompleted 
                       ? 'border-tactical-olive/30 bg-[#0f120f]/80 backdrop-blur-sm opacity-60' 
                       : 'border-tactical-border/60 bg-tactical-panel/80 backdrop-blur-md hover:border-tactical-gray hover:shadow-xl hover:-translate-y-0.5'}`}>
                    
                    {!isCompleted && <div className="absolute -right-20 -top-20 w-40 h-40 bg-tactical-orange/5 rounded-full blur-3xl pointer-events-none group-hover:bg-tactical-orange/10 transition-colors"></div>}
                    
                    {!isCompleted && q.taskImageLink && (
                      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none mix-blend-screen overflow-hidden group-hover:opacity-20 transition-opacity duration-1000">
                        <div className="absolute inset-0 bg-gradient-to-r from-tactical-panel via-transparent to-transparent z-10"></div>
                        <img src={q.taskImageLink} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    )}

                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                           {q.map?.name && (
                             <span className="bg-tactical-olive/10 text-tactical-olive border border-tactical-olive/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded shadow-[0_0_5px_rgba(75,83,32,0.2)] flex items-center gap-1.5 backdrop-blur-sm">
                               <Map className="w-3 h-3" /> {t.quests.area}: {q.map.name}
                             </span>
                           )}
                           {q.minPlayerLevel && q.minPlayerLevel > 1 && (
                             <span className="bg-tactical-bg text-tactical-gray border border-tactical-border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded shadow-inner">
                               {t.quests.levelUnlock.replace('{0}', q.minPlayerLevel.toString())}
                             </span>
                           )}
                        </div>
                        <h3 className={`text-2xl font-black flex items-center gap-3 tracking-wide ${isCompleted ? 'text-tactical-olive line-through' : 'text-white'}`}>
                          {isCompleted ? <CheckCircle className="w-7 h-7 shrink-0 drop-shadow-[0_0_5px_rgba(75,83,32,0.8)]" /> : <Circle className="w-7 h-7 shrink-0 text-tactical-gray" />}
                          {q.name}
                        </h3>
                        
                        <div className="mt-5 bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-tactical-border/40 shadow-inner">
                          <h4 className="text-xs font-black text-tactical-gray uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full bg-tactical-orange/80 shadow-[0_0_8px_#d35400]`}></span>
                            {t.quests.reconLogistics}
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.objectives.map((obj, i) => (
                              <li key={i} className={`flex items-start gap-4 p-3 rounded-lg bg-tactical-panel/50 border border-tactical-border/50 hover:bg-tactical-panel transition-colors ${isCompleted ? 'opacity-40 grayscale' : ''}`}>
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
                                        <p className={`text-xs font-black px-2 py-0.5 rounded border bg-orange-500/10 text-tactical-orange border-orange-500/20 shadow-sm`}>{t.quests.target}: {obj.count}</p>
                                        {obj.foundInRaid && <span className="bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 text-[10px] uppercase font-black tracking-wider shadow-sm">{t.quests.fir}</span>}
                                      </div>
                                      {obj.description && <p className="text-xs text-tactical-gray mt-2 italic leading-relaxed">{obj.description}</p>}
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex-1 min-w-0 py-1.5">
                                    <div className="flex items-start gap-3">
                                      <div className="w-2 h-2 rounded-full bg-tactical-olive mt-1.5 shrink-0 shadow-[0_0_5px_rgba(75,83,32,0.8)]"></div>
                                      <p className="text-sm font-medium text-gray-300 leading-snug">{obj.description || 'Unknown Directive'}</p>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>

                          {q.wikiLink && (
                            <div className="mt-5 pt-4 border-t border-tactical-border/30 flex justify-end">
                              <a 
                                href={q.wikiLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] font-black tracking-widest uppercase text-tactical-orange/80 hover:text-tactical-orange flex items-center gap-1.5 transition-colors bg-tactical-bg border border-tactical-border hover:border-tactical-orange/50 px-3 py-1.5 rounded"
                              >
                                 <ExternalLink className="w-3.5 h-3.5" /> {t.quests.wiki}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => isCompleted ? removeCompletedQuest(q.id) : addCompletedQuest(q.id)}
                        className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-black tracking-widest uppercase transition-all xl:self-start w-full xl:w-auto
                          ${isCompleted 
                             ? 'bg-transparent text-tactical-gray border-2 border-tactical-border hover:text-white hover:border-tactical-gray hover:bg-tactical-panel' 
                             : 'bg-gradient-to-r from-tactical-olive to-[#5B6330] text-white hover:brightness-110 shadow-[0_0_20px_rgba(75,83,32,0.4)] hover:shadow-[0_0_25px_rgba(75,83,32,0.6)] border border-tactical-olive/50'}`}
                      >
                        {isCompleted ? t.quests.reactivate : <><Check className="w-5 h-5" /> {t.quests.markSecure}</>}
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestManager;
