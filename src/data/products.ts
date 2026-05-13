import { Product, ProductCategory } from "@/types/product";

// 品类定义
export const productCategories: { id: ProductCategory; name: string; icon: string }[] = [
  { id: "footwear", name: "鞋类", icon: "🥾" },
  { id: "base-layer", name: "基础层", icon: "👕" },
  { id: "mid-layer", name: "保暖层", icon: "🧥" },
  { id: "outer-layer", name: "防护层", icon: "🧥" },
  { id: "rain-gear", name: "雨具", icon: "🌧️" },
  { id: "sun-protection", name: "防晒", icon: "☀️" },
  { id: "backpack", name: "背包", icon: "🎒" },
  { id: "sleeping", name: "睡眠", icon: "🛏️" },
  { id: "cooking", name: "炊具", icon: "🍳" },
  { id: "navigation", name: "导航", icon: "🧭" },
  { id: "safety", name: "安全", icon: "🏥" },
];

// 鞋类产品
const footwearProducts: Product[] = [
  {
    id: "kailas-mt5",
    name: "MT5 重装徒步鞋",
    brand: "凯乐石",
    category: "footwear",
    image: "/images/products/kailas-mt5.jpg",
    specs: {
      waterproof: true,
      waterproofRating: "GORE-TEX",
      weight: 580,
      ankleSupport: "high",
      soleType: "Vibram Megagrip",
      terrain: ["碎石", "泥地", "雪地"],
      temperatureRange: { min: -15, max: 30 },
    },
    scenarios: ["重装露营", "多日穿越", "高海拔"],
    price: 899,
    maintenanceTips: [
      "出发前检查防水涂层，避免磨损导致漏水",
      "使用专用防水喷雾定期保养",
      "清洗后自然阴干，避免暴晒",
    ],
    alternatives: ["salomon-x-ultra", "torejie-hiking"],
  },
  {
    id: "salomon-x-ultra",
    name: "X Ultra 4 Mid GTX",
    brand: "Salomon",
    category: "footwear",
    image: "/images/products/salomon-x-ultra.jpg",
    specs: {
      waterproof: true,
      waterproofRating: "GORE-TEX",
      weight: 420,
      ankleSupport: "mid",
      soleType: "Contagrip MA",
      terrain: ["碎石", "泥地", "岩石"],
      temperatureRange: { min: -10, max: 35 },
    },
    scenarios: ["轻装速穿", "中等负重", "技术路段"],
    price: 1299,
    maintenanceTips: [
      "出发前检查防水涂层，避免磨损导致漏水",
      "使用专用防水喷雾定期保养",
    ],
    alternatives: ["kailas-mt5", "merrell-moab"],
  },
  {
    id: "merrell-moab",
    name: "Moab 3 Mid Waterproof",
    brand: "Merrell",
    category: "footwear",
    image: "/images/products/merrell-moab.jpg",
    specs: {
      waterproof: true,
      waterproofRating: "防水涂层",
      weight: 450,
      ankleSupport: "mid",
      soleType: "Vibram TC5+",
      terrain: ["碎石", "泥地"],
      temperatureRange: { min: -5, max: 35 },
    },
    scenarios: ["轻装速穿", "日常徒步", "简单路线"],
    price: 699,
    maintenanceTips: [
      "出发前检查防水涂层，避免磨损导致漏水",
    ],
    alternatives: ["salomon-x-ultra", "kailas-mt5"],
  },
  {
    id: "hoka-speedgoat",
    name: "Speedgoat 5",
    brand: "HOKA",
    category: "footwear",
    image: "/images/products/hoka-speedgoat.jpg",
    specs: {
      waterproof: false,
      weight: 280,
      ankleSupport: "low",
      soleType: "Vibram Megagrip",
      terrain: ["碎石", "泥地", "技术路段"],
      temperatureRange: { min: 5, max: 40 },
    },
    scenarios: ["越野跑", "轻装速穿", "速度优先"],
    price: 1199,
    maintenanceTips: [
      "越野跑鞋磨损较快，注意检查鞋底",
    ],
    alternatives: ["salomon-speedcross"],
  },
  {
    id: "salomon-speedcross",
    name: "Speedcross 6",
    brand: "Salomon",
    category: "footwear",
    image: "/images/products/salomon-speedcross.jpg",
    specs: {
      waterproof: false,
      weight: 310,
      ankleSupport: "low",
      soleType: "Contagrip TA",
      terrain: ["泥地", "碎石"],
      temperatureRange: { min: 5, max: 40 },
    },
    scenarios: ["越野跑", "轻装速穿", "泥地路段"],
    price: 999,
    maintenanceTips: [
      "越野跑鞋磨损较快，注意检查鞋底",
    ],
    alternatives: ["hoka-speedgoat"],
  },
];

// 基础层产品
const baseLayerProducts: Product[] = [
  {
    id: "icebreaker-260",
    name: "260 Tech LS Crewe",
    brand: "Icebreaker",
    category: "base-layer",
    image: "/images/products/icebreaker-260.jpg",
    specs: {
      material: "美利奴羊毛",
      warmthLevel: 3,
      breathability: "high",
      weight: 200,
      windproof: false,
      waterproof: false,
      temperatureRange: { min: -10, max: 20 },
    },
    scenarios: ["重装露营", "高海拔", "寒冷天气"],
    price: 799,
    maintenanceTips: [
      "美利奴羊毛可机洗，但建议使用羊毛专用洗涤剂",
      "避免使用烘干机，自然阴干",
    ],
  },
  {
    id: "patagonia-capilene",
    name: "Capilene Cool Daily",
    brand: "Patagonia",
    category: "base-layer",
    image: "/images/products/patagonia-capilene.jpg",
    specs: {
      material: "聚酯纤维",
      warmthLevel: 1,
      breathability: "high",
      weight: 130,
      windproof: false,
      waterproof: false,
      temperatureRange: { min: 10, max: 40 },
    },
    scenarios: ["越野跑", "轻装速穿", "温暖天气"],
    price: 399,
    maintenanceTips: [
      "可机洗，快干材质",
    ],
  },
];

// 保暖层产品
const midLayerProducts: Product[] = [
  {
    id: "patagonia-r1-air",
    name: "R1 Air Full-Zip Hoody",
    brand: "Patagonia",
    category: "mid-layer",
    image: "/images/products/patagonia-r1-air.jpg",
    specs: {
      material: "抓绒",
      warmthLevel: 3,
      breathability: "high",
      weight: 350,
      windproof: false,
      waterproof: false,
      temperatureRange: { min: -5, max: 15 },
    },
    scenarios: ["轻装速穿", "重装露营", "中等保暖"],
    price: 1299,
    maintenanceTips: [
      "可机洗，避免使用柔顺剂",
      "抓绒材质快干",
    ],
  },
  {
    id: "arcteryx-atom-lt",
    name: "Atom LT Hoody",
    brand: "Arc'teryx",
    category: "mid-layer",
    image: "/images/products/arcteryx-atom-lt.jpg",
    specs: {
      material: "合成棉",
      warmthLevel: 4,
      breathability: "medium",
      weight: 375,
      windproof: true,
      waterproof: false,
      temperatureRange: { min: -15, max: 10 },
    },
    scenarios: ["重装露营", "高海拔", "寒冷天气"],
    price: 2499,
    maintenanceTips: [
      "可机洗，低温烘干可恢复蓬松度",
      "避免压缩存放",
    ],
  },
];

// 防护层产品
const outerLayerProducts: Product[] = [
  {
    id: "arcteryx-beta-lt",
    name: "Beta LT Jacket",
    brand: "Arc'teryx",
    category: "outer-layer",
    image: "/images/products/arcteryx-beta-lt.jpg",
    specs: {
      material: "GORE-TEX",
      warmthLevel: 2,
      breathability: "high",
      weight: 350,
      windproof: true,
      waterproof: true,
      temperatureRange: { min: -20, max: 20 },
    },
    scenarios: ["重装露营", "高海拔", "恶劣天气"],
    price: 3999,
    maintenanceTips: [
      "定期使用防水喷雾保养",
      "可机洗，低温烘干可恢复DWR涂层",
    ],
  },
];

// 雨具产品
const rainGearProducts: Product[] = [
  {
    id: "sanfeng-rain-jacket",
    name: "超轻雨衣",
    brand: "三峰出",
    category: "rain-gear",
    image: "/images/products/sanfeng-rain.jpg",
    specs: {
      type: "rain-jacket",
      waterproof: true,
      waterproofRating: "防水涂层",
      weight: 150,
    },
    scenarios: ["轻装速穿", "越野跑", "应急雨具"],
    price: 199,
    maintenanceTips: [
      "使用后晾干，避免长期潮湿存放",
      "定期检查防水涂层",
    ],
  },
  {
    id: "marmot-precip",
    name: "Precip Eco Jacket",
    brand: "Marmot",
    category: "rain-gear",
    image: "/images/products/marmot-precip.jpg",
    specs: {
      type: "rain-jacket",
      waterproof: true,
      waterproofRating: "NanoPro",
      weight: 300,
    },
    scenarios: ["重装露营", "多日穿越", "全防水"],
    price: 799,
    maintenanceTips: [
      "定期使用防水喷雾保养",
      "可机洗，低温烘干可恢复DWR涂层",
    ],
  },
];

// 防晒产品
const sunProtectionProducts: Product[] = [
  {
    id: "sun-hat",
    name: "宽檐遮阳帽",
    brand: "户外通用",
    category: "sun-protection",
    image: "/images/products/sun-hat.jpg",
    specs: {
      type: "sun-hat",
      uvProtection: true,
      weight: 80,
    },
    scenarios: ["所有户外活动", "晴天"],
    price: 99,
    maintenanceTips: [
      "清洗后自然阴干",
    ],
  },
];

// 背包产品
const backpackProducts: Product[] = [
  {
    id: "osprey-atmos-65",
    name: "Atmos AG 65",
    brand: "Osprey",
    category: "backpack",
    image: "/images/products/osprey-atmos-65.jpg",
    specs: {
      volume: 65,
      weight: 2000,
      frameType: "internal",
      hipBelt: true,
      rainCover: true,
    },
    scenarios: ["重装露营", "多日穿越", "大负重"],
    price: 2499,
    maintenanceTips: [
      "使用后清空背包，保持干燥",
      "定期检查拉链和扣件",
    ],
  },
  {
    id: "osprey-talon-22",
    name: "Talon 22",
    brand: "Osprey",
    category: "backpack",
    image: "/images/products/osprey-talon-22.jpg",
    specs: {
      volume: 22,
      weight: 800,
      frameType: "internal",
      hipBelt: true,
      rainCover: false,
    },
    scenarios: ["轻装速穿", "越野跑", "一日徒步"],
    price: 999,
    maintenanceTips: [
      "使用后清空背包，保持干燥",
    ],
  },
];

// 睡眠装备产品
const sleepingProducts: Product[] = [
  {
    id: "western-mountaineering-ultraLite",
    name: "UltraLite",
    brand: "Western Mountaineering",
    category: "sleeping",
    image: "/images/products/wm-ultralite.jpg",
    specs: {
      temperatureRating: -7,
      weight: 780,
      fillType: "down",
      packedSize: "15x30cm",
    },
    scenarios: ["重装露营", "三季露营", "轻量化"],
    price: 3299,
    maintenanceTips: [
      "使用后晾晒，恢复蓬松度",
      "长期存放使用大号收纳袋，避免压缩",
      "根据夜间温度选择温标，建议预留5°C余量",
    ],
  },
];

// 导航装备产品
const navigationProducts: Product[] = [
  {
    id: "garmin-inreach-mini",
    name: "inReach Mini 2",
    brand: "Garmin",
    category: "navigation",
    image: "/images/products/garmin-inreach-mini.jpg",
    specs: {
      type: "satellite-communicator",
      weight: 100,
      batteryLife: "14天",
    },
    scenarios: ["高海拔", "偏远地区", "紧急通讯"],
    price: 2999,
    maintenanceTips: [
      "出发前充满电",
      "定期更新固件",
    ],
  },
];

// 安全装备产品
const safetyProducts: Product[] = [
  {
    id: "first-aid-kit",
    name: "户外急救包",
    brand: "户外通用",
    category: "safety",
    image: "/images/products/first-aid-kit.jpg",
    specs: {
      type: "first-aid",
      weight: 300,
    },
    scenarios: ["所有户外活动"],
    price: 199,
    maintenanceTips: [
      "定期检查药品有效期",
      "补充使用过的物品",
    ],
  },
];

// 所有产品
export const products: Product[] = [
  ...footwearProducts,
  ...baseLayerProducts,
  ...midLayerProducts,
  ...outerLayerProducts,
  ...rainGearProducts,
  ...sunProtectionProducts,
  ...backpackProducts,
  ...sleepingProducts,
  ...navigationProducts,
  ...safetyProducts,
];

// 按品类获取产品
export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

// 按ID获取产品
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

// 获取产品的替代品
export function getAlternativeProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product?.alternatives) return [];
  return product.alternatives
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}
