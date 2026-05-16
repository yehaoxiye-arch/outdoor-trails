import { Product, Recommendation, ReasonTag, GearRecommendation, ProductCategory, FootwearSpecs, ClothingSpecs, BackpackSpecs, SleepingSpecs, TentSpecs, TrekkingPoleSpecs, CookingSpecs, LightingSpecs, HydrationSpecs, ProtectionSpecs, SafetySpecs, SnowGearSpecs, NavigationSpecs } from "@/types/product";
import { DayForecast } from "@/types/weather";
import { Route, RouteStyleData } from "@/types/route";
import { products, productCategories } from "@/data/products";
import { gearRules } from "@/data/gear-rules";

interface RecommendationContext {
  route: Route;
  style: RouteStyleData;
  forecasts: DayForecast[];
  date: string;
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

function parseDistance(distance: string): number {
  const match = distance.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseAltitude(altitude: string): number {
  const match = altitude.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function getMinTemp(forecasts: DayForecast[]): number {
  return Math.min(...forecasts.map((f) => f.tempLow));
}

function getMaxTemp(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.tempHigh));
}

function getMaxPrecipitation(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.precipitation));
}

function hasSnow(forecasts: DayForecast[]): boolean {
  return forecasts.some((f) => f.precipitationType === "snow");
}

function getMaxWindSpeed(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.windSpeed));
}

// 按重量升序排序（轻量化优先）
function sortByWeight(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const wa = (a.specs as any).weight || 0;
    const wb = (b.specs as any).weight || 0;
    return wa - wb;
  });
}

// 智能选择产品：根据上下文筛选最合适的
function selectBestProduct(categoryProducts: Product[], context: RecommendationContext, category: ProductCategory): Product | undefined {
  if (categoryProducts.length === 0) return undefined;

  const { style, forecasts } = context;
  const duration = parseDuration(style.duration);
  const minTemp = getMinTemp(forecasts);
  const maxTemp = getMaxTemp(forecasts);
  const maxPrecip = getMaxPrecipitation(forecasts);
  const altitude = parseAltitude(style.altitude);

  // 根据品类特性筛选
  switch (category) {
    case "footwear": {
      // 多日行程优先中高帮防水鞋，不考虑温度范围
      if (duration >= 2) {
        const supportive = categoryProducts.filter((p) => {
          const specs = p.specs as FootwearSpecs;
          const isSupportive = specs.ankleSupport === "mid" || specs.ankleSupport === "high";
          return isSupportive && specs.waterproof;
        });
        if (supportive.length > 0) return sortByWeight(supportive)[0];
      }
      // 按温度范围筛选（单日行程或无中高帮防水鞋时）
      let suitable = categoryProducts.filter((p) => {
        const specs = p.specs as FootwearSpecs;
        return specs.temperatureRange.min <= minTemp && specs.temperatureRange.max >= maxTemp;
      });
      // 困难线路优先高帮鞋（护踝支撑）
      if (style.difficulty === "困难" || style.difficulty === "极难") {
        const highAnkle = suitable.filter((p) => (p.specs as FootwearSpecs).ankleSupport === "high");
        if (highAnkle.length > 0) suitable = highAnkle;
      }
      // 根据降水概率决定是否优先防水
      const needWaterproof = maxPrecip > 40;
      if (needWaterproof) {
        const waterproof = sortByWeight(suitable.filter((p) => (p.specs as FootwearSpecs).waterproof));
        return waterproof[0] || sortByWeight(suitable)[0] || sortByWeight(categoryProducts)[0];
      } else {
        // 天气良好时优先选择轻量鞋（非防水）
        const lightweight = sortByWeight(suitable.filter((p) => !(p.specs as FootwearSpecs).waterproof));
        return lightweight[0] || sortByWeight(suitable)[0] || sortByWeight(categoryProducts)[0];
      }
    }

    case "outer-layer":
    case "mid-layer":
    case "base-layer": {
      // 按温度范围筛选，按重量排序
      const suitable = sortByWeight(categoryProducts.filter((p) => {
        const specs = p.specs as ClothingSpecs;
        return specs.temperatureRange.min <= minTemp && specs.temperatureRange.max >= maxTemp;
      }));
      return suitable[0] || sortByWeight(categoryProducts)[0];
    }

    case "backpack": {
      // 按行程风格和时长选择容量
      let targetVolume: number;
      if (style.name === "重装露营") {
        targetVolume = 60;
      } else if (style.name === "越野跑") {
        targetVolume = 10;
      } else {
        // 轻装速穿
        targetVolume = duration <= 1 ? 20 : duration <= 3 ? 35 : 50;
      }

      const suitable = categoryProducts.filter((p) => {
        const specs = p.specs as BackpackSpecs;
        return Math.abs(specs.volume - targetVolume) < 15;
      });
      // 按容量接近度排序，再按重量排序
      suitable.sort((a, b) => {
        const da = Math.abs((a.specs as BackpackSpecs).volume - targetVolume);
        const db = Math.abs((b.specs as BackpackSpecs).volume - targetVolume);
        if (da !== db) return da - db;
        return ((a.specs as any).weight || 0) - ((b.specs as any).weight || 0);
      });
      return suitable[0] || sortByWeight(categoryProducts)[0];
    }

    case "tent": {
      // 按季节性筛选，按重量排序
      const need4Season = minTemp < 0 || altitude > 3500;
      const suitable = sortByWeight(categoryProducts.filter((p) => {
        const specs = p.specs as TentSpecs;
        return need4Season ? specs.seasonRating === "4-season" : true;
      }));
      return suitable[0] || sortByWeight(categoryProducts)[0];
    }

    case "sleeping": {
      // 按温标筛选，按重量排序
      const suitable = sortByWeight(categoryProducts.filter((p) => {
        const specs = p.specs as SleepingSpecs;
        return specs.temperatureRating <= minTemp;
      }));
      return suitable.length > 0 ? suitable[0] : sortByWeight(categoryProducts)[0];
    }

    case "trekking-poles": {
      // 高海拔或困难线路优先选择碳纤维（轻量）
      const preferCarbon = altitude > 3000 || style.difficulty === "困难";
      if (preferCarbon) {
        const carbon = sortByWeight(categoryProducts.filter((p) => (p.specs as TrekkingPoleSpecs).material.includes("碳")));
        if (carbon.length > 0) return carbon[0];
      }
      return sortByWeight(categoryProducts)[0];
    }

    case "cooking": {
      // 重装选完整套装，轻装选简易炉头
      if (style.name === "重装露营") {
        const system = sortByWeight(categoryProducts.filter((p) => (p.specs as CookingSpecs).type === "system"));
        return system[0] || sortByWeight(categoryProducts)[0];
      }
      const stove = sortByWeight(categoryProducts.filter((p) => (p.specs as CookingSpecs).type === "stove"));
      return stove[0] || sortByWeight(categoryProducts)[0];
    }

    case "lighting": {
      // 越野跑/轻量优先超轻头灯
      if (style.name === "越野跑") {
        const ultralight = sortByWeight(categoryProducts.filter((p) => (p.specs as LightingSpecs).weight < 50));
        return ultralight[0] || sortByWeight(categoryProducts)[0];
      }
      return sortByWeight(categoryProducts)[0];
    }

    case "emergency": {
      return sortByWeight(categoryProducts)[0];
    }

    case "hydration": {
      // 越野跑选软水壶，其余选水袋
      if (style.name === "越野跑") {
        const flask = sortByWeight(categoryProducts.filter((p) => (p.specs as HydrationSpecs).type === "bottle"));
        return flask[0] || sortByWeight(categoryProducts)[0];
      }
      const bladder = sortByWeight(categoryProducts.filter((p) => (p.specs as HydrationSpecs).type === "bladder"));
      return bladder[0] || sortByWeight(categoryProducts)[0];
    }

    case "rain-gear": {
      // 优先轻量防水
      return sortByWeight(categoryProducts)[0];
    }

    case "sun-protection": {
      // 优先有 UV 防护的产品
      const uvProtected = categoryProducts.filter((p) => (p.specs as ProtectionSpecs).uvProtection);
      return uvProtected[0] || sortByWeight(categoryProducts)[0];
    }

    case "navigation": {
      // 按重量排序
      return sortByWeight(categoryProducts)[0];
    }

    case "safety": {
      // 优先急救包类型
      const firstAid = categoryProducts.filter((p) => (p.specs as SafetySpecs).type === "first-aid");
      return firstAid[0] || sortByWeight(categoryProducts)[0];
    }

    case "snow-gear": {
      // 按重量排序
      return sortByWeight(categoryProducts)[0];
    }

    default:
      return sortByWeight(categoryProducts)[0];
  }
}

function generateReasonTags(context: RecommendationContext, rule: any): ReasonTag[] {
  const tags: ReasonTag[] = [];
  const { style, forecasts } = context;

  // 走法标签
  tags.push({ text: style.name, type: "style" });

  // 线路标签
  const duration = parseDuration(style.duration);
  const distance = parseDistance(style.distance);
  if (duration >= 2) tags.push({ text: `${duration}天行程`, type: "route" });
  if (distance >= 20) tags.push({ text: `${distance}km`, type: "route" });

  // 天气标签
  const maxPrecip = getMaxPrecipitation(forecasts);
  if (maxPrecip > 60) tags.push({ text: `降水${maxPrecip}%`, type: "weather" });

  const minTemp = getMinTemp(forecasts);
  if (minTemp < 0) tags.push({ text: `低温${minTemp}°C`, type: "weather" });

  const maxTemp = getMaxTemp(forecasts);
  if (maxTemp > 30) tags.push({ text: `高温${maxTemp}°C`, type: "weather" });

  return tags;
}

function fillReasonTemplate(template: string, context: RecommendationContext): string {
  const { style, forecasts } = context;

  return template
    .replace("{duration}", style.duration)
    .replace("{distance}", parseDistance(style.distance).toString())
    .replace("{altitude}", parseAltitude(style.altitude).toString())
    .replace("{difficulty}", style.difficulty)
    .replace("{tempLow}", getMinTemp(forecasts).toString())
    .replace("{tempHigh}", getMaxTemp(forecasts).toString())
    .replace("{precipitation}", getMaxPrecipitation(forecasts).toString())
    .replace("{windSpeed}", getMaxWindSpeed(forecasts).toString())
    .replace("{style}", style.name);
}

export function generateRecommendations(context: RecommendationContext): GearRecommendation {
  const { route, style, forecasts, date } = context;
  const recommendations: Recommendation[] = [];
  const notRecommended: { category: string; reason: string }[] = [];
  const processedCategories = new Set<ProductCategory>();

  // 解析线路属性
  const duration = parseDuration(style.duration);
  const distance = parseDistance(style.distance);
  const altitude = parseAltitude(style.altitude);
  const minTemp = getMinTemp(forecasts);
  const maxTemp = getMaxTemp(forecasts);
  const maxPrecip = getMaxPrecipitation(forecasts);
  const hasSnowfall = hasSnow(forecasts);
  const maxWind = getMaxWindSpeed(forecasts);

  // 评估每条规则
  for (const rule of gearRules) {
    if (processedCategories.has(rule.category)) continue;

    let matches = true;

    // 空条件数组 = 无条件匹配（所有户外活动）
    if (rule.conditions.length > 0) {
      for (const condition of rule.conditions) {
        let value: any;

        switch (condition.field) {
          case "duration":
            value = parseDuration(style.duration);
            break;
          case "distance":
            value = distance;
            break;
          case "altitude":
            value = altitude;
            break;
          case "difficulty":
            value = style.difficulty;
            break;
          case "tempLow":
            value = minTemp;
            break;
          case "tempHigh":
            value = maxTemp;
            break;
          case "precipitation":
            value = maxPrecip;
            break;
          case "precipitationType":
            value = forecasts.some((f) => f.precipitationType === "snow") ? "snow" : forecasts.some((f) => f.precipitationType === "sleet") ? "sleet" : forecasts.some((f) => f.precipitationType === "rain") ? "rain" : "none";
            break;
          case "weatherCondition":
            value = forecasts.map((f) => f.condition).join(",");
            break;
          case "style":
            value = style.name;
            break;
          case "hasSnow":
            value = hasSnow(forecasts);
            break;
          case "windSpeed":
            value = getMaxWindSpeed(forecasts);
            break;
          case "terrain":
            value = route.mountainRange || "";
            break;
          default:
            value = null;
        }

        switch (condition.operator) {
          case "gt":
            if (!(value > condition.value)) matches = false;
            break;
          case "lt":
            if (!(value < condition.value)) matches = false;
            break;
          case "eq":
            if (typeof value === "number" && typeof condition.value === "string") {
              const parsed = parseFloat(condition.value);
              if (!isNaN(parsed) && value !== parsed) matches = false;
              else if (isNaN(parsed) && String(value) !== condition.value) matches = false;
            } else if (value !== condition.value) {
              matches = false;
            }
            break;
          case "contains":
            if (!String(value).includes(condition.value)) matches = false;
            break;
        }

        if (!matches) break;
      }
    }

    if (matches) {
      processedCategories.add(rule.category);

      const categoryProducts = products.filter((p) => p.category === rule.category);
      const primaryProduct = selectBestProduct(categoryProducts, context, rule.category);

      // 选择替代品：优先不同品牌，按重量排序，取3个
      const alternatives = categoryProducts
        .filter((p) => p.id !== primaryProduct?.id)
        .sort((a, b) => ((a.specs as any).weight || 0) - ((b.specs as any).weight || 0));
      const alternativeProducts: Product[] = [];
      const usedBrands = new Set<string>(primaryProduct ? [primaryProduct.brand] : []);
      // 第一轮：不同品牌
      for (const p of alternatives) {
        if (alternativeProducts.length >= 3) break;
        if (!usedBrands.has(p.brand)) {
          alternativeProducts.push(p);
          usedBrands.add(p.brand);
        }
      }
      // 第二轮：不足3个时用同品牌补足
      for (const p of alternatives) {
        if (alternativeProducts.length >= 3) break;
        if (!alternativeProducts.find((a) => a.id === p.id)) {
          alternativeProducts.push(p);
        }
      }

      const reasonTags = generateReasonTags(context, rule);
      const reason = fillReasonTemplate(rule.reasonTemplate, context);

      recommendations.push({
        category: rule.category,
        categoryName: rule.categoryName,
        categoryIcon: rule.categoryIcon,
        recommended: rule.recommended,
        product: primaryProduct,
        alternativeProducts,
        reason,
        reasonTags,
        priority: rule.priority,
        carryingTips: primaryProduct?.maintenanceTips,
        maintenanceTips: primaryProduct?.maintenanceTips,
      });
    }
  }

  // 添加不推荐的品类
  for (const category of productCategories) {
    if (!processedCategories.has(category.id)) {
      notRecommended.push({
        category: category.name,
        reason: getNotRecommendedReason(category.id, context),
      });
    }
  }

  // 计算总重量
  const totalWeight = recommendations.reduce((sum, rec) => {
    if (rec.product) {
      const specs = rec.product.specs as any;
      return sum + (specs.weight || 0);
    }
    return sum;
  }, 0);

  // 按优先级排序
  const priorityOrder: Record<string, number> = {
    critical: 0,
    required: 1,
    recommended: 2,
    optional: 3,
  };

  recommendations.sort((a, b) => {
    const pa = priorityOrder[a.priority] ?? 99;
    const pb = priorityOrder[b.priority] ?? 99;
    return pa - pb;
  });

  return {
    routeId: route.id,
    style: style.name,
    date,
    recommendations,
    notRecommended,
    totalWeight,
    weatherForecast: forecasts,
  };
}

function getNotRecommendedReason(category: ProductCategory, context: RecommendationContext): string {
  const { style } = context;

  const reasons: Record<ProductCategory, Record<string, string>> = {
    footwear: {
      越野跑: "越野跑不需要重装徒步鞋",
    },
    "base-layer": {},
    "mid-layer": {},
    "outer-layer": {
      越野跑: "越野跑一般不需要冲锋衣",
    },
    "rain-gear": {
      越野跑: "越野跑一般不需要雨具",
    },
    "sun-protection": {},
    backpack: {
      越野跑: "越野跑使用水袋背心即可",
    },
    tent: {
      轻装速穿: "轻装速穿通常不需要帐篷",
      越野跑: "越野跑不需要帐篷",
    },
    sleeping: {
      轻装速穿: "轻装速穿不需要露营装备",
      越野跑: "越野跑不需要露营装备",
    },
    "trekking-poles": {},
    cooking: {
      轻装速穿: "轻装速穿不需要炊具",
      越野跑: "越野跑不需要炊具",
    },
    navigation: {
      越野跑: "越野跑手机导航即可",
    },
    safety: {},
    "snow-gear": {},
    lighting: {},
    emergency: {},
    hydration: {},
  };

  return reasons[category]?.[style.name] || "当前线路不需要此类装备";
}
