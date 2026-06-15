import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { todayTideData, getCatchWindow, getEvacuationCountdown } from '@/data/tide';
import { beaches } from '@/data/beach';

const WindowPage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>('beach1');
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 30 });

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId) || beaches[0],
    [selectedBeachId]
  );

  const currentTide = useMemo(
    () => todayTideData.find((t) => t.beachId === selectedBeachId) || todayTideData[0],
    [selectedBeachId]
  );

  const catchWindow = useMemo(() => getCatchWindow(currentTide), [currentTide]);
  const evacuation = useMemo(() => getEvacuationCountdown(currentTide), [currentTide]);

  // 模拟倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes } = prev;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 0;
          minutes = 0;
        }
        return { hours, minutes };
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getDifficultyText = (diff: string) => {
    switch (diff) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '';
    }
  };

  const getDifficultyClass = (diff: string) => {
    switch (diff) {
      case 'easy': return styles.difficultyEasy;
      case 'medium': return styles.difficultyMedium;
      case 'hard': return styles.difficultyHard;
      default: return '';
    }
  };

  const timelineData = useMemo(() => {
    if (!catchWindow) return [];
    return [
      {
        time: catchWindow.windowStart,
        label: '赶海窗口开启',
        desc: '潮水退至安全高度，可以开始赶海',
        level: 'success',
        badge: '✓ 安全'
      },
      {
        time: dayjs().format('HH:mm'),
        label: '当前时间',
        desc: '正在赶海中，注意观察水位变化',
        level: 'active',
        badge: '📍 当前'
      },
      {
        time: catchWindow.lowTideTime,
        label: '低潮时刻',
        desc: '潮水最低，此时收获最佳',
        level: 'warning',
        badge: '🎣 最佳时机'
      },
      {
        time: catchWindow.windowEnd,
        label: '窗口结束/开始撤离',
        desc: '水位上涨，必须撤离到安全区域',
        level: 'danger',
        badge: '⚠️ 撤离'
      }
    ];
  }, [catchWindow]);

  const getCountdownClass = () => {
    const total = countdown.hours * 60 + countdown.minutes;
    if (total <= 30) return styles.dangerCountdown;
    if (total <= 90) return '';
    return styles.safeCountdown;
  };

  const getCountdownStatus = () => {
    const total = countdown.hours * 60 + countdown.minutes;
    if (total <= 30) return { text: '紧急撤离', style: { background: 'rgba(255,255,255,0.3)' } };
    if (total <= 90) return { text: '准备撤离', style: {} };
    return { text: '赶海中', style: {} };
  };

  const status = getCountdownStatus();

  const progressPercent = useMemo(() => {
    const total = 210;
    const elapsed = 150 - (countdown.hours * 60 + countdown.minutes);
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
  }, [countdown]);

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 撤离倒计时卡片 */}
      <View className={classnames(styles.countdownCard, getCountdownClass())}>
        <View className={styles.countdownHeader}>
          <Text className={styles.countdownTitle}>⏱️ 涨潮撤离倒计时</Text>
          <Text className={styles.countdownStatus} style={status.style}>{status.text}</Text>
        </View>
        <View className={styles.countdownMain}>
          <View className={styles.timeBlock}>
            <View className={styles.timeNumber}>
              <Text className={styles.timeValue}>{String(countdown.hours).padStart(2, '0')}</Text>
            </View>
            <Text className={styles.timeLabel}>小时</Text>
          </View>
          <Text className={styles.timeSeparator}>:</Text>
          <View className={styles.timeBlock}>
            <View className={styles.timeNumber}>
              <Text className={styles.timeValue}>{String(countdown.minutes).padStart(2, '0')}</Text>
            </View>
            <Text className={styles.timeLabel}>分钟</Text>
          </View>
        </View>
        <View className={styles.countdownTip}>
          ⚡ 距离 {currentBeach.name} 涨潮安全撤离还有 {countdown.hours}小时{countdown.minutes}分钟
          （涨潮前1小时为撤离截止线）
        </View>
      </View>

      {/* 窗口进度条 */}
      <View className={styles.windowProgressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>📊 赶海窗口进度</Text>
          <Text className={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          <View className={styles.progressMarker} style={{ left: `${progressPercent}%` }} />
        </View>
        <View className={styles.progressLabels}>
          <Text>窗口开启 {catchWindow?.windowStart || '--:--'}</Text>
          <Text className={styles.labelCurrent}>当前</Text>
          <Text>必须撤离 {catchWindow?.windowEnd || '--:--'}</Text>
        </View>
      </View>

      {/* 时间线 */}
      <View className={styles.windowTimeline}>
        <Text className={styles.timelineTitle}>📝 赶海时间线</Text>
        <View className={styles.timelineList}>
          <View className={styles.timelineLine} />
          {timelineData.map((item, index) => (
            <View className={styles.timelineItem} key={index}>
              <View
                className={classnames(
                  styles.timelineDot,
                  item.level === 'success' && styles.dotSuccess,
                  item.level === 'warning' && styles.dotWarning,
                  item.level === 'danger' && styles.dotDanger,
                  item.level === 'active' && styles.dotActive
                )}
              />
              <Text className={styles.timelineTime}>{item.time}</Text>
              <Text className={styles.timelineLabel}>{item.label}</Text>
              <Text className={styles.timelineDesc}>{item.desc}</Text>
              <View
                className={classnames(
                  styles.timelineBadge,
                  item.level === 'success' && styles.badgeSuccess,
                  item.level === 'warning' && styles.badgeWarning,
                  item.level === 'danger' && styles.badgeDanger
                )}
              >
                {item.badge}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 海滩选择 */}
      <View className={styles.beachSelectCard}>
        <View className={styles.selectHeader}>
          <Text className={styles.selectTitle}>🏖️ 选择海滩</Text>
          <Text className={styles.selectCurrent}>当前: {currentBeach.name}</Text>
        </View>
        <View className={styles.beachList}>
          {beaches.map((beach) => (
            <View
              className={classnames(
                styles.beachItem,
                beach.id === selectedBeachId && styles.beachItemActive
              )}
              key={beach.id}
              onClick={() => setSelectedBeachId(beach.id)}
            >
              <View className={styles.beachIcon}>🌊</View>
              <View className={styles.beachInfo}>
                <Text className={styles.beachName}>{beach.name}</Text>
                <View className={styles.beachMeta}>
                  <Text>📍 {beach.location}</Text>
                  <View className={classnames(styles.difficultyTag, getDifficultyClass(beach.difficulty))}>
                    {getDifficultyText(beach.difficulty)}
                  </View>
                </View>
              </View>
              <View
                className={classnames(
                  styles.beachCheck,
                  beach.id === selectedBeachId ? styles.checkActive : styles.checkInactive
                )}
              >
                ✓
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 安全提示 */}
      <View className={styles.safetyTips}>
        <Text className={styles.tipsTitle}>💡 赶海安全提示</Text>
        <View className={styles.tipsList}>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>⏰</Text>
            <Text className={styles.tipText}>
              建议在低潮前1-2小时到达海滩，提前熟悉地形和撤离路线。
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>👀</Text>
            <Text className={styles.tipText}>
              赶海过程中每15分钟观察一次水位变化，发现潮水上涨立即撤离。
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>👨‍👩‍👧</Text>
            <Text className={styles.tipText}>
              切勿单独赶海，建议2-3人结伴同行，儿童必须由成人全程陪同。
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>📱</Text>
            <Text className={styles.tipText}>
              保持手机电量充足，提前保存紧急联系人和救援电话。
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WindowPage;
