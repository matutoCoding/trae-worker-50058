import { TideData, TideCalendarDay } from '@/types';

// 今日潮汐数据（模拟数据）
export const todayTideData: TideData[] = [
  {
    id: '1',
    beachId: 'beach1',
    beachName: '青岛栈桥海滩',
    date: '2026-06-16',
    records: [
      { time: '05:32', height: 4.2, type: 'high' },
      { time: '11:45', height: 0.8, type: 'low' },
      { time: '17:58', height: 4.5, type: 'high' },
      { time: '23:59', height: 1.2, type: 'low' }
    ]
  },
  {
    id: '2',
    beachId: 'beach2',
    beachName: '烟台金沙滩',
    date: '2026-06-16',
    records: [
      { time: '06:15', height: 3.8, type: 'high' },
      { time: '12:30', height: 0.6, type: 'low' },
      { time: '18:42', height: 4.1, type: 'high' }
    ]
  },
  {
    id: '3',
    beachId: 'beach3',
    beachName: '威海国际海水浴场',
    date: '2026-06-16',
    records: [
      { time: '05:50', height: 4.0, type: 'high' },
      { time: '12:08', height: 0.7, type: 'low' },
      { time: '18:25', height: 4.3, type: 'high' },
      { time: '23:45', height: 1.0, type: 'low' }
    ]
  }
];

// 潮汐日历（未来15天）
export const tideCalendar: TideCalendarDay[] = Array.from({ length: 15 }, (_, i) => {
  const date = new Date('2026-06-16');
  date.setDate(date.getDate() + i);
  const dateStr = date.toISOString().split('T')[0];
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  const moonPhases = ['新月', '峨眉月', '上弦月', '盈凸月', '满月', '亏凸月', '下弦月', '残月'];
  const isBestDay = [1, 2, 3, 8, 9, 10, 14, 15].includes(i + 1);

  return {
    date: dateStr,
    weekday,
    highTide1: `${String(4 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    highTide2: `${String(16 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    lowTide1: `${String(10 + Math.floor(Math.random() * 3)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    lowTide2: `${String(22 + Math.floor(Math.random() * 2)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    moonPhase: moonPhases[Math.floor(Math.random() * moonPhases.length)],
    isBestDay
  };
});

// 获取当前赶海窗口（基于低潮时间计算）
export function getCatchWindow(tideData: TideData) {
  const lowTides = tideData.records.filter(r => r.type === 'low');
  if (lowTides.length === 0) return null;

  const nextLow = lowTides[0];
  const [h, m] = nextLow.time.split(':').map(Number);
  const lowTimeMinutes = h * 60 + m;
  const windowStartMinutes = lowTimeMinutes - 120;
  const windowEndMinutes = lowTimeMinutes + 90;

  const formatTime = (minutes: number) => {
    const h2 = Math.floor(minutes / 60) % 24;
    const m2 = minutes % 60;
    return `${String(h2).padStart(2, '0')}:${String(m2).padStart(2, '0')}`;
  };

  return {
    lowTideTime: nextLow.time,
    lowTideHeight: nextLow.height,
    windowStart: formatTime(windowStartMinutes),
    windowEnd: formatTime(windowEndMinutes),
    duration: (windowEndMinutes - windowStartMinutes) / 60
  };
}

// 计算涨潮撤离倒计时
export function getEvacuationCountdown(tideData: TideData) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const risingTide = tideData.records.find(r => {
    const [h, m] = r.time.split(':').map(Number);
    const tideMinutes = h * 60 + m;
    return r.type === 'high' && tideMinutes > currentMinutes;
  });

  if (!risingTide) return null;

  const [rh, rm] = risingTide.time.split(':').map(Number);
  const risingMinutes = rh * 60 + rm;
  const diffMinutes = risingMinutes - currentMinutes - 60;

  if (diffMinutes <= 0) return { hours: 0, minutes: 0, urgent: true };

  return {
    hours: Math.floor(diffMinutes / 60),
    minutes: diffMinutes % 60,
    urgent: diffMinutes < 60
  };
}
