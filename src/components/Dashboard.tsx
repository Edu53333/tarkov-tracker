import React, { useMemo } from 'react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n/translations';
import { CheckCircle2, Target, Crosshair, HelpCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state, apiData } = useAppContext();
  const t = translations[state.language || 'en'];
  
  if (!apiData) return null;

  const totalQuests = apiData.tasks.length;
  const completedQuests = state.completedQuests.length;

  const { totalObjectives, completedObjectives, totalItemsNeeded, itemsAcquired } = useMemo(() => {
    let objTotal = 0;
    let objComp = 0;
    
    let itemsNeededCount = 0;
    // Faking a small percentage of acquired items for visual flavor like the screenshot
    let itemsAcquiredCount = 0; 

    apiData.tasks.forEach(q => {
      const isCompleted = state.completedQuests.includes(q.id);
      
      if (q.objectives) {
        objTotal += q.objectives.length;
        if (isCompleted) {
          objComp += q.objectives.length;
        }

        q.objectives.forEach(obj => {
          if (obj.item) {
             itemsNeededCount += (obj.count || 1);
             if (isCompleted) {
               itemsAcquiredCount += (obj.count || 1);
             }
          }
        });
      }
    });

    return { 
      totalObjectives: objTotal, 
      completedObjectives: objComp,
      totalItemsNeeded: itemsNeededCount,
      itemsAcquired: itemsAcquiredCount
    };
  }, [apiData, state.completedQuests]);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Alert Banners */}
      <div className="space-y-4 mb-8">
        <div className="bg-[#242e38] border-l-4 border-[#5b7a8a] flex p-5 rounded-sm shadow-lg gap-4">
           <div className="shrink-0 pt-0.5"><div className="w-10 h-10 bg-white rounded flex items-center justify-center shadow-lg"><HelpCircle className="w-6 h-6 text-[#242e38]" /></div></div>
           <div className="flex-1">
             <p className="text-[#d8e2ea] text-[15px] font-semibold tracking-wide leading-relaxed">
               {t.dashboard.welcome}
             </p>
             <button className="text-[#868f97] text-xs font-bold flex items-center gap-2 uppercase tracking-widest mt-4 hover:text-white transition-colors">
               {t.dashboard.hideTip}
             </button>
           </div>
        </div>

        <div className="bg-[#185545] text-white p-4 px-5 rounded-sm shadow-md">
           <h3 className="font-bold text-lg mb-1 tracking-wide">{t.dashboard.wipeTitle}</h3>
           <p className="text-[#a4c7af] font-medium text-[15px]">{t.dashboard.wipeText}</p>
        </div>
      </div>

      {/* Statistics Cards Array */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-[#181a1c]/80 backdrop-blur-sm border border-[#2a2d32]/50 p-5 pt-8 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
           <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#111315] rounded-full border-4 border-[#2b3036] flex items-center justify-center shadow-inner z-10">
              <CheckCircle2 className="w-10 h-10 text-[#868f97] translate-x-3 translate-y-3 opacity-60" />
           </div>
           
           <div className="relative z-20 text-right w-full flex-1 flex flex-col justify-center">
             <span className="text-[13px] font-bold tracking-widest uppercase text-[#868f97] block mb-1">{t.dashboard.completedQuests}</span>
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-[38px] leading-none font-bold text-[#e8e6e3]">{completedQuests}</span>
               <span className="text-[28px] leading-none font-bold text-[#868f97]">/{totalQuests}</span>
             </div>
           </div>

           <div className="relative z-20 mt-4 border-t border-[#2a2d32] pt-3 flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-[#3c362d] text-[#b49e6d] flex items-center justify-center font-bold text-[10px] shrink-0">?</div>
             <p className="text-[11px] font-bold text-[#868f97] uppercase tracking-wide">{t.dashboard.statsInfo.completed}</p>
           </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#181a1c]/80 backdrop-blur-sm border border-[#2a2d32]/50 p-5 pt-8 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
           <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#111315] rounded-full border-4 border-[#2b3036] flex items-center justify-center shadow-inner z-10">
              <Target className="w-10 h-10 text-[#868f97] translate-x-3 translate-y-3 opacity-60" />
           </div>
           
           <div className="relative z-20 text-right w-full flex-1 flex flex-col justify-center">
             <span className="text-[13px] font-bold tracking-widest uppercase text-[#868f97] block mb-1">{t.dashboard.questObjectives}</span>
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-[38px] leading-none font-bold text-[#e8e6e3]">{completedObjectives}</span>
               <span className="text-[28px] leading-none font-bold text-[#868f97]">/{totalObjectives}</span>
             </div>
           </div>

           <div className="relative z-20 mt-4 border-t border-[#2a2d32] pt-3 flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-[#3c362d] text-[#b49e6d] flex items-center justify-center font-bold text-[10px] shrink-0">?</div>
             <p className="text-[11px] font-bold text-[#868f97] uppercase tracking-wide">{t.dashboard.statsInfo.objectives}</p>
           </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#181a1c]/80 backdrop-blur-sm border border-[#2a2d32]/50 p-5 pt-8 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
           <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#111315] rounded-full border-4 border-[#2b3036] flex items-center justify-center shadow-inner z-10">
              <Crosshair className="w-10 h-10 text-[#868f97] translate-x-3 translate-y-3 opacity-60" />
           </div>
           
           <div className="relative z-20 text-right w-full flex-1 flex flex-col justify-center">
             <span className="text-[13px] font-bold tracking-widest uppercase text-[#868f97] block mb-1">{t.dashboard.questItems}</span>
             <div className="flex items-baseline justify-end gap-1">
               <span className="text-[38px] leading-none font-bold text-[#e8e6e3]">{itemsAcquired}</span>
               <span className="text-[28px] leading-none font-bold text-[#868f97]">/{totalItemsNeeded}</span>
             </div>
           </div>

           <div className="relative z-20 mt-4 border-t border-[#2a2d32] pt-3 flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-[#3c362d] text-[#b49e6d] flex items-center justify-center font-bold text-[10px] shrink-0">?</div>
             <p className="text-[11px] font-bold text-[#868f97] uppercase tracking-wide">{t.dashboard.statsInfo.items}</p>
           </div>
        </div>

      </div>

      <div className="mt-20 flex flex-col items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#868f97] opacity-60">
        <p>Tarkov Tracker 2024</p>
        <p>Game content and materials are trademarks of Battlestate Games.</p>
      </div>

    </div>
  );
};
export default Dashboard;
