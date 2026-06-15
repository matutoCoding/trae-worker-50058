import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { getHarvestRecordById, deleteHarvestRecord } from '@/utils/storage';
import { HarvestRecord } from '@/types';

const HarvestDetailPage: React.FC = () => {
  const router = useRouter();
  const recordId = router.params?.id || '';

  const [record, setRecord] = useState<HarvestRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRecord = async () => {
    if (!recordId) return;
    setLoading(true);
    try {
      const data = await getHarvestRecordById(recordId);
      setRecord(data);
      if (!data) {
        Taro.showToast({ title: '记录不存在', icon: 'none' });
      }
    } catch (e) {
      console.error('[HarvestDetail] loadRecord error:', e);
    } finally {
      setLoading(false);
    }
  };

  useDidShow(() => {
    loadRecord();
  });

  const totalCount = useMemo(() => {
    if (!record) return 0;
    return record.species.reduce((sum, s) => sum + s.count, 0);
  }, [record]);

  const totalWeight = useMemo(() => {
    if (!record) return 0;
    return record.species.reduce((sum, s) => sum + s.weight, 0);
  }, [record]);

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/harvest-add/index?id=${recordId}` });
  };

  const handleDelete = () => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条赶海记录吗？删除后无法恢复。',
      confirmColor: '#F53F3F',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteHarvestRecord(recordId);
            Taro.showToast({ title: '删除成功', icon: 'success' });
            setTimeout(() => {
              Taro.navigateBack();
            }, 1000);
          } catch (e) {
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <View className={styles.container} style={{ paddingTop: '200rpx', textAlign: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View className={styles.container} style={{ paddingTop: '200rpx', textAlign: 'center' }}>
        <Text>记录不存在</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 头部信息 */}
      <View className={styles.headerCard}>
        <View className={styles.headerTop}>
          <Text className={styles.beachName}>🏖️ {record.beachName}</Text>
          <Text className={styles.dateText}>{record.date}</Text>
        </View>
        <View className={styles.headerMeta}>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🌤️</Text>
            <Text className={styles.metaText}>{record.weather}</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>⏱️</Text>
            <Text className={styles.metaText}>{record.duration} 小时</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>🦀</Text>
            <Text className={styles.metaText}>{totalCount} 只</Text>
          </View>
          <View className={styles.metaItem}>
            <Text className={styles.metaIcon}>⚖️</Text>
            <Text className={styles.metaText}>{totalWeight.toFixed(1)} kg</Text>
          </View>
        </View>
      </View>

      {/* 物种明细 */}
      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>📋 收获明细</Text>
        <View className={styles.speciesList}>
          {record.species.map((species, index) => (
            <View className={styles.speciesItem} key={index}>
              <View className={styles.speciesLeft}>
                <Text className={styles.speciesName}>{species.name}</Text>
              </View>
              <View className={styles.speciesRight}>
                <Text className={styles.speciesCount}>{species.count} 只</Text>
                <Text className={styles.speciesWeight}>{species.weight.toFixed(1)} kg</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 日志内容 */}
      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>📝 赶海日志</Text>
        <View className={styles.notesContent}>
          <Text className={styles.notesText}>
            {record.notes || '暂无日志内容'}
          </Text>
        </View>
      </View>

      {/* 创建时间 */}
      <View className={styles.createTime}>
        <Text>记录时间：{record.createdAt}</Text>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.deleteBtn} onClick={handleDelete}>
          <Text>删除记录</Text>
        </View>
        <View className={styles.editBtn} onClick={handleEdit}>
          <Text>编辑记录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HarvestDetailPage;
