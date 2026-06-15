import Taro from '@tarojs/taro';
import { HarvestRecord } from '@/types';
import { harvestRecords as mockRecords } from '@/data/harvest';

const STORAGE_KEY = 'harvest_records';
const STORAGE_INIT_KEY = 'harvest_records_initialized';

export async function getHarvestRecords(): Promise<HarvestRecord[]> {
  try {
    const initialized = Taro.getStorageSync(STORAGE_INIT_KEY);
    if (!initialized) {
      Taro.setStorageSync(STORAGE_KEY, JSON.stringify(mockRecords));
      Taro.setStorageSync(STORAGE_INIT_KEY, 'true');
      return mockRecords;
    }
    const data = Taro.getStorageSync(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as HarvestRecord[];
    }
    return mockRecords;
  } catch (e) {
    console.error('[storage] getHarvestRecords error:', e);
    return mockRecords;
  }
}

export async function getHarvestRecordById(id: string): Promise<HarvestRecord | null> {
  try {
    const records = await getHarvestRecords();
    return records.find(r => r.id === id) || null;
  } catch (e) {
    console.error('[storage] getHarvestRecordById error:', e);
    return null;
  }
}

export async function saveHarvestRecord(record: HarvestRecord): Promise<void> {
  try {
    const records = await getHarvestRecords();
    const newRecords = [record, ...records];
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(newRecords));
  } catch (e) {
    console.error('[storage] saveHarvestRecord error:', e);
    throw e;
  }
}

export async function updateHarvestRecord(record: HarvestRecord): Promise<void> {
  try {
    const records = await getHarvestRecords();
    const newRecords = records.map(r => r.id === record.id ? record : r);
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(newRecords));
  } catch (e) {
    console.error('[storage] updateHarvestRecord error:', e);
    throw e;
  }
}

export async function deleteHarvestRecord(id: string): Promise<void> {
  try {
    const records = await getHarvestRecords();
    const newRecords = records.filter(r => r.id !== id);
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(newRecords));
  } catch (e) {
    console.error('[storage] deleteHarvestRecord error:', e);
    throw e;
  }
}

export function generateId(): string {
  return 'h' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateTime(date: Date): string {
  const d = formatDate(date);
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${d} ${h}:${mi}:${s}`;
}

// 安全提醒设置
export interface BeachReminderSetting {
  beachId: string;
  enabled30min: boolean;
  enabled60min: boolean;
}

const REMINDER_STORAGE_KEY = 'beach_reminder_settings';

export async function getReminderSettings(): Promise<BeachReminderSetting[]> {
  try {
    const data = Taro.getStorageSync(REMINDER_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as BeachReminderSetting[];
    }
    return [];
  } catch (e) {
    console.error('[storage] getReminderSettings error:', e);
    return [];
  }
}

export async function getReminderByBeach(beachId: string): Promise<BeachReminderSetting | null> {
  try {
    const settings = await getReminderSettings();
    return settings.find(s => s.beachId === beachId) || null;
  } catch (e) {
    console.error('[storage] getReminderByBeach error:', e);
    return null;
  }
}

export async function saveReminderSetting(setting: BeachReminderSetting): Promise<void> {
  try {
    const settings = await getReminderSettings();
    const index = settings.findIndex(s => s.beachId === setting.beachId);
    if (index >= 0) {
      settings[index] = setting;
    } else {
      settings.push(setting);
    }
    Taro.setStorageSync(REMINDER_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('[storage] saveReminderSetting error:', e);
    throw e;
  }
}

// 撤离计划设置
export interface EvacuationPlan {
  beachId: string;
  selectedRouteId: string;
  meetingPoint: string;
  peopleCount: number;
}

const EVAC_PLAN_STORAGE_KEY = 'evacuation_plans';

export async function getEvacuationPlans(): Promise<EvacuationPlan[]> {
  try {
    const data = Taro.getStorageSync(EVAC_PLAN_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as EvacuationPlan[];
    }
    return [];
  } catch (e) {
    console.error('[storage] getEvacuationPlans error:', e);
    return [];
  }
}

export async function getEvacuationPlanByBeach(beachId: string): Promise<EvacuationPlan | null> {
  try {
    const plans = await getEvacuationPlans();
    return plans.find(p => p.beachId === beachId) || null;
  } catch (e) {
    console.error('[storage] getEvacuationPlanByBeach error:', e);
    return null;
  }
}

export async function saveEvacuationPlan(plan: EvacuationPlan): Promise<void> {
  try {
    const plans = await getEvacuationPlans();
    const index = plans.findIndex(p => p.beachId === plan.beachId);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.push(plan);
    }
    Taro.setStorageSync(EVAC_PLAN_STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('[storage] saveEvacuationPlan error:', e);
    throw e;
  }
}
