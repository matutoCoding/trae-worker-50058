import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { getTideByBeach, tideCalendar, getCatchWindow, getCurrentTideStatus } from '@/data/tide';
import { beaches } from '@/data/beach';
import { TideData } from '@/types';

const TidePage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>('beach1');
  const [activeDateIndex, setActiveDateIndex] = useState<number>(0);
  const [currentTide, setCurrentTide] = useState<TideData | null>(null);
  const [nowTime, setNowTime] = useState(dayjs());

  // 定时刷新当前时间（每分钟）
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(dayjs());
    }, 60000); // 每分钟更新一次
    return () => clearInterval(timer);
  }, []);

  // 切换海滩时重新获取潮汐数据
  useEffect(() => {
    const tide = getTideByBeach(selectedBeachId);
    setCurrentTide(tide);
  }, [selectedBeachId]);

  // 页面显示时刷新
  useDidShow(() => {
    setNowTime(dayjs());
    const tide = getTideByBeach(selectedBeachId);
    setCurrentTide(tide);
  });

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId),
    [selectedBeachId]
  );

  const catchWindow = useMemo(() => {
    if (!currentTide) return null;
    return getCatchWindow(currentTide);
  }, [currentTide, nowTime]);

  const tideStatus = useMemo(() => {
    if (!currentTide) return null;
    return getCurrentTideStatus(currentTide);
  }, [currentTide, nowTime]);

  const getTideStatusText = (type: string) => {
    switch (type) {
      case 'high': return '高潮位';
      case 'low': return '低潮位';
      case 'rising': return '涨潮中';
      case 'falling': return '落潮中';
      default: return '';
    }
  };

  const handleBeachSelect = () => {
    Taro.showActionSheet({
      itemList: beaches.map((b) => b.name),
      success: (res) => {
        setSelectedBeachId(beaches[res.tapIndex].id);
      },
      fail: (err) => {
        console.error('[TidePage] 选择海滩失败:', err);
      }
    });
  };

  const navigateTo = (url: string) => {
    Taro.navigateTo({ url, fail: (err) => console.error('[TidePage] 跳转失败:', err) });
  };

  // 没有潮汐数据的情况
  if (!currentTide) {
    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.headerSection}>
          <View className={styles.beachSelector} onClick={handleBeachSelect}>
            <View className={styles.beachInfo}>
              <Text className={styles.beachName}>🌊 {currentBeach?.name}</Text>
              <Text className={styles.beachLocation}>📍 {currentBeach?.location}</Text>
            </View>
            <Text className={styles.selectorArrow}>›</Text>
          </View>
          <View className={styles.currentInfo}>
            <Text className={styles.currentDate}>
              {dayjs().format('YYYY年M月D日 dddd')}
            </Text>
          </View>
        </View>

        <View style={{
          marginTop: '40rpx',
          padding: '80rpx 40rpx',
          background: '#fff',
          borderRadius: '24rpx',
          boxShadow: '0 8rpx 32rpx rgba(0,0,0,0.06)',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '80rpx', display: 'block', marginBottom: '24rpx' }}>🌊</Text>
          <Text style={{ fontSize: '32rpx', fontWeight: 600, color: '#333', display: 'block', marginBottom: '16rpx' }}>
            暂无潮汐预报数据
          </Text>
          <Text style={{ fontSize: '26rpx', color: '#86909C', lineHeight: 1.7 }}>
            {currentBeach?.name} 暂时还没有潮汐预报数据。{'\n'}
            我们正在努力完善更多海滩的潮汐信息，敬请期待！{'\n\n'}
            您可以切换到其他海滩查看潮汐预报。
          </Text>
          <View
            style={{
              marginTop: '40rpx',
              padding: '20rpx 48rpx',
              display: 'inline-block',
              background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
              color: '#fff',
              borderRadius: '36rpx',
              fontSize: '28rpx',
              fontWeight: 600
            }}
            onClick={handleBeachSelect}
          >
            切换海滩
          </View>
        </View>
      </ScrollView>
    );
  }

  const nextHighTide = currentTide.records.find(r => {
    const [h, m] = r.time.split(':').map(Number);
    const recMin = h * 60 + m;
    const nowMin = nowTime.hour() * 60 + nowTime.minute();
    return r.type === 'high' && recMin > nowMin;
  });

  const nextLowTide = currentTide.records.find(r => {
    const [h, m] = r.time.split(':').map(Number);
    const recMin = h * 60 + m;
    const nowMin = nowTime.hour() * 60 + nowTime.minute();
    return r.type === 'low' && recMin > nowMin;
  });

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 顶部区域：海滩选择器 */}
      <View className={styles.headerSection}>
        <View className={styles.beachSelector} onClick={handleBeachSelect}>
          <View className={styles.beachInfo}>
            <Text className={styles.beachName}>🌊 {currentBeach?.name}</Text>
            <Text className={styles.beachLocation}>📍 {currentBeach?.location}</Text>
          </View>
          <Text className={styles.selectorArrow}>›</Text>
        </View>
        <View className={styles.currentInfo}>
          <Text className={styles.currentDate}>
            {nowTime.format('YYYY年M月D日 dddd')}
          </Text>
          <Text className={styles.moonPhase}>🌙 {tideCalendar[0]?.moonPhase || '满月'}</Text>
        </View>
      </View>

      {/* 潮汐总览卡片 */}
      <View className={styles.tideOverview}>
        <View className={styles.overviewHeader}>
          <Text className={styles.overviewTitle}>当前潮汐状态</Text>
          <Text className={styles.overviewTag}>实时更新</Text>
        </View>
        <View className={styles.overviewMain}>
          <View className={styles.tideStatus}>
            <Text className={styles.statusLabel}>
              {tideStatus ? tideStatus.statusText : getTideStatusText(currentTide.records[0]?.type)}
            </Text>
            <View>
              <Text className={styles.statusValue}>
                {tideStatus ? tideStatus.currentHeight.toFixed(1) : currentTide.records[0]?.height}
              </Text>
              <Text className={styles.statusUnit}> 米</Text>
            </View>
            <Text className={styles.statusTime}>
              {nowTime.format('HH:mm')} 更新
            </Text>
          </View>
          <Text className={styles.tideIcon}>
            {tideStatus?.status === 'rising' || currentTide.records[0]?.type === 'high' ? '🌊' : '🏖️'}
          </Text>
        </View>
        <View className={styles.overviewFooter}>
          <View className={styles.overviewItem}>
            <Text className={styles.itemLabel}>下次高潮</Text>
            <Text className={styles.itemValue}>
              {nextHighTide?.time || '明日'}
            </Text>
          </View>
          <View className={styles.overviewItem}>
            <Text className={styles.itemLabel}>下次低潮</Text>
            <Text className={styles.itemValue}>
              {nextLowTide?.time || '明日'}
            </Text>
          </View>
        </View>
      </View>

      {/* 赶海窗口卡片 */}
      <View className={styles.catchWindowCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardTitle}>🎣 今日赶海窗口</Text>
          <Text className={styles.cardBadge}>最佳时段</Text>
        </View>
        {catchWindow && catchWindow.status !== 'ended' ? (
          <>
            <View className={styles.windowTimes}>
              <View className={styles.timeBlock}>
                <Text className={styles.timeLabel}>窗口开始</Text>
                <Text className={styles.timeValue}>{catchWindow.windowStart}</Text>
              </View>
              <Text className={styles.timeArrow}>➡️</Text>
              <View className={styles.timeBlock}>
                <Text className={styles.timeLabel}>低潮时刻</Text>
                <Text className={styles.timeValue}>{catchWindow.lowTideTime}</Text>
              </View>
              <Text className={styles.timeArrow}>➡️</Text>
              <View className={styles.timeBlock}>
                <Text className={styles.timeLabel}>窗口结束</Text>
                <Text className={styles.timeValue}>{catchWindow.windowEnd}</Text>
              </View>
            </View>
            <View className={styles.windowDuration}>
              <Text>可赶海时长：</Text>
              <Text className={styles.durationHighlight}>约 {catchWindow.duration} 小时</Text>
              <Text>（低潮前2小时至低潮后1.5小时）</Text>
            </View>
            <View style={{
              marginTop: '24rpx',
              fontSize: '24rpx',
              color: '#0077B6',
              fontWeight: 500
            }}>
              {catchWindow.status === 'active'
                ? `🟢 赶海窗口进行中，还剩约 ${Math.floor(catchWindow.minutesToEnd / 60)}小时${catchWindow.minutesToEnd % 60}分钟`
                : `⏳ 距赶海窗口开始还有约 ${Math.floor(catchWindow.minutesToStart / 60)}小时${catchWindow.minutesToStart % 60}分钟`}
            </View>
          </>
        ) : (
          <View style={{ padding: '20rpx 0', textAlign: 'center', color: '#86909C', fontSize: '28rpx' }}>
            今日赶海窗口已结束，明天再来吧～
          </View>
        )}
      </View>

      {/* 潮汐表 */}
      <View className={styles.tideTable}>
        <Text className={styles.tableTitle}>📋 今日潮汐表</Text>
        <View className={styles.tableList}>
          {currentTide.records.map((record, index) => {
            const [h, m] = record.time.split(':').map(Number);
            const recMin = h * 60 + m;
            const nowMin = nowTime.hour() * 60 + nowTime.minute();
            const isPast = recMin < nowMin;
            return (
              <View
                className={classnames(styles.tableRow, isPast && styles.tableRowPast)}
                key={index}
              >
                <View
                  className={classnames(
                    styles.rowIcon,
                    record.type === 'high' ? styles.rowIconHigh : styles.rowIconLow
                  )}
                >
                  <Text>{record.type === 'high' ? '🔺' : '🔻'}</Text>
                </View>
                <View className={styles.rowInfo}>
                  <Text className={styles.rowType}>
                    {record.type === 'high' ? '满潮（高潮）' : '干潮（低潮）'}
                  </Text>
                  <Text className={styles.rowHeight}>潮高 {record.height} 米</Text>
                </View>
                <Text className={classnames(styles.rowTime, isPast && styles.rowTimePast)}>
                  {record.time}
                  {isPast && <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>(已过)</Text>}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 潮汐日历 */}
      <View className={styles.calendarSection}>
        <View className={styles.calendarHeader}>
          <Text className={styles.calendarTitle}>📅 潮汐日历</Text>
          <View className={styles.legendRow}>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.legendDotBest)} />
              <Text>最佳赶海日</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={classnames(styles.legendDot, styles.legendDotNormal)} />
              <Text>普通日</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollX className={styles.calendarScroll} enhanced showScrollbar={false}>
          <View className={styles.calendarDays}>
            {tideCalendar.map((day, index) => (
              <View
                className={classnames(
                  styles.calendarDay,
                  index === activeDateIndex && styles.calendarDayActive,
                  day.isBestDay && index !== activeDateIndex && styles.calendarDayBest
                )}
                key={day.date}
                onClick={() => setActiveDateIndex(index)}
              >
                <Text className={styles.dayDate}>{day.date.slice(5)}</Text>
                <Text className={styles.dayWeek}>{day.weekday}</Text>
                {day.isBestDay && <Text className={styles.dayBestTag}>⭐ 吉日</Text>}
                <View className={styles.dayTide}>
                  <View className={styles.dayTideRow}>
                    <Text className={styles.dayTideIcon}>🔻</Text>
                    <Text>{day.lowTide1}</Text>
                  </View>
                  <View className={styles.dayTideRow}>
                    <Text className={styles.dayTideIcon}>🔺</Text>
                    <Text>{day.highTide1}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 快捷入口 */}
      <View className={styles.quickActions}>
        <View className={styles.actionCard} onClick={() => navigateTo('/pages/safety/index')}>
          <View className={styles.actionIcon}>🛟</View>
          <Text className={styles.actionName}>安全退路</Text>
        </View>
        <View className={styles.actionCard} onClick={() => Taro.switchTab({ url: '/pages/window/index' })}>
          <View className={styles.actionIcon}>⏱️</View>
          <Text className={styles.actionName}>赶海窗口</Text>
        </View>
        <View className={styles.actionCard} onClick={() => navigateTo('/pages/equipment/index')}>
          <View className={styles.actionIcon}>🎒</View>
          <Text className={styles.actionName}>装备清单</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TidePage;
