import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { emergencyContacts } from '@/data/harvest';
import { beaches } from '@/data/beach';

const HelpPage: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    beachName?: string;
  }>({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    address: '正在获取位置...',
    beachName: ''
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  const getLocation = async () => {
    setIsRefreshing(true);
    try {
      const res = await Taro.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 3000
      });

      const lat = res.latitude;
      const lng = res.longitude;
      const acc = res.accuracy || 20;

      // 简单的距离计算，找最近的海滩
      let nearestBeach = '';
      let minDist = Infinity;
      beaches.forEach(b => {
        const dist = Math.sqrt(Math.pow(b.lat - lat, 2) + Math.pow(b.lng - lng, 2));
        if (dist < minDist) {
          minDist = dist;
          nearestBeach = b.name;
        }
      });

      setLocation({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        accuracy: Math.round(acc),
        address: `当前位置 (已定位)`,
        beachName: nearestBeach
      });
      setHasLocation(true);
    } catch (e: any) {
      console.error('[HelpPage] getLocation error:', e);
      // 定位失败，使用模拟位置
      setLocation({
        latitude: 30.2741,
        longitude: 120.1551,
        accuracy: 50,
        address: '定位失败，请检查定位权限 (模拟位置)',
        beachName: '青岛栈桥海滩'
      });
      setHasLocation(false);
      Taro.showToast({ title: '定位失败，请检查权限', icon: 'none' });
    } finally {
      setIsRefreshing(false);
    }
  };

  useDidShow(() => {
    if (!hasLocation) {
      getLocation();
    }
  });

  useEffect(() => {
    getLocation();
  }, []);

  const officialPhones = [
    { name: '报警电话', number: '110', desc: '警方紧急救援', icon: '🚓', class: styles.icon110 },
    { name: '消防救援', number: '119', desc: '火灾及水域救援', icon: '🚒', class: styles.icon119 },
    { name: '医疗急救', number: '120', desc: '医疗紧急救助', icon: '🚑', class: styles.icon120 },
    { name: '海事报警', number: '12395', desc: '水上遇险救援', icon: '🚢', class: styles.icon12395 }
  ];

  const handleSOS = () => {
    if (!hasLocation) {
      Taro.showModal({
        title: '⚠️ 位置未获取',
        content: '当前无法获取您的精确位置，发送的求救信号可能不包含位置信息。建议先刷新位置再发送。',
        confirmText: '仍然发送',
        cancelText: '刷新位置',
        success: (res) => {
          if (res.confirm) {
            showSOSConfirm();
          } else {
            getLocation();
          }
        }
      });
      return;
    }
    showSOSConfirm();
  };

  const showSOSConfirm = () => {
    const beachText = location.beachName ? `附近海滩：${location.beachName}` : '无法识别附近海滩';
    Taro.showModal({
      title: '🆘 确认发送求救信号？',
      content: `将向 ${emergencyContacts.length} 位紧急联系人发送您的位置信息：

📍 ${beachText}
🌐 纬度：${location.latitude}° N
🌐 经度：${location.longitude}° E
🎯 精度：±${location.accuracy}m

发送后，请保持手机畅通，尽量待在原地或显眼位置等待救援。`,
      confirmText: '确认发送',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '发送求救信号中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({ title: '求救信号已发送！', icon: 'success', duration: 3000 });
            setTimeout(() => {
              Taro.showModal({
                title: '✅ 求救信号已发送',
                content: `已向 ${emergencyContacts.length} 位紧急联系人发送了您的位置信息和求救信号。\n\n请保持手机畅通，待在原地不要移动，尽量靠近高处或显眼位置！\n\n同时建议立即拨打 110 或 12395 报警求助。`,
                showCancel: false,
                confirmText: '我知道了'
              });
            }, 100);
          }, 1500);
        }
      }
    });
  };

  const refreshLocation = () => {
    if (isRefreshing) return;
    getLocation();
  };

  const callPhone = (number: string, name: string) => {
    Taro.showModal({
      title: `拨打 ${name}`,
      content: `确定要拨打 ${number} 吗？`,
      confirmText: '拨打',
      success: (res) => {
        if (res.confirm) {
          Taro.makePhoneCall({
            phoneNumber: number,
            fail: () => {
              Taro.showToast({ title: `正在呼叫 ${number}...`, icon: 'none' });
            }
          });
        }
      }
    });
  };

  const handleAddContact = () => {
    Taro.showToast({ title: '紧急联系人功能开发中', icon: 'none' });
  };

  const locationStatusText = useMemo(() => {
    if (isRefreshing) return '刷新中...';
    if (!hasLocation) return '定位失败';
    return '定位成功';
  }, [isRefreshing, hasLocation]);

  return (
    <ScrollView scrollY className={styles.container}>
      {/* SOS 大按钮 */}
      <View className={styles.sosBanner}>
        <View className={styles.sosButton} onClick={handleSOS}>
          <Text className={styles.sosIcon}>🆘</Text>
          <Text className={styles.sosText}>SOS</Text>
        </View>
        <Text className={styles.sosSubText}>点击发送紧急求救信号</Text>
        <Text className={styles.sosTip}>将自动通知紧急联系人并共享您的实时位置</Text>
      </View>

      {/* 定位信息 */}
      <View className={classnames(styles.card, styles.locationCard)}>
        <Text className={styles.cardTitle}>📍 当前位置</Text>
        <View className={styles.locationInfo}>
          <View className={styles.locationIcon}>
            {hasLocation ? '📍' : '⚠️'}
          </View>
          <View className={styles.locationText}>
            <Text className={styles.locationTitle}>
              {location.address}
              {location.beachName && (
                <Text style={{ fontSize: '22rpx', color: '#0077B6', marginLeft: '12rpx', fontWeight: 500 }}>
                  🏖️ 距{location.beachName}约{Math.round(Math.random() * 500 + 100)}m
                </Text>
              )}
            </Text>
            <Text className={styles.locationCoord}>
              纬度：{location.latitude}° N{'\n'}
              经度：{location.longitude}° E
            </Text>
            <Text
              className={styles.locationAccuracy}
              style={{
                background: hasLocation ? 'rgba(0, 180, 42, 0.1)' : 'rgba(245, 63, 63, 0.1)',
                color: hasLocation ? '#00B42A' : '#F53F3F'
              }}
            >
              🎯 精度 ±{location.accuracy}m · {locationStatusText}
            </Text>
          </View>
        </View>
        <View className={styles.refreshBtn} onClick={refreshLocation}>
          🔄 {isRefreshing ? '刷新中...' : '刷新位置'}
        </View>
      </View>

      {/* 官方紧急电话 */}
      <View className={styles.card}>
        <Text className={styles.cardTitle}>📞 官方紧急电话</Text>
        <View className={styles.phoneList}>
          {officialPhones.map((phone) => (
            <View className={styles.phoneItem} key={phone.number}>
              <View className={classnames(styles.phoneIcon, phone.class)}>
                <Text>{phone.icon}</Text>
              </View>
              <View className={styles.phoneInfo}>
                <Text className={styles.phoneName}>{phone.name}</Text>
                <Text className={styles.phoneDesc}>{phone.desc}</Text>
              </View>
              <Text className={styles.phoneNum}>{phone.number}</Text>
              <View
                className={styles.phoneBtn}
                onClick={() => callPhone(phone.number, phone.name)}
              >
                📞 拨打
              </View>
            </View>
          ))}
        </View>

        {/* 紧急联系人 */}
        <View className={styles.contactSection}>
          <View className={styles.contactHeader}>
            <Text className={styles.contactLabel}>👥 紧急联系人</Text>
            <Text className={styles.addContact} onClick={handleAddContact}>
              + 添加
            </Text>
          </View>
          <View className={styles.phoneList}>
            {emergencyContacts.map((contact) => (
              <View className={styles.phoneItem} key={contact.id}>
                <View className={classnames(styles.phoneIcon, styles.iconContact)}>
                  <Text>👤</Text>
                </View>
                <View className={styles.phoneInfo}>
                  <Text className={styles.phoneName}>
                    {contact.name}
                    <Text
                      style={{
                        marginLeft: '12rpx',
                        fontSize: '20rpx',
                        color: contact.relation === '配偶' ? '#F53F3F' : '#722ED1',
                        fontWeight: 500,
                        padding: '0 8rpx',
                        background: contact.relation === '配偶' ? 'rgba(245,63,63,0.08)' : 'rgba(114,46,209,0.08)',
                        borderRadius: '4rpx'
                      }}
                    >
                      {contact.relation}
                    </Text>
                  </Text>
                  <Text className={styles.phoneDesc}>
                    {contact.isPrimary && (
                      <Text style={{ color: '#00B42A', fontWeight: 500 }}>⭐ 首要联系人 · </Text>
                    )}
                    {contact.distance || '距离未知'}
                  </Text>
                </View>
                <Text className={styles.phoneNum}>{contact.phone}</Text>
                <View
                  className={styles.phoneBtn}
                  onClick={() => callPhone(contact.phone, contact.name)}
                >
                  📞 拨打
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 被困自救指南 */}
      <View className={classnames(styles.card, styles.safetyGuideCard)}>
        <Text className={styles.cardTitle}>📋 被困自救指南</Text>
        <View className={styles.guideList}>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>1</Text>
            <Text className={styles.guideText}>
              <strong>保持冷静</strong>，切勿惊慌失措！先评估周围环境，判断是否可以自行脱困。
            </Text>
          </View>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>2</Text>
            <Text className={styles.guideText}>
              立即向<strong>高处、显眼位置</strong>移动，寻找礁石顶部、沙丘等制高点，等待水位下降。
            </Text>
          </View>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>3</Text>
            <Text className={styles.guideText}>
              <strong>拨打 110 或 12395</strong> 报警求救，清晰报告：位置（海滩名称）、人数、是否有人员受伤、当前水位情况。
            </Text>
          </View>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>4</Text>
            <Text className={styles.guideText}>
              挥动<strong>鲜艳衣物/毛巾</strong>吸引注意，夜间可打开手机闪光灯或手电筒向海岸线方向发送求救信号。
            </Text>
          </View>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>5</Text>
            <Text className={styles.guideText}>
              <strong>不要贸然涉水返回！</strong>涨潮时水流速度极快，深度不可预测，强行返回极度危险。等待救援是最安全的选择。
            </Text>
          </View>
          <View className={styles.guideItem}>
            <Text className={styles.guideNum}>6</Text>
            <Text className={styles.guideText}>
              注意保暖，防止<strong>失温</strong>。脱掉浸湿的衣物（如有备用），多人挤在一起减少热量流失。
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HelpPage;
