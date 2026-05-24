import { readFileSync, writeFileSync } from 'fs';

const csv = readFileSync('C:/Users/Simon/AppData/Local/Temp/jx_routes.csv', 'utf-8');
const lines = csv.split('\n').filter(l => l.trim());

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

const rows = lines.map(parseCSVLine);

const fieldMap = {
  name: 1,
  id: 3,
  city: 4,
  district: 5,
  mountain: 6,
  start: 7,
  end: 8,
  description: 12,
  distance: 14,
  days: 15,
  dailySegments: 16,
  dailyTime: 17,
  maxAlt: 19,
  minAlt: 20,
  ascent: 21,
  descent: 22,
  difficulty: 25,
  terrain: 29,
  mainTerrain: 32,
  bestSeason: 42,
  avoidPeriod: 44,
  highlights: 97,
  rescue: 89,
};

function mapDifficulty(d) {
  if (!d) return '中等';
  if (d.includes('极难')) return '极难';
  if (d.includes('困难')) return '困难';
  if (d.includes('简单')) return '简单';
  return '中等';
}

function mapDuration(days) {
  if (!days) return '1天';
  const d = String(days).trim();
  if (d.includes('-')) {
    const parts = d.split('-');
    return parts[0] + '-' + parts[1] + '天';
  }
  if (d === '0.5') return '半天';
  return d + '天';
}

function esc(s) {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}

const routes = [];

for (let i = 5; i < rows[0].length; i++) {
  const get = (rowIdx) => rows[rowIdx]?.[i] || '';

  const name = get(fieldMap.name);
  const id = get(fieldMap.id);
  const city = get(fieldMap.city);
  const district = get(fieldMap.district);
  const mountain = get(fieldMap.mountain);
  const description = get(fieldMap.description);
  const distance = get(fieldMap.distance);
  const days = get(fieldMap.days);
  const maxAlt = get(fieldMap.maxAlt);
  const difficulty = mapDifficulty(get(fieldMap.difficulty));
  const duration = mapDuration(days);
  const highlights = get(fieldMap.highlights);
  const bestSeason = get(fieldMap.bestSeason);
  const terrain = get(fieldMap.terrain);
  const mainTerrain = get(fieldMap.mainTerrain);
  const ascent = get(fieldMap.ascent);

  if (!name || !id) continue;

  const daysNum = parseFloat(days) || 1;
  const distNum = parseFloat(distance) || 0;

  const location = district ? `${city} · ${district}` : city;

  let desc = esc(description);
  if (highlights) desc += ' 核心看点：' + esc(highlights) + '。';
  if (bestSeason) desc += ' 最佳季节：' + esc(bestSeason) + '。';

  let weightRange = '3-5kg';
  if (daysNum >= 2) weightRange = '12-18kg';
  else if (distNum < 12) weightRange = '2-4kg';

  let timeReduction = '60-70%';
  if (daysNum >= 2) timeReduction = '按建议天数';

  let styleName = '轻装速穿';
  if (name.includes('全程') || name.includes('三峰') || name.includes('连穿') ||
      name.includes('穿越线') && daysNum >= 2 || name.includes('溯溪')) {
    styleName = '重装露营';
  }

  routes.push({
    id, name, location, mountain, distance, duration,
    altitude: maxAlt + 'm', difficulty, description: desc,
    weightRange, timeReduction, styleName,
  });
}

let ts = `import { Route, RouteStyleData, Difficulty } from "@/types/route";

// 江西省徒步线路数据（从采集表格自动生成）
export const routes: Route[] = [
`;

for (const r of routes) {
  ts += `  {
    id: "${r.id}",
    name: "${r.name}",
    province: "江西",
    location: "${r.location}",
    mountainRange: "${r.mountain}",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    styles: [
      {
        name: "${r.styleName}",
        distance: "${r.distance}km",
        duration: "${r.duration}",
        altitude: "${r.altitude}",
        difficulty: "${r.difficulty}",
        description: "${r.description}",
        weightRange: "${r.weightRange}",
        timeReduction: "${r.timeReduction}",
      },
    ],
  },
`;
}

ts += `];

export function getProvinces(): string[] {
  const provinces = new Set(routes.map((route) => route.province));
  return Array.from(provinces);
}

export function getRoutesByProvince(province: string): Route[] {
  return routes.filter((route) => route.province === province);
}

export function getRouteById(id: string): Route | undefined {
  return routes.find((route) => route.id === id);
}

export function getRouteStyle(routeId: string, styleName: string): RouteStyleData | undefined {
  const route = getRouteById(routeId);
  return route?.styles.find((s) => s.name === styleName);
}

export function searchRoutes(query: string): Route[] {
  const lowerQuery = query.toLowerCase();
  return routes.filter(
    (route) =>
      route.name.toLowerCase().includes(lowerQuery) ||
      route.province.toLowerCase().includes(lowerQuery) ||
      route.location.toLowerCase().includes(lowerQuery)
  );
}
`;

writeFileSync('C:/Users/Simon/outdoor-trails/src/data/routes.ts', ts);
console.log(`Generated ${routes.length} routes`);
