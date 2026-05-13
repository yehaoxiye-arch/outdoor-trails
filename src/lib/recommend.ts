import { Product, Recommendation, ReasonTag, GearRecommendation, ProductCategory } from "@/types/product";
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

    for (const condition of rule.conditions) {
      let value: any;

      switch (condition.field) {
        case "duration":
          value = style.duration;
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
        case "style":
          value = style.name;
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
          if (value !== condition.value) matches = false;
          break;
        case "contains":
          if (!String(value).includes(condition.value)) matches = false;
          break;
      }

      if (!matches) break;
    }

    if (matches) {
      processedCategories.add(rule.category);

      const categoryProducts = products.filter((p) => p.category === rule.category);
      const primaryProduct = categoryProducts[0];
      const alternativeProducts = categoryProducts.slice(1, 3);

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
    "outer-layer": {},
    "rain-gear": {},
    "sun-protection": {},
    backpack: {
      越野跑: "越野跑使用水袋背心即可",
    },
    sleeping: {
      轻装速穿: "轻装速穿不需要露营装备",
      越野跑: "越野跑不需要露营装备",
    },
    cooking: {
      轻装速穿: "轻装速穿不需要炊具",
      越野跑: "越野跑不需要炊具",
    },
    navigation: {},
    safety: {},
  };

  return reasons[category]?.[style.name] || "当前线路不需要此类装备";
}
