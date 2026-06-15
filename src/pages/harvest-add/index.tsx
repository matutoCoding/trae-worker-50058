import React, { useState } from 'react';
import { View, Text, ScrollView, Textarea, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { beaches } from '@/data/beach';
import { commonSpecies } from '@/data/harvest';
import { HarvestRecord, HarvestSpecies } from '@/types';
import { saveHarvestRecord, generateId, formatDate, formatDateTime } from '@/utils/storage';

const weatherOptions = ['晴', '多云', '阴', '小雨', '阵雨', '晴转多云'];

const HarvestAddPage: React.FC = () => {
  const [selectedBeachId, setSelectedBeachId] = useState<string>('');
  const [speciesList, setSpeciesList] = useState<HarvestSpecies[]>([]);
  const [weather, setWeather] = useState<string>('晴');
  const [duration, setDuration] = useState<string>('3');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const selectedBeach = beaches.find(b => b.id === selectedBeachId);

  const handleBeachSelect = () => {
    Taro.showActionSheet({
      itemList: beaches.map(b => b.name),
      success: (res) => {
        setSelectedBeachId(beaches[res.tapIndex].id);
      }
    });
  };

  const handleAddSpecies = () => {
    Taro.showActionSheet({
      itemList: commonSpecies,
      success: (res) => {
        const name = commonSpecies[res.tapIndex];
        const exists = speciesList.find(s => s.name === name);
        if (exists) {
          Taro.showToast({ title: '已添加该物种', icon: 'none' });
          return;
        }
        setSpeciesList(list => [...list, { name, count: 1, weight: 0.1 }]);
      }
    });
  };

  const updateSpeciesCount = (name: string, delta: number) => {
    setSpeciesList(list => list.map(s => {
      if (s.name === name) {
        const newCount = Math.max(0, s.count + delta);
        return { ...s, count: newCount };
      }
      return s;
    }));
  };

  const updateSpeciesWeight = (name: string, weightStr: string) => {
    const weight = parseFloat(weightStr) || 0;
    setSpeciesList(list => list.map(s => {
      if (s.name === name) {
        return { ...s, weight: Math.max(0, weight) };
      }
      return s;
    }));
  };

  const removeSpecies = (name: string) => {
    Taro.showModal({
      title: '提示',
      content: `确定移除 ${name} 吗？`,
      success: (res) => {
        if (res.confirm) {
          setSpeciesList(list => list.filter(s => s.name !== name));
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!selectedBeachId) {
      Taro.showToast({ title: '请选择海滩', icon: 'none' });
      return;
    }
    if (speciesList.length === 0) {
      Taro.showToast({ title: '请添加至少一种收获物种', icon: 'none' });
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    Taro.showLoading({ title: '保存中...' });

    try {
      const now = new Date();
      const record: HarvestRecord = {
        id: generateId(),
        date: formatDate(now),
        beachId: selectedBeachId,
        beachName: selectedBeach?.name || '',
        species: speciesList.filter(s => s.count > 0),
        weather,
        duration: parseFloat(duration) || 0,
        notes,
        imageIds: [],
        createdAt: formatDateTime(now)
      };

      await saveHarvestRecord(record);
      Taro.hideLoading();
      Taro.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    } catch (e) {
      Taro.hideLoading();
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '提示',
      content: '确定取消吗？已填写的内容将丢失',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      }
    });
  };

  const totalCount = speciesList.reduce((sum, s) => sum + s.count, 0);
  const totalWeight = speciesList.reduce((sum, s) => sum + s.weight, 0).toFixed(1);

  return (
    <ScrollView scrollY className={styles.container}>
      {/* 海滩选择 */}
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>📍 海滩信息</Text>
        <View className={styles.formRow} onClick={handleBeachSelect}>
          <Text className={styles.formLabel}>目标海滩</Text>
          <Text className={classnames(styles.formValue, !selectedBeachId && styles.placeholder)}>
            {selectedBeach?.name || '请选择海滩'}
          </Text>
          <Text className={styles.formArrow}>›</Text>
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>天气</Text>
          <View className={styles.weatherTags}>
            {weatherOptions.map(w => (
              <Text
                className={classnames(styles.weatherTag, weather === w && styles.weatherTagActive)}
                key={w}
                onClick={() => setWeather(w)}
              >
                {w}
              </Text>
            ))}
          </View>
        </View>
        <View className={styles.formRow}>
          <Text className={styles.formLabel}>赶海时长</Text>
          <View className={styles.durationInput}>
            <Text className={styles.durationNum}>{duration}</Text>
            <View style={{ display: 'flex', flexDirection: 'column', gap: '4rpx' }}>
              <Text
                style={{ fontSize: '24rpx', lineHeight: 1, color: '#0077B6' }}
                onClick={() => setDuration(String(Math.min(12, parseFloat(duration) + 0.5)))}
              >
                ▲
              </Text>
              <Text
                style={{ fontSize: '24rpx', lineHeight: 1, color: '#0077B6' }}
                onClick={() => setDuration(String(Math.max(0.5, parseFloat(duration) - 0.5)))}
              >
                ▼
              </Text>
            </View>
            <Text className={styles.durationUnit}>小时</Text>
          </View>
        </View>
      </View>

      {/* 收获物种 */}
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          🦀 收获物种
          <Text style={{ fontSize: '24rpx', color: '#86909C', fontWeight: 400, marginLeft: '12rpx' }}>
            共 {totalCount} 只 / {totalWeight} kg
          </Text>
        </Text>
        {speciesList.length === 0 ? (
          <View className={styles.emptyHint}>还没有添加收获物种</View>
        ) : (
          <View className={styles.speciesList}>
            {speciesList.map(species => (
              <View className={styles.speciesItem} key={species.name}>
                <Text className={styles.speciesName}>{species.name}</Text>
                <View className={styles.speciesCount}>
                  <Text
                    className={styles.countBtn}
                    onClick={() => updateSpeciesCount(species.name, -1)}
                  >
                    -
                  </Text>
                  <Text className={styles.countNum}>{species.count}</Text>
                  <Text
                    className={styles.countBtn}
                    onClick={() => updateSpeciesCount(species.name, 1)}
                  >
                    +
                  </Text>
                </View>
                <Input
                  type='digit'
                  value={String(species.weight)}
                  onInput={(e) => updateSpeciesWeight(species.name, e.detail.value)}
                  style={{ width: '100rpx', textAlign: 'right', fontSize: '26rpx', color: '#86909C' }}
                />
                <Text style={{ fontSize: '22rpx', color: '#86909C', marginLeft: '4rpx' }}>kg</Text>
                <Text
                  style={{ marginLeft: '16rpx', fontSize: '28rpx', color: '#F53F3F' }}
                  onClick={() => removeSpecies(species.name)}
                >
                  ✕
                </Text>
              </View>
            ))}
          </View>
        )}
        <View className={styles.addSpeciesBtn} style={{ marginTop: '24rpx' }} onClick={handleAddSpecies}>
          <Text>+ 添加物种</Text>
        </View>
      </View>

      {/* 日志笔记 */}
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>📝 赶海日志</Text>
        <View className={styles.textareaWrap}>
          <Textarea
            className={styles.textarea}
            placeholder='记录一下今天的赶海体验吧...'
            value={notes}
            onInput={(e) => setNotes(e.detail.value)}
            maxlength={500}
            autoHeight
          />
        </View>
        <Text style={{ fontSize: '22rpx', color: '#86909C', textAlign: 'right', marginTop: '12rpx' }}>
          {notes.length}/500
        </Text>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={handleCancel}>取消</View>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          {submitting ? '保存中...' : '保存记录'}
        </View>
      </View>
    </ScrollView>
  );
};

export default HarvestAddPage;
