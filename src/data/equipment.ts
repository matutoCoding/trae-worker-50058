import { Equipment } from '@/types';

// 装备清单数据
export const defaultEquipmentList: Equipment[] = [
  // 服装类
  {
    id: 'eq1',
    name: '防滑涉水鞋',
    category: 'clothing',
    essential: true,
    description: '必备！防止礁石和贝壳划伤脚底'
  },
  {
    id: 'eq2',
    name: '防晒帽',
    category: 'clothing',
    essential: true,
    description: '海边紫外线强，防晒必备'
  },
  {
    id: 'eq3',
    name: '速干衣裤',
    category: 'clothing',
    essential: true,
    description: '方便活动，湿后快干'
  },
  {
    id: 'eq4',
    name: '手套',
    category: 'clothing',
    essential: true,
    description: '防止礁石和生物划伤手'
  },
  {
    id: 'eq5',
    name: '雨衣',
    category: 'clothing',
    essential: false,
    description: '根据天气情况选择携带'
  },
  {
    id: 'eq6',
    name: '备用衣物',
    category: 'clothing',
    essential: false,
    description: '返程时更换干净衣物'
  },

  // 工具类
  {
    id: 'eq7',
    name: '小铲子/耙子',
    category: 'tool',
    essential: true,
    description: '挖掘沙中贝类的必备工具'
  },
  {
    id: 'eq8',
    name: '小桶',
    category: 'tool',
    essential: true,
    description: '装收获的海洋生物'
  },
  {
    id: 'eq9',
    name: '盐瓶',
    category: 'tool',
    essential: true,
    description: '用盐诱捕竹蛏和沙蚕'
  },
  {
    id: 'eq10',
    name: '镊子/夹子',
    category: 'tool',
    essential: false,
    description: '抓取礁石缝中的生物'
  },
  {
    id: 'eq11',
    name: '小刀',
    category: 'tool',
    essential: false,
    description: '撬取牡蛎、鲍鱼等'
  },
  {
    id: 'eq12',
    name: '放大镜',
    category: 'tool',
    essential: false,
    description: '观察小型海洋生物'
  },

  // 安全类
  {
    id: 'eq13',
    name: '防水手机袋',
    category: 'safety',
    essential: true,
    description: '保护手机不进水'
  },
  {
    id: 'eq14',
    name: '救生绳/浮力手环',
    category: 'safety',
    essential: true,
    description: '紧急情况必备安全装备'
  },
  {
    id: 'eq15',
    name: '急救包',
    category: 'safety',
    essential: true,
    description: '处理擦伤、划伤等小伤口'
  },
  {
    id: 'eq16',
    name: '指南针',
    category: 'safety',
    essential: false,
    description: '偏远海滩辨别方向'
  },
  {
    id: 'eq17',
    name: '哨子',
    category: 'safety',
    essential: false,
    description: '紧急情况下呼救用'
  },
  {
    id: 'eq18',
    name: '头灯/手电筒',
    category: 'safety',
    essential: false,
    description: '早晚赶海照明用'
  },

  // 食物/补给类
  {
    id: 'eq19',
    name: '饮用水',
    category: 'food',
    essential: true,
    description: '及时补充水分，防止中暑'
  },
  {
    id: 'eq20',
    name: '零食/干粮',
    category: 'food',
    essential: true,
    description: '补充体力'
  },
  {
    id: 'eq21',
    name: '防晒霜',
    category: 'food',
    essential: true,
    description: '防止晒伤'
  },
  {
    id: 'eq22',
    name: '创可贴',
    category: 'food',
    essential: false,
    description: '处理小伤口'
  }
];

// 装备分类
export const equipmentCategories = {
  clothing: { name: '服装装备', icon: '👕' },
  tool: { name: '赶海工具', icon: '🔧' },
  safety: { name: '安全装备', icon: '🛡️' },
  food: { name: '补给物资', icon: '🍱' }
};
