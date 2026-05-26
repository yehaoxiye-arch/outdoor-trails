// 品牌优先级配置
// 根据路线条件（海拔、时长、距离、天气）动态排序品牌
// 匹配规则：按数组顺序找到第一个所有条件都匹配的条目，使用其品牌列表

interface BrandPriorityRule {
  conditions: {
    altitude?: "high" | "low";
    duration?: "single" | "multi";
    distance?: "long" | "short";
    weather?: "cold" | "rain" | "normal";
  };
  brands: string[];
}

type BrandPriorityConfig = Record<string, BrandPriorityRule[]>;

// 品牌名称标准化映射（Excel 中的写法 → 数据库中的写法）
const brandNameMap: Record<string, string> = {
  "arc teryx": "Arc'teryx",
  "arc'teryx": "Arc'teryx",
  "mammut": "猛犸象",
  "blackdiamond": "Black Diamond",
  "black diamond": "Black Diamond",
  "the north face": "The North Face",
  "rab": "Rab",
  "sea to summit": "Sea to Summit",
  "marmot": "Marmot",
  "montbell": "Montbell",
  "montane": "Montane",
  "mystery ranch": "Mystery Ranch",
  "msr": "MSR",
  "salomon": "Salomon",
  "hoka": "HOKA",
  "lowa": "Lowa",
  "scarpa": "Scarpa",
  "lasportiva": "La Sportiva",
  "crispi": "Crispi",
  "merrell": "Merrell",
  "deuter": "Deuter",
  "gregory": "Gregory",
  "osprey": "Osprey",
  "patagonia": "Patagonia",
};

// 标准化品牌名称
function normalizeBrand(name: string): string {
  const lower = name.trim().toLowerCase();
  return brandNameMap[lower] || name.trim();
}

// 从 Excel 解析的品牌优先级配置
export const brandPriority: BrandPriorityConfig = {
  "footwear": [
    { conditions: { altitude: "high", duration: "multi", distance: "long", weather: "cold" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "high", duration: "multi", distance: "long", weather: "rain" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "high", duration: "multi", distance: "long", weather: "normal" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "high", duration: "single", weather: "cold" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "high", duration: "single", weather: "normal" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "low", duration: "multi", distance: "long", weather: "rain" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "low", duration: "multi", distance: "long", weather: "normal" }, brands: ["Scarpa", "La Sportiva", "Lowa", "Salomon", "Crispi", "HOKA", "凯乐石", "Merrell"] },
    { conditions: { altitude: "low", duration: "multi", distance: "short" }, brands: ["Salomon", "HOKA", "凯乐石", "迪卡侬", "Merrell"] },
    { conditions: { altitude: "low", duration: "single", distance: "long" }, brands: ["Salomon", "HOKA", "凯乐石", "迪卡侬", "Merrell"] },
    { conditions: { altitude: "low", duration: "single", distance: "short" }, brands: ["Salomon", "HOKA", "凯乐石", "迪卡侬", "Merrell"] },
    { conditions: {}, brands: ["Salomon", "HOKA", "凯乐石", "迪卡侬", "Merrell"] },
  ],

  "mid-layer": [
    { conditions: { altitude: "high", weather: "cold" }, brands: ["Arc'teryx", "Patagonia", "The North Face", "凯乐石", "拓路者", "Rab", "Black Diamond", "迪卡侬"] },
    { conditions: { altitude: "high", weather: "rain" }, brands: ["Arc'teryx", "Patagonia", "The North Face", "凯乐石", "拓路者", "Rab", "Black Diamond", "迪卡侬"] },
    { conditions: { altitude: "high" }, brands: ["Arc'teryx", "Patagonia", "The North Face", "凯乐石", "拓路者", "Rab", "Black Diamond", "迪卡侬"] },
    { conditions: { altitude: "low" }, brands: ["凯乐石", "拓路者", "迪卡侬", "Patagonia", "Arc'teryx", "探路者", "Black Diamond"] },
    { conditions: {}, brands: ["凯乐石", "拓路者", "迪卡侬", "Patagonia", "Arc'teryx", "探路者", "Black Diamond"] },
  ],

  "outer-layer": [
    { conditions: { altitude: "high", weather: "cold" }, brands: ["Arc'teryx", "猛犸象", "Patagonia", "The North Face", "凯乐石", "Montbell", "拓路者", "Montane"] },
    { conditions: { altitude: "high", weather: "rain" }, brands: ["Arc'teryx", "猛犸象", "Patagonia", "The North Face", "凯乐石", "Montbell", "拓路者", "Montane"] },
    { conditions: { altitude: "high" }, brands: ["Arc'teryx", "猛犸象", "Patagonia", "The North Face", "凯乐石", "Montbell", "拓路者", "Montane"] },
    { conditions: { altitude: "low" }, brands: ["凯乐石", "拓路者", "迪卡侬", "Arc'teryx", "Montbell", "伯希和", "探路者", "猛犸象"] },
    { conditions: {}, brands: ["凯乐石", "拓路者", "迪卡侬", "Arc'teryx", "Montbell", "伯希和", "探路者", "猛犸象"] },
  ],

  "backpack": [
    { conditions: { altitude: "high", duration: "multi" }, brands: ["Mystery Ranch", "Gregory", "Osprey", "Deuter", "凯乐石", "迪卡侬"] },
    { conditions: { altitude: "high", duration: "single" }, brands: ["Osprey", "凯乐石", "迪卡侬", "艾王", "Salomon", "HOKA"] },
    { conditions: { duration: "multi" }, brands: ["Mystery Ranch", "Gregory", "Osprey", "Deuter", "凯乐石", "迪卡侬"] },
    { conditions: {}, brands: ["Osprey", "Gregory", "Deuter", "凯乐石", "迪卡侬", "艾王", "Salomon", "HOKA"] },
  ],

  "tent": [
    { conditions: {}, brands: ["牧高笛", "挪客", "三峰出", "MSR", "迪卡侬"] },
  ],

  "sleeping": [
    { conditions: {}, brands: ["黑冰", "The North Face", "Rab", "高山客", "挪客", "Sea to Summit", "Marmot"] },
  ],
};

// 获取条件键
function getConditionKey(altitude: string, duration: string, distance: string, weather: string) {
  return {
    altitude: altitude as "high" | "low",
    duration: duration as "single" | "multi",
    distance: distance as "long" | "short",
    weather: weather as "cold" | "rain" | "normal",
  };
}

// 检查规则条件是否匹配
function matchesConditions(rule: BrandPriorityRule, ctx: ReturnType<typeof getConditionKey>): boolean {
  const { conditions } = rule;
  if (conditions.altitude && conditions.altitude !== ctx.altitude) return false;
  if (conditions.duration && conditions.duration !== ctx.duration) return false;
  if (conditions.distance && conditions.distance !== ctx.distance) return false;
  if (conditions.weather && conditions.weather !== ctx.weather) return false;
  return true;
}

// 获取品牌优先级排序
export function getBrandOrder(
  category: string,
  altitude: number,
  durationDays: number,
  distanceKm: number,
  minTemp: number,
  maxPrecipitation: number
): string[] | null {
  const rules = brandPriority[category];
  if (!rules || rules.length === 0) return null;

  const ctx = getConditionKey(
    altitude > 3500 ? "high" : "low",
    durationDays > 1 ? "multi" : "single",
    distanceKm > 20 ? "long" : "short",
    minTemp < 5 ? "cold" : maxPrecipitation > 50 ? "rain" : "normal"
  );

  for (const rule of rules) {
    if (matchesConditions(rule, ctx)) {
      return rule.brands.map(normalizeBrand);
    }
  }

  return null;
}
