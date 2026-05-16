import { DayForecast } from "./weather";

export type ProductCategory =
  | "footwear"
  | "base-layer"
  | "mid-layer"
  | "outer-layer"
  | "rain-gear"
  | "sun-protection"
  | "backpack"
  | "tent"
  | "sleeping"
  | "trekking-poles"
  | "cooking"
  | "navigation"
  | "safety"
  | "snow-gear"
  | "lighting"
  | "emergency"
  | "hydration";

export type Priority = "critical" | "required" | "recommended" | "optional";

export interface FootwearSpecs {
  waterproof: boolean;
  waterproofRating?: string; // "GORE-TEX" / "防水涂层"
  weight: number; // 单只重量(g)
  ankleSupport: "low" | "mid" | "high";
  soleType: string; // "Vibram Megagrip"
  terrain: string[]; // 适用地形标签
  temperatureRange: { min: number; max: number };
}

export interface ClothingSpecs {
  material: string; // "美利奴羊毛" / "抓绒"
  warmthLevel: 1 | 2 | 3 | 4 | 5;
  breathability: "low" | "medium" | "high";
  weight: number; // 重量(g)
  windproof: boolean;
  waterproof: boolean;
  temperatureRange: { min: number; max: number };
}

export interface ProtectionSpecs {
  type: "rain-jacket" | "rain-pants" | "sun-hat" | "sunscreen" | "gaiters";
  waterproof?: boolean;
  waterproofRating?: string;
  uvProtection?: boolean;
  weight: number;
}

export interface BackpackSpecs {
  volume: number; // 容量(L)
  weight: number; // 重量(g)
  frameType: "internal" | "external" | "none";
  hipBelt: boolean;
  rainCover: boolean;
}

export interface SleepingSpecs {
  temperatureRating: number; // 温标(°C)
  weight: number; // 重量(g)
  fillType: "down" | "synthetic";
  packedSize: string; // 压缩尺寸
}

export interface TentSpecs {
  capacity: number; // 人数
  weight: number; // 重量(g)
  waterproof: boolean;
  waterproofRating?: string;
  seasonRating: "3-season" | "4-season";
  material: string;
}

export interface TrekkingPoleSpecs {
  weight: number; // 单根重量(g)
  material: string; // 铝合金/碳纤维
  collapsible: boolean; // 是否可折叠
  adjustable: boolean; // 是否可调节
}

export interface NavigationSpecs {
  type: string;
  weight: number;
  batteryLife?: string;
}

export interface SafetySpecs {
  type: string;
  weight: number;
}

export interface SnowGearSpecs {
  type: "crampons" | "gaiters" | "ice-axe" | "snowshoes";
  weight: number;
  material: string;
  compatibleBootSize?: string;
}

export interface CookingSpecs {
  type: "stove" | "pot" | "utensil" | "system";
  weight: number;
  fuelType?: "gas" | "liquid" | "solid";
  capacity?: number;
}

export interface LightingSpecs {
  type: "headlamp" | "flashlight" | "lantern";
  weight: number;
  lumens: number;
  batteryLife: string;
  rechargeable: boolean;
}

export interface EmergencySpecs {
  type: "blanket" | "whistle" | "fire-starter" | "repair-kit" | "bivy";
  weight: number;
}

export interface HydrationSpecs {
  type: "bladder" | "bottle" | "filter-bottle";
  volume: number;
  weight: number;
}

export type ProductSpecs =
  | FootwearSpecs
  | ClothingSpecs
  | ProtectionSpecs
  | BackpackSpecs
  | TentSpecs
  | SleepingSpecs
  | TrekkingPoleSpecs
  | NavigationSpecs
  | SafetySpecs
  | SnowGearSpecs
  | CookingSpecs
  | LightingSpecs
  | EmergencySpecs
  | HydrationSpecs;

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  image: string;
  specs: ProductSpecs;
  scenarios: string[]; // 适用场景标签
  price?: number; // 参考价格(元)
  purchaseUrl?: string; // 购买链接
  maintenanceTips?: string[]; // 维护提示
  alternatives?: string[]; // 替代产品ID列表
}

export interface Recommendation {
  category: ProductCategory;
  categoryName: string;
  categoryIcon: string;
  recommended: boolean;
  product?: Product;
  alternativeProducts?: Product[];
  reason: string;
  reasonTags: ReasonTag[];
  priority: Priority;
  carryingTips?: string[]; // 携带提示
  maintenanceTips?: string[]; // 维护提示
}

export interface ReasonTag {
  text: string;
  type: "weather" | "terrain" | "route" | "style";
}

export interface GearRecommendation {
  routeId: string;
  style: string;
  date: string;
  recommendations: Recommendation[];
  notRecommended: { category: string; reason: string }[];
  totalWeight: number; // 总重量(g)
  weatherForecast?: DayForecast[];
}

