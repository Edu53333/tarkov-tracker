import React from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowUpCircle, CheckCircle2 } from 'lucide-react';
import { translations } from '../i18n/translations';

const HideoutManager: React.FC = () => {
  const { state, setHideoutLevel, apiData } = useAppContext();
  const t = translations[state.language || 'en'];

  if (!apiData) return null;

  const modules = apiData.hideoutStations.filter(m => m.levels && m.levels.length > 0);

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.hideout.title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map(module => {
          const currentLevel = state.hideoutLevels[module.id] || 0;
          const maxLevel = Math.max(...module.levels.map(l => l.level));
          const nextLevelData = module.levels.find(l => l.level === currentLevel + 1);

          return (
            <div key={module.id} className="relative bg-tactical-panel/80 backdrop-blur-md border border-tactical-border/60 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-tactical-gray/60 hover:-translate-y-1 hover:shadow-2xl flex flex-col group">
              
              {/* Module Header with Background Image from API */}
              <div className="relative h-24 border-b border-tactical-border/50 flex justify-between items-end p-4 bg-black/60 shrink-0 overflow-hidden">
                {module.imageLink && (
                  <img src={module.imageLink} alt={module.name} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                )}
                {/* Gradient overlay to ensure text is readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <h3 className="font-black text-xl tracking-widest uppercase truncate relative z-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{module.name}</h3>
                <span className="text-xs font-black px-3 py-1 bg-tactical-olive/90 backdrop-blur-sm rounded text-white shadow-[0_0_10px_rgba(75,83,32,0.5)] shrink-0 relative z-10 border border-tactical-olive/40">{t.hideout.level.toUpperCase()} {currentLevel}</span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col relative z-20 bg-gradient-to-b from-transparent to-black/20">
                {nextLevelData ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-tactical-orange animate-pulse"></div>
                      <h4 className="text-xs font-bold text-tactical-gray uppercase tracking-widest text-tactical-orange/90">{t.hideout.requirements} ({t.hideout.level} {nextLevelData.level})</h4>
                    </div>
                    
                    {nextLevelData.itemRequirements && nextLevelData.itemRequirements.length > 0 ? (
                      <ul className="space-y-3 mb-6 flex-1 overflow-x-hidden">
                        {nextLevelData.itemRequirements.map((req, i) => (
                          <li key={i} className="flex items-center bg-black/40 p-2.5 rounded-lg border border-tactical-border/50 relative pr-14 hover:bg-tactical-bg transition-colors">
                             <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-tactical-panel to-black rounded flex items-center justify-center p-1.5 mr-3 border border-tactical-border shadow-inner">
                               {req.item?.iconLink ? (
                                 <img src={req.item.iconLink} alt={req.item.name} className="max-w-full max-h-full object-contain drop-shadow-sm" loading="lazy" />
                               ) : <div className="w-2 h-2 rounded-full bg-tactical-gray"></div>}
                             </div>
                             <div className="flex flex-col flex-1 mr-4 min-w-0">
                                <span className="truncate font-bold text-gray-200 text-sm">{req.item?.name || 'Unknown'}</span>
                                {req.foundInRaid ? (
                                  <span className="text-[10px] font-black text-[#b49e6d] uppercase tracking-tighter mt-1 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-[#b49e6d] animate-pulse"></span>
                                    {t.hideout.firRequired}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-[#868f97] uppercase tracking-tighter mt-1 opacity-60">
                                    {t.hideout.purchasable}
                                  </span>
                                )}
                             </div>
                             <span className="font-black text-[#b49e6d] absolute right-4 drop-shadow-[0_0_5px_rgba(180,158,109,0.5)] text-lg">x{req.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-tactical-gray/60 font-medium text-sm italic mb-6 bg-black/20 rounded-lg border border-tactical-border/30 border-dashed">No component requirements</div>
                    )}
                    
                      <button
                        onClick={() => setHideoutLevel(module.id, nextLevelData.level)}
                        className="w-full shrink-0 mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-tactical-olive to-[#5B6330] hover:brightness-110 text-white py-3 rounded-lg font-black tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(75,83,32,0.3)] active:scale-95 border border-tactical-olive/50"
                      >
                        <ArrowUpCircle className="w-5 h-5" />
                        {t.hideout.upgrade} {nextLevelData.level}
                      </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-tactical-olive h-full bg-black/10 rounded-lg border-2 border-tactical-olive/10 border-dashed">
                    <CheckCircle2 className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(75,83,32,0.6)] text-tactical-olive" />
                    <span className="font-black tracking-[0.2em] uppercase text-center text-tactical-olive/90">{maxLevel > 0 ? t.hideout.maxLevel : t.hideout.maxLevel}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HideoutManager;
