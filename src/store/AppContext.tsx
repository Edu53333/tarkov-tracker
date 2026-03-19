import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TarkovData } from '../hooks/useTarkovData';

interface AppState {
  completedQuests: string[];
  hideoutLevels: Record<string, number>;
  playerLevel: number;
  language: 'en' | 'es';
}

interface AppContextType {
  state: AppState;
  addCompletedQuest: (questId: string) => void;
  removeCompletedQuest: (questId: string) => void;
  setHideoutLevel: (moduleId: string, level: number) => void;
  setPlayerLevel: (level: number) => void;
  setLanguage: (lang: 'en' | 'es') => void;
  apiData: TarkovData | null;
  setApiData: (data: TarkovData) => void;
}

const defaultState: AppState = {
  completedQuests: [],
  hideoutLevels: {},
  playerLevel: 1,
  language: 'en'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorage<AppState>('tarkovTrackerState_v5', defaultState);
  const [apiData, setApiData] = useState<TarkovData | null>(null);

  const addCompletedQuest = (questId: string) => {
    setState(prev => ({ ...prev, completedQuests: [...new Set([...prev.completedQuests, questId])] }));
  };

  const removeCompletedQuest = (questId: string) => {
    setState(prev => ({ ...prev, completedQuests: prev.completedQuests.filter(id => id !== questId) }));
  };

  const setHideoutLevel = (moduleId: string, level: number) => {
    setState(prev => ({
      ...prev,
      hideoutLevels: { ...prev.hideoutLevels, [moduleId]: level }
    }));
  };

  const setPlayerLevel = (level: number) => {
    setState(prev => ({ ...prev, playerLevel: level }));
  };

  const setLanguage = (lang: 'en' | 'es') => {
    setState(prev => ({ ...prev, language: lang }));
  };

  return (
    <AppContext.Provider value={{
      state,
      addCompletedQuest,
      removeCompletedQuest,
      setHideoutLevel,
      setPlayerLevel,
      setLanguage,
      apiData,
      setApiData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
