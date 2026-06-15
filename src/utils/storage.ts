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
