import { TideData, TideCalendarDay, TideRecord } from '@/types';
import { beaches } from './beach';
import dayjs from 'dayjs';

// 为指定海滩生成潮汐数据（模拟）
function generateTideForBeach(beachId: string, dateStr: string): TideData | null {
  const beach = beaches.find(b => b.id === beachId);
  if (!beach) return null;

  // beach4 和 beach5 暂时没有潮汐数据
  if (beachId === 'beach4' || beachId === 'beach5') {
    return null;
  }

  // 根据海滩ID生成不同的潮汐偏移
  const offsetMap: Record<string, number> = {
    beach1: 0,
    beach2: 45,
    beach3: -20
  };
  const offset = offsetMap[beachId] || 0;

  // 基础潮汐时间（模拟一天两高两低）
  const baseRecords = [
    { time: '05:30', height: 4.2, type: 'high' as const },
    { time: '11:45', height: 0.8, type: 'low' as const },
    { time: '17:55', height: 4.5, type: 'high' as const },
    { time: '23:59', height: 1.2, type: 'low' as const }
  ];

  const records = baseRecords.map(r => {
    const [h, m] = r.time.split(':').map(Number);
    let totalMinutes = h * 60 + m + offset;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return {
      time: `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`,
      height: +(r.height + (Math.random() - 0.5) * 0.3).toFixed(1),
      type: r.type
    } as TideRecord;
  });

  // 按时间排序
  records.sort((a, b) => {
    const [ah, am] = a.time.split(':').map(Number);
    const [bh, bm] = b.time.split(':').map(Number);
    return (ah * 60 + am) - (bh * 60 + bm);
  });

  return {
    id: `tide_${beachId}_${dateStr}`,
    beachId,
    beachName: beach.name,
    date: dateStr,
    records
  };
}

// 获取今日日期字符串
export function getTodayStr(): string {
  return dayjs().format('YYYY-MM-DD');
}

// 获取指定海滩今日潮汐数据
export function getTideByBeach(beachId: string): TideData | null {
  const today = getTodayStr();
  return generateTideForBeach(beachId, today);
}

// 获取所有海滩的潮汐数据
export function getAllTides(): TideData[] {
  const today = getTodayStr();
  return beaches
    .map(b => generateTideForBeach(b.id, today))
    .filter((t): t is TideData => t !== null);
}

// 今日潮汐数据（兼容旧接口，默认返回第一个海滩）
export const todayTideData: TideData[] = getAllTides();

// 潮汐日历（未来15天）
export const tideCalendar: TideCalendarDay[] = Array.from({ length: 15 }, (_, i) => {
  const date = dayjs().add(i, 'day');
  const dateStr = date.format('YYYY-MM-DD');
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.day()];
  const moonPhases = ['新月', '峨眉月', '上弦月', '盈凸月', '满月', '亏凸月', '下弦月', '残月'];
  const isBestDay = [1, 2, 3, 8, 9, 10, 14, 15].includes(i + 1);

  // 每天的潮汐时间略有偏移
  const offset = i * 50; // 每天推迟约50分钟（实际潮汐周期约12小时25分）
  const formatTime = (baseHour: number) => {
    let total = baseHour * 60 + offset;
    total = total % (24 * 60);
    const h = Math.floor(total / 60);
    const m = Math.floor(total % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return {
    date: dateStr,
    weekday,
    highTide1: formatTime(5.5),
    highTide2: formatTime(18),
    lowTide1: formatTime(11.75),
    lowTide2: formatTime(24),
    moonPhase: moonPhases[i % moonPhases.length],
    isBestDay
  };
});

// 获取当前赶海窗口（基于低潮时间计算）
export function getCatchWindow(tideData: TideData) {
  if (!tideData || !tideData.records || tideData.records.length === 0) {
    return null;
  }

  const now = dayjs();
  const currentMinutes = now.hour() * 60 + now.minute();

  // 找到所有低潮
  const lowTides = tideData.records.filter(r => r.type === 'low');
  if (lowTides.length === 0) return null;

  // 找到下一个（或当前正在进行的）低潮
  let targetLow: TideRecord | null = null;
  for (const low of lowTides) {
    const [h, m] = low.time.split(':').map(Number);
    const lowMinutes = h * 60 + m;
    // 低潮前2小时到后1.5小时都算赶海窗口
    const windowStart = lowMinutes - 120;
    const windowEnd = lowMinutes + 90;

    // 如果当前时间在窗口内，或者窗口还没开始
    if (currentMinutes < windowEnd) {
      targetLow = low;
      break;
    }
  }

  // 如果今天的都过了，返回null
  if (!targetLow) {
    return null;
  }

  const [lh, lm] = targetLow.time.split(':').map(Number);
  const lowMinutes = lh * 60 + lm;
  const windowStartMinutes = lowMinutes - 120;
  const windowEndMinutes = lowMinutes + 90;

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // 计算进度
  const totalWindow = windowEndMinutes - windowStartMinutes;
  const elapsed = Math.max(0, currentMinutes - windowStartMinutes);
  const progress = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100));

  // 判断是否在窗口内
  const isInWindow = currentMinutes >= windowStartMinutes && currentMinutes <= windowEndMinutes;

  // 距离开始/结束还有多久
  const minutesToStart = Math.max(0, windowStartMinutes - currentMinutes);
  const minutesToEnd = Math.max(0, windowEndMinutes - currentMinutes);

  return {
    lowTideTime: targetLow.time,
    lowTideHeight: targetLow.height,
    windowStart: formatTime(windowStartMinutes),
    windowEnd: formatTime(windowEndMinutes),
    duration: totalWindow / 60,
    progress,
    isInWindow,
    minutesToStart,
    minutesToEnd,
    status: isInWindow ? 'active' : (minutesToStart > 0 ? 'upcoming' : 'ended')
  };
}

// 计算涨潮撤离倒计时（基于下次高潮时间 - 安全时间）
export function getEvacuationCountdown(tideData: TideData) {
  if (!tideData || !tideData.records || tideData.records.length === 0) {
    return null;
  }

  const now = dayjs();
  const currentMinutes = now.hour() * 60 + now.minute();

  // 找到下一个高潮
  const highTides = tideData.records
    .filter(r => r.type === 'high')
    .map(r => {
      const [h, m] = r.time.split(':').map(Number);
      return { ...r, minutes: h * 60 + m };
    })
    .sort((a, b) => a.minutes - b.minutes);

  if (highTides.length === 0) return null;

  // 安全撤离时间 = 高潮时间 - 60分钟（建议涨潮前1小时开始撤离）
  const SAFETY_BUFFER_MINUTES = 60;

  let nextHigh = null;
  for (const high of highTides) {
    const evacuateTime = high.minutes - SAFETY_BUFFER_MINUTES;
    if (evacuateTime > currentMinutes) {
      nextHigh = { ...high, evacuateTime };
      break;
    }
  }

  // 如果今天的高潮都过了
  if (!nextHigh) {
    return {
      hours: 0,
      minutes: 0,
      totalMinutes: 0,
      urgent: false,
      status: 'ended',
      nextHighTide: null,
      message: '今日涨潮已结束'
    };
  }

  const diffMinutes = nextHigh.evacuateTime - currentMinutes;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  // 判断紧急程度
  let urgency = 'safe';
  if (diffMinutes <= 30) urgency = 'critical';
  else if (diffMinutes <= 60) urgency = 'warning';
  else if (diffMinutes <= 120) urgency = 'notice';

  return {
    hours,
    minutes,
    totalMinutes: diffMinutes,
    urgent: diffMinutes < 60,
    urgency,
    status: 'countdown',
    nextHighTide: {
      time: nextHigh.time,
      height: nextHigh.height
    },
    safetyBuffer: SAFETY_BUFFER_MINUTES,
    message: diffMinutes <= 0
      ? '已到撤离时间！请立即撤离！'
      : `建议在 ${formatTime(nextHigh.evacuateTime)} 前开始撤离`
  };
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 获取当前潮汐状态（涨潮/退潮/高潮/低潮）
export function getCurrentTideStatus(tideData: TideData) {
  if (!tideData || !tideData.records || tideData.records.length === 0) {
    return null;
  }

  const now = dayjs();
  const currentMinutes = now.hour() * 60 + now.minute();

  const allRecords = [...tideData.records].sort((a, b) => {
    const [ah, am] = a.time.split(':').map(Number);
    const [bh, bm] = b.time.split(':').map(Number);
    return (ah * 60 + am) - (bh * 60 + bm);
  });

  // 找到当前时间前后的两个潮汐点
  let prev: TideRecord | null = null;
  let next: TideRecord | null = null;

  for (let i = 0; i < allRecords.length; i++) {
    const [h, m] = allRecords[i].time.split(':').map(Number);
    const recMinutes = h * 60 + m;
    if (recMinutes <= currentMinutes) {
      prev = allRecords[i];
    } else {
      next = allRecords[i];
      break;
    }
  }

  if (!prev && next) {
    // 还没到第一个
    prev = allRecords[allRecords.length - 1];
  }
  if (!next && prev) {
    // 过了最后一个
    next = allRecords[0];
  }

  if (!prev || !next) return null;

  const isRising = prev.type === 'low' && next.type === 'high';
  const isFalling = prev.type === 'high' && next.type === 'low';

  // 计算进度
  const [ph, pm] = prev.time.split(':').map(Number);
  const [nh, nm] = next.time.split(':').map(Number);
  let prevMin = ph * 60 + pm;
  let nextMin = nh * 60 + nm;
  if (nextMin < prevMin) nextMin += 24 * 60;
  let curMin = currentMinutes;
  if (curMin < prevMin) curMin += 24 * 60;

  const total = nextMin - prevMin;
  const elapsed = curMin - prevMin;
  const progress = (elapsed / total) * 100;

  return {
    status: isRising ? 'rising' : (isFalling ? 'falling' : 'unknown'),
    statusText: isRising ? '涨潮中' : '退潮中',
    prevTide: prev,
    nextTide: next,
    progress,
    currentHeight: +(prev.height + (next.height - prev.height) * (elapsed / total)).toFixed(2)
  };
}
