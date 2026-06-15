import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { harvestRecords, harvestStats } from '@/data/harvest';

const HarvestPage: React.FC = () => {
  const records = harvestRecords;

  const getTotalCount = (species: { count: number }[]) => {
    return species.reduce((sum, s) => sum + s.count, 0);
  };

  const getTotalWeight = (species: { weight: number }[]) => {
    return species.reduce((sum, s) => sum + s.weight, 0).toFixed(1);
  };

  const handleAddRecord = () => {
    Taro.showToast({ title: '功能开发中...', icon: 'none' });
  };

  const handleRecordClick = (id: string) => {
    Taro.showToast({ title: `查看记录 #${id}`, icon: 'none' });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 统计卡片 */}
      <View className={styles.statsCard}>
        <Text className={styles.statsTitle}>📊 赶海日志统计</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <View>
              <Text className={styles.statValue}>{harvestStats.totalTrips}</Text>
              <Text className={styles.statUnit}>次</Text>
            </View>
            <Text className={styles.statLabel}>累计赶海</Text>
          </View>
          <View className={styles.statItem}>
            <View>
              <Text className={styles.statValue}>{harvestStats.totalSpecies}</Text>
              <Text className={styles.statUnit}>种</Text>
            </View>
            <Text className={styles.statLabel}>捕获物种</Text>
          </View>
          <View className={styles.statItem}>
            <View>
              <Text className={styles.statValue}>{harvestStats.totalWeight}</Text>
              <Text className={styles.statUnit}>kg</Text>
            </View>
            <Text className={styles.statLabel}>总收获量</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue} style={{ fontSize: '28rpx', lineHeight: 1.3 }}>
              {harvestStats.bestCatch}
            </Text>
            <Text className={styles.statLabel}>最佳战绩</Text>
          </View>
        </View>
      </View>

      {/* 新增记录按钮 */}
      <View className={styles.addBtn} onClick={handleAddRecord}>
        <Text style={{ fontSize: '32rpx' }}>+</Text>
        <Text>登记新收获</Text>
      </View>

      {/* 记录列表 */}
      <View className={styles.recordsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📝 赶海日志</Text>
          <Text className={styles.sectionCount}>{records.length}条记录</Text>
        </View>
        {records.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🐚</Text>
            <Text className={styles.emptyTitle}>暂无赶海记录</Text>
            <Text className={styles.emptyDesc}>点击上方按钮，记录你的赶海收获吧！</Text>
          </View>
        ) : (
          <View className={styles.recordList}>
            {records.map((record) => (
              <View
                className={styles.recordCard}
                key={record.id}
                onClick={() => handleRecordClick(record.id)}
              >
                <View className={styles.recordHeader}>
                  <View className={styles.recordMain}>
                    <Text className={styles.recordDate}>{record.date}</Text>
                    <Text className={styles.recordBeach}>🏖️ {record.beachName}</Text>
                  </View>
                  <View className={styles.recordMeta}>
                    <Text className={styles.metaTag}>☀️ {record.weather}</Text>
                    <Text className={styles.metaTag}>⏱️ {record.duration}小时</Text>
                  </View>
                </View>
                <View className={styles.recordStats}>
                  <View className={styles.recordStat}>
                    <Text className={styles.recordStatValue}>{record.species.length}</Text>
                    <Text className={styles.recordStatLabel}>物种数</Text>
                  </View>
                  <View className={styles.recordStat}>
                    <Text className={styles.recordStatValue}>{getTotalCount(record.species)}</Text>
                    <Text className={styles.recordStatLabel}>总数量</Text>
                  </View>
                  <View className={styles.recordStat}>
                    <Text className={styles.recordStatValue}>{getTotalWeight(record.species)}</Text>
                    <Text className={styles.recordStatLabel}>总重量(kg)</Text>
                  </View>
                </View>
                <View className={styles.speciesList}>
                  {record.species.map((s) => (
                    <View className={styles.speciesItem} key={s.name}>
                      <Text className={styles.speciesName}>{s.name}</Text>
                      <Text className={styles.speciesCount}>×{s.count}</Text>
                    </View>
                  ))}
                </View>
                <View className={styles.recordNotes}>
                  <Text>{record.notes}</Text>
                </View>
                <View className={styles.recordFooter}>
                  <Text className={styles.recordTime}>创建于 {record.createdAt}</Text>
                  <View className={styles.recordActions}>
                    <Text className={styles.actionText}>编辑</Text>
                    <Text className={styles.actionText}>分享</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HarvestPage;
