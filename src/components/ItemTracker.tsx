import React, { useState, useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { AlertCircle, Package, Search, Layers, CheckSquare, Wrench } from 'lucide-react';
import { translations } from '../i18n/translations';

const ItemTracker: React.FC = () => {
  const { state, apiData } = useAppContext();
  const t = translations[state.language || 'en'];
  const [filterMode, setFilterMode] = useState<'all' | 'quests' | 'hideout'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { questItems, hideoutItems, unifiedItems } = useMemo(() => {
    if (!apiData) return { questItems: [], hideoutItems: [], unifiedItems: [] };
    
    const questMap: Record<string, { total: number, fir: number, sources: string[], itemDetails: any }> = {};
    const hideoutMap: Record<string, { total: number, fir: number, sources: string[], itemDetails: any }> = {};
    const unifiedMap: Record<string, { total: number, fir: number, sources: string[], itemDetails: any }> = {};

    const addTarget = (map: Record<string, any>, itemId: string, item: any, count: number, isFir: boolean, source: string) => {
      if (!map[itemId]) map[itemId] = { total: 0, fir: 0, sources: [], itemDetails: item };
      map[itemId].total += count;
      if (isFir) map[itemId].fir += count;
      if (!map[itemId].sources.includes(source)) map[itemId].sources.push(source);
    };

    // 1. Quests (IGNORE PLAYER LEVEL constraint as requested by user)
    apiData.tasks.forEach(q => {
      if (!state.completedQuests.includes(q.id) && q.objectives) {
        q.objectives.forEach(obj => {
          if (!obj.item) return;
          const itemId = obj.item.id;
          const source = `${state.language === 'es' ? 'Misión' : 'Quest'}: ${q.name} (${q.trader.name})`;
          
          addTarget(questMap, itemId, obj.item, obj.count || 1, obj.foundInRaid || false, source);
          addTarget(unifiedMap, itemId, obj.item, obj.count || 1, obj.foundInRaid || false, source);
        });
      }
    });

    // 2. Hideout
    apiData.hideoutStations.forEach(h => {
      if (!h.levels) return;
      const currentLvl = state.hideoutLevels[h.id] || 0;
      const nextLvl = h.levels.find(l => l.level === currentLvl + 1);
      
      if (nextLvl && nextLvl.itemRequirements) {
        nextLvl.itemRequirements.forEach(req => {
          if (!req.item) return;
          const itemId = req.item.id;
          const source = `${state.language === 'es' ? 'Escondite' : 'Hideout'}: ${h.name} Lvl ${nextLvl.level}`;
          
          addTarget(hideoutMap, itemId, req.item, req.count || 1, req.foundInRaid || false, source);
          addTarget(unifiedMap, itemId, req.item, req.count || 1, req.foundInRaid || false, source);
        });
      }
    });

    const toArray = (map: Record<string, any>) => Object.entries(map).map(([id, data]) => ({ id, ...data })).sort((a,b) => b.total - a.total);

    return {
      questItems: toArray(questMap),
      hideoutItems: toArray(hideoutMap),
      unifiedItems: toArray(unifiedMap)
    };
    
  }, [state.completedQuests, state.hideoutLevels, apiData]);

  const itemsToDisplay = useMemo(() => {
    let base = unifiedItems;
    if (filterMode === 'quests') base = questItems;
    if (filterMode === 'hideout') base = hideoutItems;

    if (!searchQuery) return base;
    const lowerQ = searchQuery.toLowerCase();
    return base.filter(i => i.itemDetails.name.toLowerCase().includes(lowerQ));
  }, [filterMode, searchQuery, questItems, hideoutItems, unifiedItems]);

  if (!apiData) return null;

  return (
    <div className="pb-10 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.items.title}</h2>
          <span className="bg-tactical-orange/10 text-tactical-orange border border-tactical-orange/30 px-3 py-1 text-sm font-bold rounded-full shadow-[0_0_10px_rgba(211,84,0,0.2)] whitespace-nowrap">
            {itemsToDisplay.length} {t.items.totalItems}
          </span>
        </div>

        {/* Tactical Search Box */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-tactical-gray group-focus-within:text-tactical-orange transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-black/40 border border-tactical-border/60 text-white rounded-lg pl-10 pr-4 py-3 placeholder-tactical-gray/60 focus:outline-none focus:border-tactical-orange/50 focus:ring-1 focus:ring-tactical-orange/50 transition-all font-bold tracking-wide shadow-inner"
            placeholder={t.quests.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-black/30 p-1.5 rounded-lg border border-tactical-border/40 shrink-0 w-full md:w-max">
        <button
          onClick={() => setFilterMode('all')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all
            ${filterMode === 'all' 
              ? 'bg-tactical-panel/90 text-white shadow-md border-t border-tactical-gray/30' 
              : 'text-tactical-gray hover:text-white hover:bg-tactical-panel/40'}`}
        >
          <Layers className="w-4 h-4" /> {t.items.globalStash}
        </button>
        <button
          onClick={() => setFilterMode('quests')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all
            ${filterMode === 'quests' 
              ? 'bg-tactical-panel/90 text-white shadow-md border-t border-tactical-gray/30' 
              : 'text-tactical-gray hover:text-white hover:bg-tactical-panel/40'}`}
        >
          <CheckSquare className="w-4 h-4" /> {t.items.questRequisites}
        </button>
        <button
          onClick={() => setFilterMode('hideout')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all
            ${filterMode === 'hideout' 
              ? 'bg-tactical-panel/90 text-white shadow-md border-t border-tactical-gray/30' 
              : 'text-tactical-gray hover:text-white hover:bg-tactical-panel/40'}`}
        >
          <Wrench className="w-4 h-4" /> {t.items.hideoutBlueprints}
        </button>
      </div>
      
      {itemsToDisplay.length === 0 ? (
        <div className="bg-tactical-panel/80 backdrop-blur-md p-12 rounded-xl text-center border border-tactical-border/60 shadow-2xl flex-1 flex flex-col justify-center min-h-[400px]">
          {searchQuery ? (
            <Search className="w-16 h-16 mx-auto mb-6 text-tactical-gray/30" />
          ) : (
             <Package className="w-16 h-16 mx-auto mb-6 text-tactical-olive drop-shadow-[0_0_15px_rgba(75,83,32,0.4)] opacity-80" />
          )}
          <p className="text-tactical-olive font-black text-2xl tracking-widest uppercase mb-3 text-transparent bg-clip-text bg-gradient-to-br from-tactical-olive to-gray-500">
            {searchQuery ? t.items.noMatches : t.items.inventoryOptimized}
          </p>
          <p className="text-tactical-gray text-lg">
            {searchQuery ? `${state.language === 'es' ? 'Ningún componente coincide con la consulta' : 'No components match the query'} "${searchQuery}".` : t.items.noPending}
          </p>
        </div>
      ) : (
        <div className="bg-tactical-panel/70 backdrop-blur-md rounded-xl border border-tactical-border/60 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex-1 flex flex-col min-h-0">
          <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 z-20">
                <tr className="bg-[#0f120f]/95 backdrop-blur-xl border-b border-tactical-border shadow-md">
                  <th className="p-5 text-xs font-black text-tactical-gray uppercase tracking-widest w-16 text-center border-r border-tactical-border/30">Vis</th>
                  <th className="p-5 text-xs font-black text-tactical-gray uppercase tracking-widest w-1/3 border-r border-tactical-border/30">{t.items.componentIdentity}</th>
                  <th className="p-5 text-xs font-black text-tactical-gray uppercase tracking-widest text-center w-36 border-r border-tactical-border/30">{t.items.totalQuota}</th>
                  <th className="p-5 text-xs font-black text-tactical-gray uppercase tracking-widest text-center w-40 border-r border-tactical-border/30">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span>{t.items.inRaidReq}</span>
                    </div>
                  </th>
                  <th className="p-5 text-xs font-black text-tactical-gray uppercase tracking-widest">{t.items.demandingProtocols}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tactical-border/40">
                {itemsToDisplay.map((row) => {
                  return (
                    <tr key={row.id} className="transition-all duration-300 hover:bg-black/60 group bg-transparent">
                      <td className="p-4 border-r border-tactical-border/10 text-center align-middle">
                         <div className="w-14 h-14 inline-flex items-center justify-center p-1.5 bg-gradient-to-br from-tactical-bg to-black border border-tactical-border/80 shadow-inner rounded-lg group-hover:border-tactical-gray/50 transition-colors">
                           {row.itemDetails.iconLink ? (
                             <img src={row.itemDetails.iconLink} alt="Icon" className="max-w-full max-h-full object-contain group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300" loading="lazy" />
                           ) : <Package className="w-6 h-6 text-tactical-gray" />}
                         </div>
                      </td>
                      <td className="p-5 border-r border-tactical-border/10">
                        <div className="font-black text-gray-100 tracking-wide text-lg mb-1 group-hover:text-white transition-colors">{row.itemDetails.name}</div>
                      </td>
                      <td className="p-5 text-center border-r border-tactical-border/10">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-tactical-orange to-yellow-600 drop-shadow-[0_0_8px_rgba(211,84,0,0.5)]">{row.total}</span>
                      </td>
                      <td className="p-5 text-center border-r border-tactical-border/10">
                        {row.fir > 0 ? (
                          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-sm font-black shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                            <span>x{row.fir}</span>
                          </div>
                        ) : (
                          <span className="text-tactical-gray/30 font-black text-lg">-</span>
                        )}
                      </td>
                      <td className="p-5">
                        <ul className="text-xs font-bold text-tactical-gray space-y-2 list-none h-full flex flex-col justify-center">
                          {row.sources.map((s: string, i: number) => {
                            const isHideout = s.startsWith('Hideout');
                            return (
                              <li key={i} className="flex items-start gap-2.5">
                                <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 transition-colors ${isHideout ? 'bg-tactical-olive group-hover:bg-green-400' : 'bg-tactical-orange/70 group-hover:bg-tactical-orange'}`}></span>
                                <span className="tracking-widest uppercase leading-snug">{s}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default ItemTracker;
