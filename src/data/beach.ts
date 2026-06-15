import { Beach, CatchSpot, SafetyRoute } from '@/types';

// 海滩数据
export const beaches: Beach[] = [
  {
    id: 'beach1',
    name: '青岛栈桥海滩',
    location: '山东省青岛市市南区',
    description: '青岛标志性海滩，以栈桥闻名，潮间带生物丰富，适合初级赶海爱好者。',
    lat: 36.0671,
    lng: 120.3826,
    difficulty: 'easy',
    safetyTips: [
      '注意涨潮时间，切勿在礁石上停留过久',
      '栈桥附近人流较多，注意防滑',
      '建议穿防滑涉水鞋'
    ],
    bestSeasons: ['春季', '夏季', '秋季'],
    commonSpecies: ['花蛤', '蛏子', '螃蟹', '海螺', '海星'],
    hasLifeguard: true,
    hasToilet: true,
    hasParking: true,
    imageId: 1015
  },
  {
    id: 'beach2',
    name: '烟台金沙滩',
    location: '山东省烟台市福山区',
    description: '沙质细腻金黄，海岸线绵长，低潮时露出大面积滩涂，赶海体验极佳。',
    lat: 37.5742,
    lng: 121.2672,
    difficulty: 'easy',
    safetyTips: [
      '沙滩广阔，建议标记返回路线',
      '远海区域注意暗流',
      '夏季紫外线强，做好防晒'
    ],
    bestSeasons: ['春季', '夏季', '秋季'],
    commonSpecies: ['文蛤', '沙虫', '竹蛏', '海肠', '小螃蟹'],
    hasLifeguard: true,
    hasToilet: true,
    hasParking: true,
    imageId: 1018
  },
  {
    id: 'beach3',
    name: '威海国际海水浴场',
    location: '山东省威海市环翠区',
    description: '水质清澈，沙滩与礁石交错，海洋生物种类繁多，适合中高级赶海者。',
    lat: 37.5243,
    lng: 122.0753,
    difficulty: 'medium',
    safetyTips: [
      '礁石区域湿滑，小心摔倒',
      '部分区域有回头潮，需格外注意',
      '建议结伴而行'
    ],
    bestSeasons: ['春季', '夏季', '秋季'],
    commonSpecies: ['鲍鱼', '海参', '海胆', '海螺', '牡蛎'],
    hasLifeguard: true,
    hasToilet: true,
    hasParking: true,
    imageId: 1036
  },
  {
    id: 'beach4',
    name: '日照万平口海滩',
    location: '山东省日照市东港区',
    description: '滩平沙细，水清浪稳，是家庭赶海的理想之地，配套设施完善。',
    lat: 35.4136,
    lng: 119.5985,
    difficulty: 'easy',
    safetyTips: [
      '儿童需由成人全程陪同',
      '注意海蜇出没',
      '退潮后滩涂有积水坑，注意避让'
    ],
    bestSeasons: ['春季', '夏季', '秋季'],
    commonSpecies: ['花蛤', '白蛤', '螃蟹', '海葵', '小鱼'],
    hasLifeguard: true,
    hasToilet: true,
    hasParking: true,
    imageId: 1039
  },
  {
    id: 'beach5',
    name: '连云港连岛海滩',
    location: '江苏省连云港市连云区',
    description: '海岛型海滩，礁石众多，潮池资源丰富，适合深度赶海探索。',
    lat: 34.7539,
    lng: 119.4778,
    difficulty: 'hard',
    safetyTips: [
      '路况复杂，建议穿专业防滑鞋',
      '涨潮速度快，提前规划撤退路线',
      '部分区域有孤立礁石，围困风险高'
    ],
    bestSeasons: ['春季', '秋季'],
    commonSpecies: ['佛手螺', '藤壶', '石鳖', '紫菜', '鲍鱼'],
    hasLifeguard: false,
    hasToilet: true,
    hasParking: true,
    imageId: 1044
  }
];

// 赶海点数据
export const catchSpots: CatchSpot[] = [
  {
    id: 'spot1',
    beachId: 'beach1',
    name: '栈桥东侧礁石区',
    type: 'rock',
    lat: 36.0685,
    lng: 120.3845,
    description: '礁石缝隙中藏有大量小螃蟹和海螺，是初学者的练习地。',
    species: ['小螃蟹', '海螺', '海葵']
  },
  {
    id: 'spot2',
    beachId: 'beach1',
    name: '西侧滩涂区',
    type: 'sand',
    lat: 36.0660,
    lng: 120.3800,
    description: '沙质滩涂，适合挖掘花蛤和蛏子，面积广阔。',
    species: ['花蛤', '蛏子', '沙蚕']
  },
  {
    id: 'spot3',
    beachId: 'beach2',
    name: '金沙滩中部',
    type: 'sand',
    lat: 37.5740,
    lng: 121.2680,
    description: '沙滩中心区域，低潮时可挖到文蛤和竹蛏。',
    species: ['文蛤', '竹蛏', '海肠']
  },
  {
    id: 'spot4',
    beachId: 'beach3',
    name: '礁石群A区',
    type: 'reef',
    lat: 37.5250,
    lng: 122.0770,
    description: '大型礁石区，可找到鲍鱼和海参，需注意安全。',
    species: ['鲍鱼', '海参', '海胆']
  },
  {
    id: 'spot5',
    beachId: 'beach5',
    name: '连岛东端岩礁',
    type: 'rock',
    lat: 34.7560,
    lng: 119.4800,
    description: '佛手螺和藤壶的聚集地，海况较复杂。',
    species: ['佛手螺', '藤壶', '石鳖']
  }
];

// 安全路线数据
export const safetyRoutes: SafetyRoute[] = [
  {
    id: 'route1',
    beachId: 'beach1',
    name: '栈桥主通道',
    waypoints: [
      { lat: 36.0650, lng: 120.3790 },
      { lat: 36.0660, lng: 120.3810 },
      { lat: 36.0671, lng: 120.3826 }
    ],
    estimatedTime: 10,
    description: '沿主沙滩返回，路线清晰，适合所有人。'
  },
  {
    id: 'route2',
    beachId: 'beach1',
    name: '东侧紧急通道',
    waypoints: [
      { lat: 36.0685, lng: 120.3845 },
      { lat: 36.0690, lng: 120.3860 },
      { lat: 36.0695, lng: 120.3880 }
    ],
    estimatedTime: 8,
    description: '礁石区撤离快速通道，涨潮时优先选择此路线。'
  },
  {
    id: 'route3',
    beachId: 'beach5',
    name: '连岛安全撤离线',
    waypoints: [
      { lat: 34.7560, lng: 119.4800 },
      { lat: 34.7550, lng: 119.4790 },
      { lat: 34.7539, lng: 119.4778 }
    ],
    estimatedTime: 15,
    description: '海岛唯一安全撤退路线，务必提前熟悉。'
  }
];

// 围困风险区域
export const riskAreas = [
  {
    beachId: 'beach1',
    name: '栈桥东侧孤立礁石',
    riskLevel: 'high',
    description: '涨潮后会被海水包围，形成孤岛。',
    warning: '仅在低潮后1小时内可进入，务必提前撤离！'
  },
  {
    beachId: 'beach5',
    name: '东端岩礁群',
    riskLevel: 'high',
    description: '潮水上涨迅速，通道会很快被淹没。',
    warning: '回头潮多发区！请结伴同行，随时观察水位。'
  },
  {
    beachId: 'beach3',
    name: '西北部深水区',
    riskLevel: 'medium',
    description: '海底有深坑，水位变化快。',
    warning: '避免单独前往，保持在浅水区活动。'
  }
];
