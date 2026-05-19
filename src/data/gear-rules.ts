import { ProductCategory, Priority } from "@/types/product";

interface GearRule {
  category: ProductCategory;
  categoryName: string;
  categoryIcon: string;
  conditions: {
    field: string;
    operator: "gt" | "lt" | "eq" | "contains";
    value: any;
  }[];
  recommended: boolean;
  priority: Priority;
  reasonTemplate: string;
  productFilter?: (product: any) => boolean;
}

export const gearRules: GearRule[] = [
  // ============ 鞋类 (footwear) ============
  // 多日行程需要防水支撑鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "{duration}行程需要支撑防水的徒步鞋",
  },
  // 困难/极难线路需要高帮护踝
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "difficulty", operator: "eq", value: "困难" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "困难线路需要高帮护踝徒步鞋",
  },
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "difficulty", operator: "eq", value: "极难" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "极难线路需要高帮护踝徒步鞋",
  },
  // 高降水需要防水鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "precipitation", operator: "gt", value: 60 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "降水概率{precipitation}%，需要防水鞋",
  },
  // 高海拔需要专业鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "altitude", operator: "gt", value: 3000 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "海拔{altitude}m地形复杂，需要专业徒步鞋",
  },
  // 长距离需要缓震鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "distance", operator: "gt", value: 24 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "{distance}km长距离，需要缓震好的徒步鞋",
  },
  // 重装露营必须徒步鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "重装露营需要支撑性好的徒步鞋",
  },
  // 中等难度推荐徒步鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "difficulty", operator: "eq", value: "中等" }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "中等难度线路建议穿着徒步鞋",
  },
  // 单日+天气良好+短距离 → 轻量鞋
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [
      { field: "duration", operator: "lt", value: 2 },
      { field: "precipitation", operator: "lt", value: 30 },
      { field: "distance", operator: "lt", value: 16 },
      { field: "difficulty", operator: "eq", value: "简单" },
    ],
    recommended: true,
    priority: "optional",
    reasonTemplate: "短距离简单天气好，越野跑鞋或轻量徒步鞋即可",
  },

  // ============ 基础层 (base-layer) ============
  // 所有户外活动都需要速干基础层（棉质是失温元凶）
  {
    category: "base-layer",
    categoryName: "基础层",
    categoryIcon: "👕",
    conditions: [],
    recommended: true,
    priority: "required",
    reasonTemplate: "速干排汗基础层是户外必备，棉质衣物是失温元凶",
  },
  // 高温天气需要超薄透气基础层
  {
    category: "base-layer",
    categoryName: "基础层",
    categoryIcon: "👕",
    conditions: [{ field: "tempHigh", operator: "gt", value: 28 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "高温{tempHigh}°C，需要超薄透气速干基础层",
  },
  // 低温天气需要保暖基础层
  {
    category: "base-layer",
    categoryName: "基础层",
    categoryIcon: "👕",
    conditions: [{ field: "tempLow", operator: "lt", value: 10 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "低温{tempLow}°C，需要美利奴羊毛保暖基础层",
  },
  // 多日行程需要抗臭基础层
  {
    category: "base-layer",
    categoryName: "基础层",
    categoryIcon: "👕",
    conditions: [{ field: "duration", operator: "gt", value: 2 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "多日行程建议美利奴羊毛基础层，天然抗臭",
  },

  // ============ 保暖层 (mid-layer) ============
  // 低温必须保暖层（失温风险）
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "tempLow", operator: "lt", value: 5 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "低温{tempLow}°C，必须保暖层，失温风险高",
  },
  // 高海拔必须保暖层
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "altitude", operator: "gt", value: 3000 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "海拔{altitude}m气温骤降，必须保暖层",
  },
  // 低温+大风 → 失温三要素
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [
      { field: "tempLow", operator: "lt", value: 10 },
      { field: "windSpeed", operator: "gt", value: 25 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "低温{tempLow}°C+大风{windSpeed}km/h，失温风险高",
  },
  // 雨天优先化纤保暖层（羽绒受潮失效）
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [
      { field: "tempLow", operator: "lt", value: 15 },
      { field: "precipitation", operator: "gt", value: 50 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "雨天低温{tempLow}°C，建议化纤保暖层（羽绒受潮失效）",
  },
  // 夜间温差大建议保暖层
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "tempLow", operator: "lt", value: 15 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "夜间温度约{tempLow}°C，建议保暖层",
  },
  // 高海拔多日温差大（华东高山1500m+即需保暖层）
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [
      { field: "altitude", operator: "gt", value: 1500 },
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "海拔{altitude}m多日行程温差大，建议保暖层",
  },
  // 大风天气需要保暖层
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "windSpeed", operator: "gt", value: 30 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "大风{windSpeed}km/h，需要保暖层防风",
  },

  // ============ 防护层 (outer-layer) ============
  // 降水必须冲锋衣（降低阈值到30%）
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "precipitation", operator: "gt", value: 30 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "降水概率{precipitation}%，必须防水透气冲锋衣",
  },
  // 大风必须防风层（降低阈值到25km/h）
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "windSpeed", operator: "gt", value: 25 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "风速{windSpeed}km/h，需要防风防水层",
  },
  // 极寒必须专业防寒
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "tempLow", operator: "lt", value: -5 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "极寒{tempLow}°C，需要专业防寒外层",
  },
  // 高海拔天气多变
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "altitude", operator: "gt", value: 3500 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "海拔{altitude}m天气瞬息万变，必须防护层",
  },
  // 低温大风组合
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [
      { field: "windSpeed", operator: "gt", value: 20 },
      { field: "tempLow", operator: "lt", value: 10 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "低温{tempLow}°C+大风{windSpeed}km/h，需要防风层",
  },
  // 有降水风险建议冲锋衣
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "precipitation", operator: "gt", value: 20 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "降水概率{precipitation}%，建议携带冲锋衣",
  },
  // 高海拔多日天气多变（华东高山1500m+即需防护层）
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [
      { field: "altitude", operator: "gt", value: 1500 },
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "海拔{altitude}m多日行程天气多变，建议防护层",
  },
  // 多日行程天气变化大（2天及以上）
  {
    category: "outer-layer",
    categoryName: "防护层",
    categoryIcon: "🧥",
    conditions: [{ field: "duration", operator: "gt", value: 1 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "多日行程天气变化大，建议携带防护层",
  },

  // ============ 雨具 (rain-gear) ============
  // 降水概率 > 45% 必备
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [{ field: "precipitation", operator: "gt", value: 45 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "降水概率{precipitation}%，必须携带雨具",
  },
  // 降雪需要防水外层
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [{ field: "precipitationType", operator: "eq", value: "snow" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "有降雪，需要防水外层",
  },
  // 降水概率 5%-45% 推荐
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [{ field: "precipitation", operator: "gt", value: 5 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "降水概率{precipitation}%，建议携带雨具",
  },
  // 多日行程天气变化大
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "多日行程天气变化大，建议携带雨具",
  },

  // ============ 防晒 (sun-protection) ============
  // 气温>20°C且晴天推荐防晒
  {
    category: "sun-protection",
    categoryName: "防晒",
    categoryIcon: "☀️",
    conditions: [
      { field: "tempHigh", operator: "gt", value: 20 },
      { field: "weatherCondition", operator: "contains", value: "晴" },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "气温{tempHigh}°C且晴天，建议防晒",
  },

  // ============ 背包 (backpack) ============
  // 重装露营需要大容量
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "重装露营需要大容量背包(50-70L)",
  },
  // 多日轻装需要中容量
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "多日轻装需要中容量背包(30-40L)",
  },
  // 单日轻装需要小容量
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "lt", value: 2 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "单日轻装需要小容量背包(15-25L)",
  },
  // 越野跑需要水袋背心
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "越野跑" }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "越野跑需要水袋背心(5-15L)",
  },

  // ============ 帐篷 (tent) ============
  // 重装露营必须帐篷
  {
    category: "tent",
    categoryName: "帐篷",
    categoryIcon: "⛺",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "露营必须携带帐篷",
  },
  // 多日困难轻装穿越可能需要
  {
    category: "tent",
    categoryName: "帐篷",
    categoryIcon: "⛺",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "困难" },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "困难线路多日穿越可能无补给，建议携带帐篷",
  },
  // 多日中等轻装穿越可选
  {
    category: "tent",
    categoryName: "帐篷",
    categoryIcon: "⛺",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "中等" },
    ],
    recommended: true,
    priority: "optional",
    reasonTemplate: "多日轻装穿越可考虑超轻帐篷",
  },

  // ============ 睡眠系统 (sleeping) ============
  // 重装露营必须
  {
    category: "sleeping",
    categoryName: "睡眠",
    categoryIcon: "🛏️",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "露营必须睡袋和睡垫",
  },
  // 多日困难轻装
  {
    category: "sleeping",
    categoryName: "睡眠",
    categoryIcon: "🛏️",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "困难" },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "困难线路多日穿越可能无补给，建议睡眠系统",
  },
  // 多日中等轻装可选
  {
    category: "sleeping",
    categoryName: "睡眠",
    categoryIcon: "🛏️",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "中等" },
    ],
    recommended: true,
    priority: "optional",
    reasonTemplate: "多日轻装穿越可考虑轻量睡眠系统",
  },

  // ============ 炊具 (cooking) ============
  // 重装露营必须炊具
  {
    category: "cooking",
    categoryName: "炊具",
    categoryIcon: "🍳",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "露营需要炊具做饭",
  },
  // 多日困难轻装
  {
    category: "cooking",
    categoryName: "炊具",
    categoryIcon: "🍳",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "困难" },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "困难线路可能无法获得补给，建议携带炊具",
  },
  // 多日中等轻装可选
  {
    category: "cooking",
    categoryName: "炊具",
    categoryIcon: "🍳",
    conditions: [
      { field: "style", operator: "eq", value: "轻装速穿" },
      { field: "duration", operator: "gt", value: 1 },
      { field: "difficulty", operator: "eq", value: "中等" },
    ],
    recommended: true,
    priority: "optional",
    reasonTemplate: "多日轻装可选带简易炉头",
  },

  // ============ 登山杖 (trekking-poles) ============
  // 两日以上必备
  {
    category: "trekking-poles",
    categoryName: "登山杖",
    categoryIcon: "🏔️",
    conditions: [
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "{duration}行程，登山杖必备",
  },
  // 所有路线推荐
  {
    category: "trekking-poles",
    categoryName: "登山杖",
    categoryIcon: "🏔️",
    conditions: [],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "登山杖可减轻膝盖负担，节省体力",
  },

  // ============ 导航 (navigation) ============
  // 所有路线必备
  {
    category: "navigation",
    categoryName: "导航",
    categoryIcon: "🧭",
    conditions: [],
    recommended: true,
    priority: "required",
    reasonTemplate: "导航设备是户外安全的基本保障",
  },

  // ============ 安全装备 (safety) ============
  // 高海拔 critical
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [{ field: "altitude", operator: "gt", value: 3500 }],
    recommended: true,
    priority: "critical",
    reasonTemplate: "海拔{altitude}m，急救包是生命保障",
  },
  // 多日必须
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [
      { field: "duration", operator: "gt", value: 1 },
    ],
    recommended: true,
    priority: "required",
    reasonTemplate: "多日行程必须携带急救包",
  },
  // 困难线路必须
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [{ field: "difficulty", operator: "eq", value: "困难" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "困难线路必须携带急救包",
  },
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [{ field: "difficulty", operator: "eq", value: "极难" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "极难线路必须携带急救包",
  },
  // 长距离建议
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [{ field: "distance", operator: "gt", value: 20 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "{distance}km长距离建议携带急救包",
  },
  // 所有路线建议急救包（兜底）
  {
    category: "safety",
    categoryName: "安全",
    categoryIcon: "🏥",
    conditions: [],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "建议携带基本急救包以备不时之需",
  },

  // ============ 雪地装备 (snow-gear) ============
  // 有降雪必须
  {
    category: "snow-gear",
    categoryName: "雪地装备",
    categoryIcon: "❄️",
    conditions: [{ field: "hasSnow", operator: "eq", value: true }],
    recommended: true,
    priority: "required",
    reasonTemplate: "有降雪预报，需要冰爪和雪套",
  },
  // 高海拔低温可能有暗冰
  {
    category: "snow-gear",
    categoryName: "雪地装备",
    categoryIcon: "❄️",
    conditions: [
      { field: "tempLow", operator: "lt", value: 0 },
      { field: "altitude", operator: "gt", value: 3000 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "海拔{altitude}m低温{tempLow}°C，可能有暗冰",
  },

  // ============ 照明系统 (lighting) ============
  // 10km以上必备
  {
    category: "lighting",
    categoryName: "照明",
    categoryIcon: "🔦",
    conditions: [{ field: "distance", operator: "gt", value: 10 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "{distance}km线路，头灯是安全保障",
  },
  // 所有路线推荐
  {
    category: "lighting",
    categoryName: "照明",
    categoryIcon: "🔦",
    conditions: [],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "建议携带头灯以备不时之需",
  },

  // ============ 应急系统 (emergency) ============
  // 所有路线必备
  {
    category: "emergency",
    categoryName: "应急",
    categoryIcon: "🆘",
    conditions: [],
    recommended: true,
    priority: "required",
    reasonTemplate: "应急装备是户外安全的生命线",
  },

  // ============ 水系统 (hydration) ============
  // 高温必须增加携水量
  {
    category: "hydration",
    categoryName: "水系统",
    categoryIcon: "💧",
    conditions: [{ field: "tempHigh", operator: "gt", value: 30 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "高温{tempHigh}°C必须增加携水量(2L+)",
  },
  // 高海拔脱水风险高
  {
    category: "hydration",
    categoryName: "水系统",
    categoryIcon: "💧",
    conditions: [{ field: "altitude", operator: "gt", value: 3500 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "海拔{altitude}m脱水风险高，需要充足饮水",
  },
  // 长距离需要充足饮水
  {
    category: "hydration",
    categoryName: "水系统",
    categoryIcon: "💧",
    conditions: [{ field: "distance", operator: "gt", value: 20 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "{distance}km长距离需要充足饮水",
  },
  // 越野跑推荐软水壶
  {
    category: "hydration",
    categoryName: "水系统",
    categoryIcon: "💧",
    conditions: [{ field: "style", operator: "eq", value: "越野跑" }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "越野跑推荐软水壶或水袋背心",
  },
];
