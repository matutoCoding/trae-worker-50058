import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { safetyRoutes, beaches } from '@/data/beach';
import { EvacuationPlan, getEvacuationPlanByBeach, saveEvacuationPlan } from '@/utils/storage';

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

  const [evacPlan, setEvacPlan] = useState<EvacuationPlan | null>(null);
  const [meetingPointInput, setMeetingPointInput] = useState('');
  const [peopleCountInput, setPeopleCountInput] = useState('2');
  const [savingPlan, setSavingPlan] = useState(false);

  const loadPlan = useCallback(async (beachId: string) => {
    try {
      const plan = await getEvacuationPlanByBeach(beachId);
      setEvacPlan(plan);
      if (plan) {
        setMeetingPointInput(plan.meetingPoint);
        setPeopleCountInput(String(plan.peopleCount));
      } else {
        setMeetingPointInput('');
        setPeopleCountInput('2');
      }
    } catch (e) {
      console.error('[SafetyPage] loadPlan error:', e);
    }
  }, []);

  useEffect(() => {
    loadPlan(selectedBeachId);
  }, [selectedBeachId, loadPlan]);

  useDidShow(() => {
    loadPlan(selectedBeachId);
  });

  const currentBeach = useMemo(
    () => beaches.find((b) => b.id === selectedBeachId) || beaches[0],
    [selectedBeachId]
  );

  const beachRoutes = useMemo(
    () => safetyRoutes.filter((r) => r.beachId === selectedBeachId),
    [selectedBeachId]
  );

  const selectedRoute = useMemo(() => {
    if (!evacPlan || !evacPlan.selectedRouteId) return null;
    return beachRoutes.find(r => r.id === evacPlan.selectedRouteId) || null;
  }, [evacPlan, beachRoutes]);

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

  const handleSelectRoute = (routeId: string) => {
    setEvacPlan(prev => prev ? { ...prev, selectedRouteId: routeId } : null);
  };

  const handleSavePlan = async () => {
    if (savingPlan) return;

    const routeId = evacPlan?.selectedRouteId || '';
    if (!routeId) {
      Taro.showToast({ title: '请选择一条撤离路线', icon: 'none' });
      return;
    }

    const peopleCount = parseInt(peopleCountInput) || 0;
    if (peopleCount <= 0) {
      Taro.showToast({ title: '同行人数需大于0', icon: 'none' });
      return;
    }

    setSavingPlan(true);
    try {
      const plan: EvacuationPlan = {
        beachId: selectedBeachId,
        selectedRouteId: routeId,
        meetingPoint: meetingPointInput.trim(),
        peopleCount
      };
      await saveEvacuationPlan(plan);
      setEvacPlan(plan);
      Taro.showToast({ title: '计划已保存', icon: 'success' });
    } catch (e) {
      Taro.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      setSavingPlan(false);
    }
  };

  const handlePeopleChange = (delta: number) => {
    const current = parseInt(peopleCountInput) || 0;
    const next = Math.max(1, Math.min(20, current + delta));
    setPeopleCountInput(String(next));
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

      {/* 我的撤离计划 */}
      <View className={styles.planCard}>
        <View className={styles.planHeader}>
          <Text className={styles.planTitle}>📋 我的撤离计划</Text>
          <Text className={styles.planSaveBtn} onClick={handleSavePlan}>
            {savingPlan ? '保存中...' : '保存计划'}
          </Text>
        </View>

        {/* 常用路线 */}
        <View className={styles.planSection}>
          <Text className={styles.planLabel}>常用路线</Text>
          {beachRoutes.length === 0 ? (
            <Text className={styles.planEmpty}>该海滩暂无撤离路线</Text>
          ) : (
            <View className={styles.routeSelectList}>
              {beachRoutes.map((route) => (
                <View
                  className={classnames(
                    styles.routeSelectItem,
                    evacPlan?.selectedRouteId === route.id && styles.routeSelectItemActive
                  )}
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                >
                  <View className={styles.routeSelectCheck}>
                    {evacPlan?.selectedRouteId === route.id && '✓'}
                  </View>
                  <View className={styles.routeSelectInfo}>
                    <Text className={styles.routeSelectName}>{route.name}</Text>
                    <Text className={styles.routeSelectMeta}>
                      约{route.estimatedTime}分钟 · {route.waypoints.length}个航点
                    </Text>
                  </View>
                  <View
                    className={styles.routeSelectNav}
                    onClick={(e) => { e.stopPropagation(); handleNav(route.id); }}
                  >
                    导航 ›
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 集合点 */}
        <View className={styles.planSection}>
          <Text className={styles.planLabel}>集合地点</Text>
          <View className={styles.planInputWrap}>
            <Input
              className={styles.planInput}
              placeholder='请输入撤离集合地点'
              value={meetingPointInput}
              onInput={(e) => setMeetingPointInput(e.detail.value)}
              maxlength={30}
            />
          </View>
        </View>

        {/* 同行人数 */}
        <View className={styles.planSection}>
          <Text className={styles.planLabel}>同行人数</Text>
          <View className={styles.peopleSelector}>
            <View className={styles.peopleBtn} onClick={() => handlePeopleChange(-1)}>－</View>
            <Text className={styles.peopleNum}>{peopleCountInput}</Text>
            <View className={styles.peopleBtn} onClick={() => handlePeopleChange(1)}>＋</View>
            <Text className={styles.peopleUnit}>人</Text>
          </View>
        </View>

        {selectedRoute && (
          <View className={styles.planSummary}>
            <Text className={styles.planSummaryTitle}>📌 计划概览</Text>
            <Text className={styles.planSummaryText}>
              路线：{selectedRoute.name}{'\n'}
              集合点：{evacPlan?.meetingPoint || '未设置'}{'\n'}
              同行：{peopleCountInput}人
            </Text>
          </View>
        )}
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
