import { HarvestRecord, EmergencyContact } from '@/types';

// 收获记录Mock数据
export const harvestRecords: HarvestRecord[] = [
  {
    id: 'h1',
    date: '2026-06-14',
    beachId: 'beach1',
    beachName: '青岛栈桥海滩',
    species: [
      { name: '花蛤', count: 45, weight: 2.3 },
      { name: '小螃蟹', count: 12, weight: 0.6 },
      { name: '海螺', count: 8, weight: 0.4 }
    ],
    weather: '晴',
    duration: 3.5,
    notes: '今天潮水退得很大，在西侧滩涂区收获颇丰，花蛤特别多。遇到了当地的赶海达人，教了我找蛏子的技巧，下次试试。',
    imageIds: [1015, 1018],
    createdAt: '2026-06-14 15:30:00'
  },
  {
    id: 'h2',
    date: '2026-06-10',
    beachId: 'beach2',
    beachName: '烟台金沙滩',
    species: [
      { name: '文蛤', count: 60, weight: 3.2 },
      { name: '竹蛏', count: 25, weight: 1.5 },
      { name: '海肠', count: 8, weight: 0.8 }
    ],
    weather: '多云',
    duration: 4,
    notes: '金沙滩真的名不虚传，沙质松软，用盐诱捕竹蛏效果很好。周末人比较多，建议早点去占位。',
    imageIds: [1018, 1036],
    createdAt: '2026-06-10 16:00:00'
  },
  {
    id: 'h3',
    date: '2026-06-01',
    beachId: 'beach3',
    beachName: '威海国际海水浴场',
    species: [
      { name: '鲍鱼', count: 6, weight: 0.9 },
      { name: '海胆', count: 4, weight: 0.6 },
      { name: '海参', count: 3, weight: 0.5 },
      { name: '牡蛎', count: 15, weight: 2.1 }
    ],
    weather: '晴',
    duration: 5,
    notes: '首次尝试礁石区赶海，收获了鲍鱼和海参，特别有成就感！不过一定要注意安全，礁石湿滑很容易摔倒。',
    imageIds: [1036, 1039],
    createdAt: '2026-06-01 17:30:00'
  },
  {
    id: 'h4',
    date: '2026-05-25',
    beachId: 'beach4',
    beachName: '日照万平口海滩',
    species: [
      { name: '花蛤', count: 35, weight: 1.8 },
      { name: '白蛤', count: 28, weight: 1.4 },
      { name: '小螃蟹', count: 20, weight: 0.9 }
    ],
    weather: '晴转多云',
    duration: 3,
    notes: '带孩子来的，家庭友好型海滩，设施齐全。孩子玩得很开心，虽然收获不算多，但体验很好。',
    imageIds: [1039, 1044],
    createdAt: '2026-05-25 15:00:00'
  },
  {
    id: 'h5',
    date: '2026-05-15',
    beachId: 'beach1',
    beachName: '青岛栈桥海滩',
    species: [
      { name: '蛏子', count: 30, weight: 1.6 },
      { name: '海星', count: 2, weight: 0.3 },
      { name: '海葵', count: 5, weight: 0.2 }
    ],
    weather: '阴',
    duration: 2.5,
    notes: '阴天赶海很舒服，不会晒。找到了几只海星，孩子特别喜欢，最后都放回海里了。',
    imageIds: [1015, 1044],
    createdAt: '2026-05-15 14:00:00'
  }
];

// 紧急联系人Mock数据
export const emergencyContacts: EmergencyContact[] = [
  {
    id: 'c1',
    name: '张大海',
    phone: '13800138001',
    relation: '父亲'
  },
  {
    id: 'c2',
    name: '李小明',
    phone: '13900139002',
    relation: '朋友'
  },
  {
    id: 'c3',
    name: '王队长',
    phone: '13700137003',
    relation: '救援队'
  }
];

// 常见海鲜品种
export const commonSpecies = [
  '花蛤', '白蛤', '文蛤', '蛏子', '竹蛏',
  '小螃蟹', '海螺', '海星', '海葵', '牡蛎',
  '鲍鱼', '海参', '海胆', '海肠', '沙蚕',
  '藤壶', '佛手螺', '石鳖', '紫菜', '小鱼'
];

// 赶海日志统计
export const harvestStats = {
  totalTrips: 12,
  totalSpecies: 18,
  totalWeight: 28.5,
  favoriteBeach: '青岛栈桥海滩',
  bestCatch: '鲍鱼 6只 / 0.9kg'
};
