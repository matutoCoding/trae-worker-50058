import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { defaultEquipmentList, equipmentCategories } from '@/data/equipment';
import { Equipment } from '@/types';

const EquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(
    defaultEquipmentList.map((e) => ({ ...e, checked: false }))
  );
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = Object.entries(equipmentCategories);

  const toggleEquip = (id: string) => {
    setEquipmentList((list) =>
      list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const stats = useMemo(() => {
    const total = equipmentList.length;
    const checked = equipmentList.filter((e) => e.checked).length;
    const essentialTotal = equipmentList.filter((e) => e.essential).length;
    const essentialChecked = equipmentList.filter((e) => e.essential && e.checked).length;
    const missingEssential = equipmentList.filter((e) => e.essential && !e.checked);
    return {
      total,
      checked,
      percent: total > 0 ? Math.round((checked / total) * 100) : 0,
      essentialTotal,
      essentialChecked,
      essentialMissing: essentialTotal - essentialChecked,
      missingEssential
    };
  }, [equipmentList]);

  const filteredList = useMemo(() => {
    if (activeTab === 'all') return equipmentList;
    if (activeTab === 'essential') return equipmentList.filter((e) => e.essential);
    return equipmentList.filter((e) => e.category === activeTab);
  }, [equipmentList, activeTab]);

  const getCategoryEquipment = (category: string) => {
    return filteredList.filter((e) => e.category === category);
  };

  const handleReset = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要重置所有勾选状态吗？',
      success: (res) => {
        if (res.confirm) {
          setEquipmentList((list) => list.map((e) => ({ ...e, checked: false })));
        }
      }
    });
  };

  const handleCheckAll = () => {
    setEquipmentList((list) => list.map((e) => ({ ...e, checked: true })));
  };

  const tabs = [
    { key: 'all', label: '全部', count: stats.total },
    { key: 'essential', label: '必备', count: stats.essentialTotal },
    { key: 'clothing', label: '服装', count: equipmentList.filter((e) => e.category === 'clothing').length },
    { key: 'tool', label: '工具', count: equipmentList.filter((e) => e.category === 'tool').length },
    { key: 'safety', label: '安全', count: equipmentList.filter((e) => e.category === 'safety').length },
    { key: 'food', label: '补给', count: equipmentList.filter((e) => e.category === 'food').length }
  ];

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 进度卡片 */}
      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>🎒 装备准备进度</Text>
          <Text className={styles.progressPercent}>{stats.percent}%</Text>
        </View>
        <View className={styles.progressBarWrap}>
          <View className={styles.progressFill} style={{ width: `${stats.percent}%` }} />
        </View>
        <View className={styles.progressStats}>
          <Text>已准备 {stats.checked} / {stats.total} 件</Text>
          <Text>
            必备装备 {stats.essentialChecked}/{stats.essentialTotal}
            {stats.essentialMissing > 0 && (
              <Text style={{ color: '#FF6B6B', marginLeft: '8rpx' }}>
                (缺{stats.essentialMissing}件)
              </Text>
            )}
          </Text>
        </View>
      </View>

      {/* 缺失必备装备提醒 */}
      {stats.missingEssential.length > 0 && (
        <View className={styles.missingTip}>
          <Text className={styles.missingIcon}>⚠️</Text>
          <View className={styles.missingText}>
            <Text>还有 {stats.essentialMissing} 件<strong>必备装备</strong>未准备：</Text>
            <View className={styles.missingList}>
              {stats.missingEssential.map((e) => (
                <Text className={styles.missingItem} key={e.id}>{e.name}</Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 分类Tab */}
      <View className={styles.tabsSection}>
        <ScrollView scrollX enhanced showScrollbar={false}>
          <View className={styles.tabsList} style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}>
            {tabs.map((tab) => (
              <View
                className={classnames(
                  styles.tabItem,
                  activeTab === tab.key && styles.tabItemActive
                )}
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <Text
                  className={classnames(
                    styles.tabBadge,
                    activeTab !== tab.key && styles.tabBadgeInactive
                  )}
                >
                  {tab.count}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 装备列表 */}
      {(activeTab === 'all' || activeTab === 'essential') ? (
        categories.map(([catKey, cat]) => {
          const catEquip = getCategoryEquipment(catKey);
          if (catEquip.length === 0) return null;
          const checkedCount = catEquip.filter((e) => e.checked).length;
          return (
            <View className={styles.categorySection} key={catKey}>
              <View className={styles.categoryHeader}>
                <Text className={styles.categoryTitle}>
                  <Text className={styles.categoryIcon}>{cat.icon}</Text>
                  {cat.name}
                </Text>
                <Text className={styles.categoryCount}>
                  {checkedCount}/{catEquip.length}
                </Text>
              </View>
              <View className={styles.equipmentList}>
                {catEquip.map((equip) => (
                  <View
                    className={classnames(
                      styles.equipmentItem,
                      equip.checked && styles.equipmentItemChecked
                    )}
                    key={equip.id}
                    onClick={() => toggleEquip(equip.id)}
                  >
                    <View
                      className={classnames(
                        styles.checkBox,
                        equip.checked && styles.checkBoxChecked
                      )}
                    >
                      {equip.checked && '✓'}
                    </View>
                    <View className={styles.equipInfo}>
                      <View className={styles.equipHeader}>
                        <Text
                          className={classnames(
                            styles.equipName,
                            equip.checked && styles.equipNameChecked
                          )}
                        >
                          {equip.name}
                        </Text>
                        {equip.essential && (
                          <Text className={styles.essentialTag}>必备</Text>
                        )}
                      </View>
                      <Text className={styles.equipDesc}>{equip.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          );
        })
      ) : (
        <View className={styles.equipmentList}>
          {filteredList.map((equip) => (
            <View
              className={classnames(
                styles.equipmentItem,
                equip.checked && styles.equipmentItemChecked
              )}
              key={equip.id}
              onClick={() => toggleEquip(equip.id)}
            >
              <View
                className={classnames(
                  styles.checkBox,
                  equip.checked && styles.checkBoxChecked
                )}
              >
                {equip.checked && '✓'}
              </View>
              <View className={styles.equipInfo}>
                <View className={styles.equipHeader}>
                  <Text
                    className={classnames(
                      styles.equipName,
                      equip.checked && styles.equipNameChecked
                    )}
                  >
                    {equip.name}
                  </Text>
                  {equip.essential && <Text className={styles.essentialTag}>必备</Text>}
                </View>
                <Text className={styles.equipDesc}>{equip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <View className={classnames(styles.bottomBtn, styles.btnSecondary)} onClick={handleReset}>
          🔄 重置
        </View>
        <View className={classnames(styles.bottomBtn, styles.btnPrimary)} onClick={handleCheckAll}>
          ✓ 一键全选
        </View>
      </View>
    </ScrollView>
  );
};

export default EquipmentPage;
