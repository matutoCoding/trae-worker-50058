import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { todayTideData, tideCalendar, getCatchWindow } from '@/data/tide';
import { beaches } from '@/data/beach';

const TidePage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>('beach1');
  const [activeDateIndex, setActiveDateIndex] = useState<number>(0);

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId),
    [selectedBeachId]
  );

  const currentTide = useMemo(
    () => todayTideData.find((t) => t.beachId === selectedBeachId) || todayTideData[0],
    [selectedBeachId]
  );

  const catchWindow = useMemo(
    () => getCatchWindow(currentTide),
    [currentTide]
  );

  const currentTideRecord = useMemo(() => {
    const now = dayjs();
    const currentMinutes = now.hour() * 60 + now.minute();
    let closest = currentTide.records[0];
    let minDiff = Infinity;

    currentTide.records.forEach((record) => {
      const [h, m] = record.time.split(':').map(Number);
      const diff = Math.abs(h * 60 + m - currentMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closest = record;
      }
    });
    return closest;
  }, [currentTide]);

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
            {dayjs().format('YYYY年M月D日 dddd')}
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
            <Text className={styles.statusLabel}>{getTideStatusText(currentTideRecord?.type)}</Text>
            <View>
              <Text className={styles.statusValue}>{currentTideRecord?.height}</Text>
              <Text className={styles.statusUnit}> 米</Text>
            </View>
            <Text className={styles.statusTime}>最近时刻 {currentTideRecord?.time}</Text>
          </View>
          <Text className={styles.tideIcon}>
            {currentTideRecord?.type === 'high' || currentTideRecord?.type === 'rising' ? '🌊' : '🏖️'}
          </Text>
        </View>
        <View className={styles.overviewFooter}>
          <View className={styles.overviewItem}>
            <Text className={styles.itemLabel}>下次高潮</Text>
            <Text className={styles.itemValue}>
              {currentTide.records.find((r) => r.type === 'high')?.time || '--:--'}
            </Text>
          </View>
          <View className={styles.overviewItem}>
            <Text className={styles.itemLabel}>下次低潮</Text>
            <Text className={styles.itemValue}>
              {currentTide.records.find((r) => r.type === 'low')?.time || '--:--'}
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
        {catchWindow && (
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
          </>
        )}
      </View>

      {/* 潮汐表 */}
      <View className={styles.tideTable}>
        <Text className={styles.tableTitle}>📋 今日潮汐表</Text>
        <View className={styles.tableList}>
          {currentTide.records.map((record, index) => (
            <View className={styles.tableRow} key={index}>
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
              <Text className={styles.rowTime}>{record.time}</Text>
            </View>
          ))}
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
