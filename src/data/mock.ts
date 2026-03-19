export interface Item {
  id: string;
  name: string;
  icon: string; // Lucide icon name placeholder
}

export interface QuestRequirement {
  itemId: string;
  quantity: number;
  fir: boolean; // Found in Raid required
}

export interface Quest {
  id: string;
  title: string;
  trader: string;
  objectives: string[];
  requirements: QuestRequirement[];
}

export interface HideoutRequirement {
  itemId: string;
  quantity: number;
}

export interface HideoutModuleLevel {
  level: number;
  requirements: HideoutRequirement[];
}

export interface HideoutModule {
  id: string;
  name: string;
  levels: HideoutModuleLevel[];
}

export const MOCK_ITEMS: Record<string, Item> = {
  salewa: { id: 'salewa', name: 'Salewa FIRST AID KIT', icon: 'BriefcaseMedical' },
  mp133: { id: 'mp133', name: 'MP-133 12ga shotgun', icon: 'Crosshair' },
  nuts: { id: 'nuts', name: 'Nuts', icon: 'Settings' },
  bolts: { id: 'bolts', name: 'Bolts', icon: 'Settings' },
  meds: { id: 'meds', name: 'Pile of meds', icon: 'Pill' },
  gas_analyzer: { id: 'gas_analyzer', name: 'Gas analyzer', icon: 'Gauge' },
  flash_drive: { id: 'flash_drive', name: 'Secure Flash drive', icon: 'HardDrive' },
  morphine: { id: 'morphine', name: 'Morphine injector', icon: 'Syringe' },
  car_battery: { id: 'car_battery', name: 'Car battery', icon: 'Battery' },
  spark_plug: { id: 'spark_plug', name: 'Spark plug', icon: 'Zap' },
  iskra: { id: 'iskra', name: 'Iskra MRE', icon: 'Utensils' },
  emelya: { id: 'emelya', name: 'Emelya rye croutons', icon: 'Utensils' },
  tushonka: { id: 'tushonka', name: 'Can of delicious beef stew', icon: 'Utensils' },
  hose: { id: 'hose', name: 'Corrugated hose', icon: 'Droplet' },
  wire: { id: 'wire', name: 'Wire', icon: 'Cable' },
  light_bulb: { id: 'light_bulb', name: 'Light bulb', icon: 'Lightbulb' },
  module_3m: { id: 'module_3m', name: 'Module-3M body armor', icon: 'Shield' },
  toz: { id: 'toz', name: 'TOZ-106', icon: 'Crosshair' },
  wd40: { id: 'wd40', name: 'WD-40 (100ml)', icon: 'FlaskConical' },
  cpu: { id: 'cpu', name: 'CPU', icon: 'Cpu' },
  ledx: { id: 'ledx', name: 'LEDX Skin Transilluminator', icon: 'Stethoscope' },
};

export const MOCK_QUESTS: Quest[] = [
  {
    id: 'debut',
    title: 'Debut',
    trader: 'Prapor',
    objectives: [
      'Kill 5 Scavs all over the Customs territory',
      'Obtain 2 MP-133 12ga shotguns',
      'Hand over 2 MP-133 12ga shotguns'
    ],
    requirements: [
      { itemId: 'mp133', quantity: 2, fir: false }
    ]
  },
  {
    id: 'shortage',
    title: 'Shortage',
    trader: 'Therapist',
    objectives: [
      'Find 3 Salewa first aid kits in raid',
      'Hand over 3 Salewa first aid kits'
    ],
    requirements: [
      { itemId: 'salewa', quantity: 3, fir: true }
    ]
  },
  {
    id: 'sanitary_standards_1',
    title: 'Sanitary Standards - Part 1',
    trader: 'Therapist',
    objectives: [
      'Find 1 Gas analyzer in raid',
      'Hand over 1 Gas analyzer'
    ],
    requirements: [
      { itemId: 'gas_analyzer', quantity: 1, fir: true }
    ]
  },
  {
    id: 'sanitary_standards_2',
    title: 'Sanitary Standards - Part 2',
    trader: 'Therapist',
    objectives: [
      'Find 2 Gas analyzers in raid',
      'Hand over 2 Gas analyzers'
    ],
    requirements: [
      { itemId: 'gas_analyzer', quantity: 2, fir: true }
    ]
  },
  {
    id: 'painkiller',
    title: 'Painkiller',
    trader: 'Therapist',
    objectives: [
      'Find 4 Morphine injectors in raid',
      'Hand over 4 Morphine injectors'
    ],
    requirements: [
      { itemId: 'morphine', quantity: 4, fir: true }
    ]
  },
  {
    id: 'supplier',
    title: 'Supplier',
    trader: 'Skier',
    objectives: [
      'Hand over 1 Module-3M body armor (Found in raid)',
      'Hand over 1 TOZ-106 bolt-action shotgun (Found in raid)'
    ],
    requirements: [
      { itemId: 'module_3m', quantity: 1, fir: true },
      { itemId: 'toz', quantity: 1, fir: true }
    ]
  },
  {
    id: 'whats_on_the_flash_drive',
    title: 'What\'s on the flash drive?',
    trader: 'Skier',
    objectives: [
      'Find 2 secure flash drives in raid',
      'Hand over 2 secure flash drives'
    ],
    requirements: [
      { itemId: 'flash_drive', quantity: 2, fir: true }
    ]
  },
  {
    id: 'car_repair',
    title: 'Car Repair',
    trader: 'Therapist',
    objectives: [
      'Find 4 Car batteries in raid',
      'Hand over 4 Car batteries',
      'Find 8 Spark plugs in raid',
      'Hand over 8 Spark plugs'
    ],
    requirements: [
      { itemId: 'car_battery', quantity: 4, fir: true },
      { itemId: 'spark_plug', quantity: 8, fir: true }
    ]
  },
  {
    id: 'acquaintance',
    title: 'Acquaintance',
    trader: 'Jaeger',
    objectives: [
      'Find 3 Iskra MREs in raid',
      'Find 2 Emelya rye croutons in raid',
      'Find 2 cans of delicious beef stew in raid'
    ],
    requirements: [
      { itemId: 'iskra', quantity: 3, fir: true },
      { itemId: 'emelya', quantity: 2, fir: true },
      { itemId: 'tushonka', quantity: 2, fir: true }
    ]
  },
  {
    id: 'private_clinic',
    title: 'Private Clinic',
    trader: 'Therapist',
    objectives: [
      'Find 1 LEDX Skin Transilluminator in raid',
      'Hand over 1 LEDX Skin Transilluminator'
    ],
    requirements: [
      { itemId: 'ledx', quantity: 1, fir: true }
    ]
  }
];

export const MOCK_HIDEOUT: HideoutModule[] = [
  {
    id: 'generator',
    name: 'Generator',
    levels: [
      { level: 1, requirements: [{ itemId: 'spark_plug', quantity: 1 }]},
      { level: 2, requirements: [{ itemId: 'car_battery', quantity: 1 }, { itemId: 'wire', quantity: 2 }]}
    ]
  },
  {
    id: 'medstation',
    name: 'Medstation',
    levels: [
      { level: 1, requirements: [{ itemId: 'meds', quantity: 1 }]},
      { level: 2, requirements: [{ itemId: 'salewa', quantity: 1 }, { itemId: 'morphine', quantity: 1 }]},
      { level: 3, requirements: [{ itemId: 'ledx', quantity: 1 }]}
    ]
  },
  {
    id: 'workbench',
    name: 'Workbench',
    levels: [
      { level: 1, requirements: [{ itemId: 'nuts', quantity: 2 }, { itemId: 'bolts', quantity: 2 }]},
      { level: 2, requirements: [{ itemId: 'light_bulb', quantity: 2 }, { itemId: 'wire', quantity: 1 }]}
    ]
  },
  {
    id: 'lavatory',
    name: 'Lavatory',
    levels: [
      { level: 1, requirements: [{ itemId: 'hose', quantity: 1 }]},
      { level: 2, requirements: [{ itemId: 'hose', quantity: 2 }, { itemId: 'wd40', quantity: 1 }]}
    ]
  },
  {
    id: 'illumination',
    name: 'Illumination',
    levels: [
      { level: 1, requirements: [{ itemId: 'light_bulb', quantity: 2 }]},
      { level: 2, requirements: [{ itemId: 'light_bulb', quantity: 4 }, { itemId: 'wire', quantity: 2 }]}
    ]
  },
  {
    id: 'security',
    name: 'Security',
    levels: [
      { level: 1, requirements: []},
      { level: 2, requirements: [{ itemId: 'wire', quantity: 2 }]}
    ]
  }
];
