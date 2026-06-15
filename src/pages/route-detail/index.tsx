import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { safetyRoutes, beaches } from '@/data/beach';
import { SafetyRoute } from '@/types';

const RouteDetailPage: React.FC = () => {
  const router = useRouter();
  const routeId = router.params.routeId || '';
  const beachId = router.params.beachId || '';

  const route: SafetyRoute | undefined = useMemo(() => {
    return safetyRoutes.find(r => r.id === routeId);
  }, [routeId]);

  const beach = useMemo(() => {
    return beaches.find(b => b.id === beachId);
  }, [beachId]);

  const hasValidRoute = route && route.waypoints && route.waypoints.length >= 2;

  // 计算标记点在地图上的位置（百分比）
  const markerPositions = useMemo(() => {
    if (!hasValidRoute) return [];
    const waypoints = route!.waypoints;
    const positions = waypoints.map((wp, i) => {
      const total = waypoints.length - 1;
      const progress = total > 0 ? i / total : 0;
      return {
        left: `${15 + progress * 70}%`,
        top: i % 2 === 0 ? `${25 + Math.sin(i * 0.8) * 15}%` : `${55 + Math.cos(i * 0.8) * 10}%`,
        isStart: i === 0,
        isEnd: i === waypoints.length - 1,
        index: i,
        name: i === 0 ? '起点（海滩）' : i === waypoints.length - 1 ? '终点（安全区）' : `航点${i}`
      };
    });
    return positions;
  }, [route, hasValidRoute]);

  const handleStartNav = () => {
    if (!hasValidRoute) {
      Taro.showModal({
        title: '无法导航',
        content: '该路线暂无详细航点数据，暂时无法提供导航服务。\n\n建议：\n1. 请联系当地救援部门获取最新路线信息\n2. 可参考路线说明中的描述自行前往\n3. 出发前务必确认潮汐时间和天气状况',
        showCancel: false,
        confirmText: '我知道了'
      });
      return;
    }
    Taro.showToast({ title: '模拟导航开始', icon: 'success' });
  };

  if (!route) {
    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.noRouteTip}>
          <Text className={styles.noRouteIcon}>❓</Text>
          <Text className={styles.noRouteTitle}>路线不存在</Text>
          <Text className={styles.noRouteDesc}>
            未找到对应的安全路线信息，请返回上一页重新选择。
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 地图可视化区域 */}
      <View className={styles.mapCard}>
        <View className={styles.mapOverlay} />
        <Text className={styles.mapTitle}>
          🗺️ {beach?.name || '海滩'} - {route.name}
        </Text>

        {/* 路线SVG */}
        <View className={styles.routeLine}>
          {hasValidRoute && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <path
                d={`M ${markerPositions.map((p, i) => {
                  const x = parseFloat(p.left);
                  const y = parseFloat(p.top);
                  return `${i === 0 ? '' : 'L '}${x} ${y}`;
                }).join(' ')}`}
                fill="none"
                stroke="#F53F3F"
                strokeWidth="1.5"
                strokeDasharray="3 2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          )}
        </View>

        {/* 标记点 */}
        {markerPositions.map((pos, i) => (
          <View
            className={classnames(
              styles.marker,
              pos.isStart && styles.start,
              pos.isEnd && styles.end,
              !pos.isStart && !pos.isEnd && styles.waypoint
            )}
            key={i}
            style={{ left: pos.left, top: pos.top }}
          >
            <View className={styles.markerPin} />
            {(pos.isStart || pos.isEnd) && (
              <Text className={styles.markerLabel}>{pos.name}</Text>
            )}
          </View>
        ))}
      </View>

      {/* 路线信息 */}
      <View className={styles.routeInfoCard}>
        <Text className={styles.routeName}>🧭 {route.name}</Text>
        <Text className={styles.routeDesc}>{route.description}</Text>
        <View className={styles.routeMetaRow}>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>{route.estimatedTime}</Text>
            <Text className={styles.metaLabel}>预计分钟</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>{route.waypoints.length}</Text>
            <Text className={styles.metaLabel}>途经航点</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaValue}>中等</Text>
            <Text className={styles.metaLabel}>难度等级</Text>
          </View>
        </View>
      </View>

      {/* 航点列表 */}
      <View className={styles.waypointsCard}>
        <Text className={styles.sectionTitle}>📍 航点列表</Text>
        {!hasValidRoute ? (
          <View style={{ padding: '32rpx 0', textAlign: 'center' }}>
            <Text style={{ color: '#86909C', fontSize: '26rpx' }}>暂无详细航点数据</Text>
          </View>
        ) : (
          <View className={styles.waypointList}>
            <View className={styles.waypointLine} />
            {route.waypoints.map((wp, i) => (
              <View className={styles.waypointItem} key={i}>
                <View className={styles.waypointDot} />
                <View className={styles.waypointContent}>
                  <View>
                    <Text className={styles.waypointName}>
                      {i === 0 ? '🏖️ 起点：海滩入口' :
                       i === route.waypoints.length - 1 ? '🏁 终点：安全撤离点' :
                       `📍 航点${i}`}
                    </Text>
                    <Text className={styles.waypointCoord}>
                      {wp.lat.toFixed(5)}°N, {wp.lng.toFixed(5)}°E
                    </Text>
                  </View>
                  <Text className={styles.waypointStep}>
                    第 {i + 1} 步
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 安全提示 */}
      <View className={styles.safetyTipCard}>
        <Text className={styles.sectionTitle}>⚠️ 撤离安全提示</Text>
        <View className={styles.tipList}>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>1️⃣</Text>
            <Text className={styles.tipText}>
              出发前确认潮汐时间，<strong>务必在涨潮前30分钟开始撤离</strong>
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>2️⃣</Text>
            <Text className={styles.tipText}>
              沿着路线标记的参照物前进，<strong>不要抄近路穿越滩涂</strong>
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>3️⃣</Text>
            <Text className={styles.tipText}>
              如遇水位上涨加快，<strong>立即向高处移动</strong>并拨打救援电话
            </Text>
          </View>
          <View className={styles.tipItem}>
            <Text className={styles.tipIcon}>4️⃣</Text>
            <Text className={styles.tipText}>
              建议结伴同行，<strong>每15分钟清点一次人数</strong>
            </Text>
          </View>
        </View>
      </View>

      {/* 底部导航按钮
      <View style={{ position: 'fixed', left: 0, right: 0, bottom: 0, padding: '16px 24px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', background: '#fff', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)' }}>
        <View
          style={{
            height: '52px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            boxShadow: '0 6px 20px rgba(0, 119, 182, 0.3)'
          }}
          onClick={handleStartNav}
        >
          🧭 开始导航
        </View>
      </View> */}
    </ScrollView>
  );
};

export default RouteDetailPage;
