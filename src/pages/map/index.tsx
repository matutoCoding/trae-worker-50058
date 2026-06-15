import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { beaches, catchSpots, riskAreas } from '@/data/beach';

const MapPage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>('beach1');
  const [selectedSpotId, setSelectedSpotId] = useState<string>('');

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId) || beaches[0],
    [selectedBeachId]
  );

  const beachSpots = useMemo(
    () => catchSpots.filter((s) => s.beachId === selectedBeachId),
    [selectedBeachId]
  );

  const beachRisks = useMemo(
    () => riskAreas.filter((r) => r.beachId === selectedBeachId),
    [selectedBeachId]
  );

  const getSpotTypeText = (type: string) => {
    switch (type) {
      case 'rock': return '礁石区';
      case 'sand': return '滩涂区';
      case 'reef': return '岩礁区';
      default: return '';
    }
  };

  const getRiskLevelClass = (level: string) => {
    return level === 'high' ? styles.riskHigh : styles.riskMedium;
  };

  const getRiskLevelBadgeClass = (level: string) => {
    return level === 'high' ? styles.riskLevelHigh : styles.riskLevelMedium;
  };

  const getRiskLevelText = (level: string) => {
    return level === 'high' ? '🔴 高风险' : '🟠 中风险';
  };

  const navigateTo = (url: string) => {
    Taro.navigateTo({ url, fail: (err) => console.error('[MapPage] 跳转失败:', err) });
  };

  const handleBeachSelect = () => {
    Taro.showActionSheet({
      itemList: beaches.map((b) => b.name),
      success: (res) => {
        setSelectedBeachId(beaches[res.tapIndex].id);
        setSelectedSpotId('');
      },
      fail: (err) => console.error('[MapPage] 选择海滩失败:', err)
    });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 地图占位 */}
      <View className={styles.mapPlaceholder}>
        <View className={styles.mapGrid} />
        <View className={styles.mapDecorations}>
          <View className={styles.mapTopInfo}>
            <View className={styles.mapBadge}>
              <Text className={styles.badgeLabel}>当前海滩</Text>
              <Text className={styles.badgeValue}>{currentBeach.name}</Text>
            </View>
            <View
              className={styles.mapBadge}
              style={{ padding: '12rpx 20rpx', borderRadius: '50%' }}
              onClick={handleBeachSelect}
            >
              <Text>🔄</Text>
            </View>
          </View>
          <View className={styles.mapMarkers}>
            <View
              className={classnames(styles.mapMarker, styles.markerActive)}
              style={{ left: '50%', top: '60%' }}
            >
              <View className={styles.markerPin} />
              <Text className={styles.markerLabel}>📍 {currentBeach.name}</Text>
            </View>
            {beachSpots.slice(0, 3).map((spot, index) => (
              <View
                key={spot.id}
                className={classnames(
                  styles.mapMarker,
                  styles.markerSpot,
                  spot.id === selectedSpotId && styles.markerActive
                )}
                style={{
                  left: `${25 + index * 20}%`,
                  top: `${40 + (index % 2) * 25}%`
                }}
                onClick={() => setSelectedSpotId(spot.id === selectedSpotId ? '' : spot.id)}
              >
                <View className={styles.markerPin} />
                {spot.id === selectedSpotId && (
                  <Text className={styles.markerLabel}>{spot.name}</Text>
                )}
              </View>
            ))}
          </View>
          <View className={styles.mapControls}>
            <View className={styles.controlBtn}>📍</View>
            <View className={styles.controlBtn}>🔍</View>
          </View>
        </View>
      </View>

      {/* 海滩详情 */}
      <View className={styles.beachSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🏖️ 海滩详情</Text>
          <Text className={styles.sectionCount}>{beaches.length}个海滩</Text>
        </View>
        <View className={styles.selectedBeachCard}>
          <View className={styles.beachHeader}>
            <View className={styles.beachAvatar}>🌊</View>
            <View className={styles.beachMainInfo}>
              <Text className={styles.beachName}>{currentBeach.name}</Text>
              <Text className={styles.beachLocation}>📍 {currentBeach.location}</Text>
              <View className={styles.facilityRow}>
                <View
                  className={classnames(
                    styles.facilityTag,
                    currentBeach.hasLifeguard && styles.facilityEnabled
                  )}
                >
                  {currentBeach.hasLifeguard ? '✓' : '✗'} 救生员
                </View>
                <View
                  className={classnames(
                    styles.facilityTag,
                    currentBeach.hasToilet && styles.facilityEnabled
                  )}
                >
                  {currentBeach.hasToilet ? '✓' : '✗'} 洗手间
                </View>
                <View
                  className={classnames(
                    styles.facilityTag,
                    currentBeach.hasParking && styles.facilityEnabled
                  )}
                >
                  {currentBeach.hasParking ? '✓' : '✗'} 停车场
                </View>
              </View>
            </View>
          </View>
          <Text className={styles.beachDescription}>{currentBeach.description}</Text>
          <View className={styles.speciesSection}>
            <Text className={styles.speciesLabel}>🦀 常见物种</Text>
            <View className={styles.speciesList}>
              {currentBeach.commonSpecies.map((s) => (
                <View className={styles.speciesTag} key={s}>{s}</View>
              ))}
            </View>
          </View>
          <View className={styles.actionRow}>
            <View className={classnames(styles.actionBtn, styles.btnSecondary)} onClick={() => navigateTo('/pages/safety/index')}>
              🛟 安全路线
            </View>
            <View className={classnames(styles.actionBtn, styles.btnPrimary)} onClick={() => Taro.showToast({ title: '导航启动中...', icon: 'loading' })}>
              🧭 导航前往
            </View>
          </View>
        </View>
      </View>

      {/* 赶海点列表 */}
      <View className={styles.catchSpotsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>🎯 赶海点标注</Text>
          <Text className={styles.sectionCount}>{beachSpots.length}个点位</Text>
        </View>
        {beachSpots.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#86909C', padding: '32rpx 0' }}>
            暂无赶海点信息
          </Text>
        ) : (
          <View className={styles.spotsList}>
            {beachSpots.map((spot) => (
              <View
                className={classnames(
                  styles.spotItem,
                  spot.id === selectedSpotId && styles.spotItemActive
                )}
                key={spot.id}
                onClick={() => setSelectedSpotId(spot.id === selectedSpotId ? '' : spot.id)}
              >
                <View className={styles.spotIcon}>🎣</View>
                <View className={styles.spotInfo}>
                  <Text className={styles.spotName}>{spot.name}</Text>
                  <View>
                    <Text className={styles.spotType}>{getSpotTypeText(spot.type)}</Text>
                  </View>
                  <Text className={styles.spotDesc}>{spot.description}</Text>
                  <View className={styles.spotSpecies}>
                    {spot.species.map((s) => (
                      <Text className={styles.spotSpeciesTag} key={s}>{s}</Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 围困风险区域 */}
      {beachRisks.length > 0 && (
        <View className={styles.riskSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>⚠️ 围困风险预警</Text>
          </View>
          <View className={styles.riskList}>
            {beachRisks.map((risk, index) => (
              <View
                className={classnames(styles.riskItem, getRiskLevelClass(risk.riskLevel))}
                key={index}
              >
                <View className={styles.riskHeader}>
                  <Text className={styles.riskName}>{risk.name}</Text>
                  <View
                    className={classnames(styles.riskLevel, getRiskLevelBadgeClass(risk.riskLevel))}
                  >
                    {getRiskLevelText(risk.riskLevel)}
                  </View>
                </View>
                <Text className={styles.riskDesc}>{risk.description}</Text>
                <View className={styles.riskWarning}>
                  <Text>🚨</Text>
                  <Text>{risk.warning}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MapPage;
