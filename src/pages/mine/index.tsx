import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { harvestStats } from '@/data/harvest';

const MinePage: React.FC = () => {
  const navigateTo = (url: string) => {
    Taro.navigateTo({ url, fail: (err) => console.error('[MinePage] 跳转失败:', err) });
  };

  const menuGridItems = [
    { icon: '🛟', text: '安全退路', url: '/pages/safety/index', iconClass: styles.iconSafety },
    { icon: '🎒', text: '装备清单', url: '/pages/equipment/index', iconClass: styles.iconEquip },
    { icon: '🆘', text: '紧急求助', url: '/pages/help/index', iconClass: styles.iconHelp },
    { icon: '📅', text: '潮汐日历', url: '', iconClass: styles.iconCalendar },
    { icon: '⭐', text: '收藏海滩', url: '', iconClass: styles.iconFav },
    { icon: '👥', text: '赶海好友', url: '', iconClass: styles.iconFriends },
    { icon: '📖', text: '赶海攻略', url: '', iconClass: styles.iconGuide },
    { icon: '⚙️', text: '设置', url: '', iconClass: styles.iconSetting }
  ];

  const handleMenuClick = (item: { url: string; text: string }) => {
    if (item.url) {
      navigateTo(item.url);
    } else {
      Taro.showToast({ title: `${item.text}功能开发中`, icon: 'none' });
    }
  };

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 用户信息头部 */}
      <View className={styles.profileHeader}>
        <View className={styles.profileTop}>
          <View className={styles.avatar}>🧑‍🌊</View>
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>赶海达人小明</Text>
            <Text className={styles.userDesc}>资深赶海爱好者 · 已加入 365 天</Text>
          </View>
          <View className={styles.editBtn}>编辑</View>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>{harvestStats.totalTrips}</Text>
            <Text className={styles.statsLabel}>赶海次数</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>{harvestStats.totalSpecies}</Text>
            <Text className={styles.statsLabel}>收获物种</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>{harvestStats.totalWeight}kg</Text>
            <Text className={styles.statsLabel}>总收获量</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>L3</Text>
            <Text className={styles.statsLabel}>用户等级</Text>
          </View>
        </View>
      </View>

      {/* 功能菜单区 */}
      <View className={styles.menuSection}>
        <View className={styles.menuCard}>
          <Text className={styles.menuTitle}>🎯 常用功能</Text>
          <View className={styles.menuGrid}>
            {menuGridItems.map((item) => (
              <View
                className={styles.menuItem}
                key={item.text}
                onClick={() => handleMenuClick(item)}
              >
                <View className={classnames(styles.menuIcon, item.iconClass)}>
                  <Text>{item.icon}</Text>
                </View>
                <Text className={styles.menuItemText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 其他设置 */}
        <View className={styles.listMenu}>
          <View className={styles.listItem} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <View className={styles.listIcon}>🏆</View>
            <View className={styles.listContent}>
              <Text className={styles.listTitle}>赶海成就</Text>
              <Text className={styles.listSubtitle}>查看你的赶海勋章和成就</Text>
            </View>
            <Text className={styles.listArrow}>›</Text>
          </View>
          <View className={styles.listItem} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <View className={styles.listIcon}>📊</View>
            <View className={styles.listContent}>
              <Text className={styles.listTitle}>数据统计</Text>
              <Text className={styles.listSubtitle}>详细的赶海数据分析</Text>
            </View>
            <Text className={styles.listArrow}>›</Text>
          </View>
          <View className={styles.listItem} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <View className={styles.listIcon}>💬</View>
            <View className={styles.listContent}>
              <Text className={styles.listTitle}>意见反馈</Text>
              <Text className={styles.listSubtitle}>帮助我们做得更好</Text>
            </View>
            <Text className={styles.listArrow}>›</Text>
          </View>
          <View className={styles.listItem} onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
            <View className={styles.listIcon}>ℹ️</View>
            <View className={styles.listContent}>
              <Text className={styles.listTitle}>关于我们</Text>
              <Text className={styles.listSubtitle}>了解潮间带赶海安全</Text>
            </View>
            <Text className={styles.listArrow}>›</Text>
          </View>
        </View>

        <Text className={styles.versionInfo}>潮间带赶海安全 v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default MinePage;
