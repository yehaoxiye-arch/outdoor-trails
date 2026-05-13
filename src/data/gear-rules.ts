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
  // 鞋类规则
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "duration", operator: "contains", value: "天" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "{duration}行程+{difficulty}难度，需要防水徒步鞋",
  },
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [
      { field: "duration", operator: "eq", value: "1天" },
      { field: "distance", operator: "lt", value: 25 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "单日{distance}km线路，轻量鞋即可",
  },
  // 保暖层规则
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "altitude", operator: "gt", value: 3500 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "海拔{altitude}m，需要高海拔保暖装备",
  },
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "tempLow", operator: "lt", value: 10 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "夜间温度约{tempLow}°C，需要保暖层",
  },
  // 雨具规则
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [{ field: "precipitation", operator: "gt", value: 60 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "降水概率{precipitation}%，必须携带雨衣",
  },
  // 防晒规则
  {
    category: "sun-protection",
    categoryName: "防晒",
    categoryIcon: "☀️",
    conditions: [{ field: "tempHigh", operator: "gt", value: 30 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "高温{tempHigh}°C，需要防晒装备",
  },
  // 背包规则
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "重装露营需要大容量背包",
  },
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "轻装速穿" }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "轻装速穿适合中小容量背包",
  },
  // 睡眠装备规则
  {
    category: "sleeping",
    categoryName: "睡眠",
    categoryIcon: "🛏️",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "露营需要帐篷和睡袋",
  },
];
