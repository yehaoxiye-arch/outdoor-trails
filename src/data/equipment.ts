export interface Equipment {
  id: string;
  name: string;
  category: "基础" | "进阶" | "专业";
  description: string;
  essential: boolean;
}

export const equipmentCategories = [
  { id: "footwear", name: "鞋靴", icon: "👢" },
  { id: "clothing", name: "服装", icon: "👕" },
  { id: "backpack", name: "背包", icon: "🎒" },
  { id: "navigation", name: "导航", icon: "🧭" },
  { id: "safety", name: "安全", icon: "🏥" },
  { id: "camping", name: "露营", icon: "⛺" },
];

export const equipment: Equipment[] = [
  { id: "hiking-boots", name: "徒步鞋", category: "基础", description: "防水、支撑性好的中高帮徒步鞋", essential: true },
  { id: "trekking-poles", name: "登山杖", category: "基础", description: "减轻膝盖压力，保持平衡", essential: true },
  { id: "backpack", name: "登山背包", category: "基础", description: "30-50L，带腰带和胸带", essential: true },
  { id: "rain-jacket", name: "冲锋衣", category: "基础", description: "防风防水透气", essential: true },
  { id: "headlamp", name: "头灯", category: "基础", description: "解放双手，必备照明工具", essential: true },
  { id: "water-bottle", name: "水壶/水袋", category: "基础", description: "至少2L容量", essential: true },
  { id: "first-aid", name: "急救包", category: "基础", description: "创可贴、绷带、消毒用品", essential: true },
  { id: "sunscreen", name: "防晒用品", category: "基础", description: "防晒霜、太阳镜、遮阳帽", essential: true },
  { id: "sleeping-bag", name: "睡袋", category: "进阶", description: "根据季节选择温标", essential: false },
  { id: "tent", name: "帐篷", category: "进阶", description: "轻量化、防风防雨", essential: false },
  { id: "stove", name: "炉具", category: "进阶", description: "用于加热食物和水", essential: false },
  { id: "gps", name: "GPS设备", category: "专业", description: "专业导航设备", essential: false },
  { id: "satellite-phone", name: "卫星电话", category: "专业", description: "紧急通讯设备", essential: false },
];

export function getEquipmentByDifficulty(difficulty: string): Equipment[] {
  switch (difficulty) {
    case "简单":
      return equipment.filter((e) => e.category === "基础" && e.essential);
    case "中等":
      return equipment.filter((e) => e.category === "基础" || e.category === "进阶");
    case "困难":
      return equipment;
    default:
      return equipment.filter((e) => e.essential);
  }
}
