// 潮汐数据类型
export interface TideData {
  id: string;
  beachId: string;
  beachName: string;
  date: string;
  records: TideRecord[];
}

export interface TideRecord {
  time: string;
  height: number;
  type: 'high' | 'low' | 'rising' | 'falling';
}

// 海滩类型
export interface Beach {
  id: string;
  name: string;
  location: string;
  description: string;
  lat: number;
  lng: number;
  difficulty: 'easy' | 'medium' | 'hard';
  safetyTips: string[];
  bestSeasons: string[];
  commonSpecies: string[];
  hasLifeguard: boolean;
  hasToilet: boolean;
  hasParking: boolean;
  imageId: number;
}

// 赶海点类型
export interface CatchSpot {
  id: string;
  beachId: string;
  name: string;
  type: 'rock' | 'sand' | 'reef';
  lat: number;
  lng: number;
  description: string;
  species: string[];
}

// 装备类型
export interface Equipment {
  id: string;
  name: string;
  category: 'clothing' | 'tool' | 'safety' | 'food';
  essential: boolean;
  description: string;
  checked?: boolean;
}

// 收获记录类型
export interface HarvestRecord {
  id: string;
  date: string;
  beachId: string;
  beachName: string;
  species: HarvestSpecies[];
  weather: string;
  duration: number;
  notes: string;
  imageIds: number[];
  createdAt: string;
}

export interface HarvestSpecies {
  name: string;
  count: number;
  weight: number;
}

// 安全路线类型
export interface SafetyRoute {
  id: string;
  beachId: string;
  name: string;
  waypoints: { lat: number; lng: number }[];
  estimatedTime: number;
  description: string;
}

// 紧急联系人类型
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

// 潮汐日历类型
export interface TideCalendarDay {
  date: string;
  weekday: string;
  highTide1: string;
  highTide2: string;
  lowTide1: string;
  lowTide2: string;
  moonPhase: string;
  isBestDay: boolean;
}
