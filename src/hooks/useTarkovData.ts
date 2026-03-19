import { useState, useEffect } from 'react';

export interface TarkovItem {
  id: string;
  name: string;
  iconLink: string;
}

export interface TaskObjective {
  description?: string;
  item?: TarkovItem;
  count?: number;
  foundInRaid?: boolean;
}

export interface TaskStatusRequirement {
  task: {
    id: string;
  };
  status: string[];
}

export interface TarkovTask {
  id: string;
  name: string;
  minPlayerLevel?: number;
  taskImageLink?: string;
  wikiLink?: string;
  kappaRequired?: boolean;
  taskRequirements: TaskStatusRequirement[];
  map?: {
    name: string;
  };
  trader: { 
    name: string;
    imageLink?: string;
  };
  objectives: TaskObjective[];
}

export interface HideoutRequirement {
  item: TarkovItem;
  count: number;
  foundInRaid?: boolean;
}

export interface HideoutLevel {
  level: number;
  itemRequirements: HideoutRequirement[];
}

export interface HideoutStation {
  id: string;
  name: string;
  imageLink?: string;
  levels: HideoutLevel[];
}

export interface TarkovData {
  tasks: TarkovTask[];
  hideoutStations: HideoutStation[];
}

const CACHE_BASE_KEY = 'tarkov_api_cache_v10';
const CACHE_TIME_BASE_KEY = 'tarkov_api_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const QUERY = `
query GetTarkovData($lang: LanguageCode) {
  tasks(lang: $lang) {
    id
    name
    minPlayerLevel
    taskImageLink
    wikiLink
    kappaRequired
    map {
      name
    }
    trader {
      name
      imageLink
    }
    taskRequirements {
      task {
        id
      }
      status
    }
    objectives {
      description
      ... on TaskObjectiveItem {
        item {
          id
          name
          iconLink
        }
        count
        foundInRaid
      }
    }
  }
  items(lang: $lang) {
    id
    name
    iconLink
  }
  hideoutStations(lang: $lang) {
    id
    name
    imageLink
    levels {
      level
      itemRequirements {
        item {
          id
          name
          iconLink
        }
        count
        attributes {
          name
          value
        }
      }
    }
  }
}
`;

export function useTarkovData(lang: 'en' | 'es' = 'en') {
  const [data, setData] = useState<TarkovData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cacheKey = `${CACHE_BASE_KEY}_${lang}`;
        const cacheTimeKey = `${CACHE_TIME_BASE_KEY}_${lang}`;
        
        const cachedTime = localStorage.getItem(cacheTimeKey);
        if (cachedTime && Date.now() - parseInt(cachedTime) < CACHE_DURATION) {
          const cachedData = localStorage.getItem(cacheKey);
          if (cachedData) {
            setData(JSON.parse(cachedData));
            setLoading(false);
            return;
          }
        }

        const response = await fetch('https://api.tarkov.dev/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            query: QUERY,
            variables: { lang: lang }
          })
        });

        if (!response.ok) throw new Error('Network call to Tarkov.dev failed');
        const json = await response.json();
        
        const cleanedData: TarkovData = {
          tasks: json.data.tasks.filter((t: any) => t.trader && t.trader.name).map((t: any) => {
            const mergedObjectives: any[] = [];
            const itemMap = new Map<string, any>();
            
            if (t.objectives) {
              for (const obj of t.objectives) {
                if (obj.item && obj.item.id) {
                  const existing = itemMap.get(obj.item.id);
                  if (existing) {
                    existing.count = Math.max(existing.count || 0, obj.count || 0);
                    existing.foundInRaid = existing.foundInRaid || obj.foundInRaid;
                    if (obj.description && existing.description && !existing.description.includes(obj.description)) {
                      existing.description += ` / ${obj.description}`;
                    } else if (obj.description && !existing.description) {
                      existing.description = obj.description;
                    }
                  } else {
                    const newObj = { ...obj };
                    itemMap.set(obj.item.id, newObj);
                    mergedObjectives.push(newObj);
                  }
                } else {
                  mergedObjectives.push(obj);
                }
              }
            }

            return {
              ...t,
              objectives: mergedObjectives
            };
          }),
          hideoutStations: json.data.hideoutStations.map((station: any) => ({
            ...station,
            levels: station.levels.map((level: any) => ({
              ...level,
              itemRequirements: level.itemRequirements?.map((req: any) => ({
                ...req,
                foundInRaid: req.attributes?.find((a: any) => a.name === 'foundInRaid')?.value === 'true'
              })) || []
            }))
          }))
        };

        localStorage.setItem(cacheKey, JSON.stringify(cleanedData));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        setData(cleanedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lang]);

  return { data, loading, error };
}
