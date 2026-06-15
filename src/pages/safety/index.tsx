import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { safetyRoutes, beaches } from '@/data/beach';

const SafetyPage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState('beach1');
  const [checkList, setCheckList] = useState([
    { id: 1, text: '观察当前水位高度', checked: true },
    { id: 2, text: '确认撤离方向（向陆地方向）', checked: true },
    { id: 3, text: '标记返回路线参照物', checked: false },
    { id: 4, text: '查看天气和海浪预报', checked: false },
    { id: 5, text: '确认手机电量和信号', checked: false },
    { id: 6, text: '与同伴约定集合时间地点', checked: false }
  ]);

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId) || beaches[0],
    [selectedBeachId]
  );

  const beachRoutes = useMemo(
    () => safetyRoutes.filter((r) => r.beachId === selectedBeachId),
    [selectedBeachId]
  );

  const toggleCheck = (id: number) => {
    setCheckList((list) =>
      list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleNav = (routeId: string) => {
    Taro.navigateTo({
      url: `/pages/route-detail/index?routeId=${routeId}&beachId=${selectedBeachId}`,
      fail: (err) => console.error('[SafetyPage] 跳转失败:', err)
    });
  };

  const handleEmergency = () => {
    Taro.navigateTo({ url: '/pages/help/index' });
  };

  const handleBeachSelect = () => {
    Taro.showActionSheet({
      itemList: beaches.map((b) => b.name),
      success: (res) => {
        setSelectedBeachId(beaches[res.tapIndex].id);
      }
    });
  };

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 顶部警示横幅 */}
      <View className={styles.warningBanner}>
        <Text className={styles.bannerTitle}>🚨 安全第一</Text>
        <Text className={styles.bannerDesc}>
          赶海有风险，安全记心间！{'\n'}
          涨潮速度远超想象，切勿贪恋收获！{'\n'}
          如遇紧急情况，请立即拨打 110 / 12395（海事报警）
        </Text>
      </View>

      {/* 海滩选择 */}
      <View className={styles.card} onClick={handleBeachSelect}>
        <Text className={styles.cardTitle}>📍 当前海滩：{currentBeach.name}</Text>
        <Text style={{ fontSize: '24rpx', color: '#86909C' }}>点击切换海滩 ›</Text>
      </View>

      {/* 回头潮/围困预警 */}
      <View className={styles.tideWarningCard}>
        <Text className={styles.warningTitle}>🌊 围困风险与回头潮提醒</Text>
        <View className={styles.warningList}>
          <View className={styles.warningItem}>
            <Text className={styles.warningIcon}>⚠️</Text>
            <Text className={styles.warningText}>
              <Text style={{ color: '#F53F3F', fontWeight: 600 }}>回头潮风险：</Text>
              部分海域会出现海水突然快速上涨的"回头潮"现象，极易造成人员被困！
            </Text>
          </View>
          <View className={styles.warningItem}>
            <Text className={styles.warningIcon}>🔴</Text>
            <Text className={styles.warningText}>
              <Text style={{ color: '#F53F3F', fontWeight: 600 }}>孤立礁石：</Text>
              远离涨潮后会被海水包围的孤立礁石区域，切勿在此长时间停留！
            </Text>
          </View>
          <View className={styles.warningItem}>
            <Text className={styles.warningIcon}>💡</Text>
            <Text className={styles.warningText}>
              <Text style={{ color: '#0077B6', fontWeight: 600 }}>安全建议：</Text>
              始终向海岸线方向活动，每15分钟确认一次退路畅通，结伴同行！
            </Text>
          </View>
        </View>
      </View>

      {/* 安全路线 */}
      <View className={styles.card}>
        <Text className={styles.cardTitle}>🛣️ 安全撤离路线</Text>
        {beachRoutes.length === 0 ? (
          <Text style={{ color: '#86909C', textAlign: 'center', padding: '32rpx 0' }}>
            暂无安全路线信息
          </Text>
        ) : (
          <View className={styles.routeList}>
            {beachRoutes.map((route) => (
              <View className={styles.routeItem} key={route.id}>
                <View className={styles.routeIcon}>🧭</View>
                <View className={styles.routeInfo}>
                  <Text className={styles.routeName}>{route.name}</Text>
                  <View className={styles.routeMeta}>
                    <Text>⏱️ 约{route.estimatedTime}分钟</Text>
                    <Text>📍 {route.waypoints.length}个航点</Text>
                  </View>
                  <Text className={styles.routeDesc}>{route.description}</Text>
                </View>
                <View className={styles.routeNavBtn} onClick={() => handleNav(route.id)}>
                  导航 ›
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 出发前检查 */}
      <View className={styles.card}>
        <Text className={styles.cardTitle}>✅ 赶海安全检查清单</Text>
        <View className={styles.tideCheck}>
          {checkList.map((item) => (
            <View className={styles.checkItem} key={item.id} onClick={() => toggleCheck(item.id)}>
              <View
                className={classnames(
                  styles.checkBox,
                  item.checked && styles.checkBoxChecked
                )}
              >
                {item.checked && '✓'}
              </View>
              <Text className={styles.checkText}>{item.text}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: '22rpx', color: '#86909C', marginTop: '16rpx', textAlign: 'center' }}>
          已完成 {checkList.filter(c => c.checked).length} / {checkList.length} 项检查
        </Text>
      </View>

      {/* 紧急求助按钮 */}
      <View className={styles.emergencyBtn} onClick={handleEmergency}>
        <Text style={{ fontSize: '40rpx' }}>🆘</Text>
        <Text>一键紧急求助</Text>
      </View>
    </ScrollView>
  );
};

export default SafetyPage;
