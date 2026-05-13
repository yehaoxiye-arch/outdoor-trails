import { Route, RouteStyleData, Difficulty } from "@/types/route";

// 武功山（三种走法合并）
const wugongRoute: Route = {
  id: "wugong",
  name: "武功山",
  province: "江西",
  location: "萍乡市 · 吉安市",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 27.45, lng: 114.18 },
  styles: [
    {
      name: "轻装速穿",
      distance: "20km",
      duration: "2天",
      altitude: "1918m",
      difficulty: "中等",
      description: "华东最经典高山草甸路线，景区大门正向穿越，串联金顶、吊马桩、发云界核心地标。住沿途客栈，负重轻，适合有一定体力的徒步者。4-5月杜鹃花海、9-11月云海概率最高。",
      weightRange: "5-8kg",
      timeReduction: "30-50%",
    },
    {
      name: "重装露营",
      distance: "23.5km",
      duration: "2天",
      altitude: "1918m",
      difficulty: "中等",
      description: "龙山村非景区入口反向穿越，串联发云界、绝望坡、金顶核心地标。自带帐篷露营，体验山野星空。反穿风景优于正穿，人更少，推荐有一定户外经验者。",
      weightRange: "12-18kg",
      timeReduction: "按建议天数",
    },
    {
      name: "越野跑",
      distance: "45km",
      duration: "3天",
      altitude: "1918m",
      difficulty: "困难",
      description: "武功山全穿路线，完整体验十万亩高山草甸。从龙山村出发一路穿越至景区大门，极简装备追求速度，适合有越野跑经验的运动者。",
      weightRange: "2-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 庐山（五老峰-三叠泉）
const lushanRoute: Route = {
  id: "lushan",
  name: "庐山（五老峰-三叠泉）",
  province: "江西",
  location: "九江市 · 庐山市",
  mountainRange: "庐山",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 29.55, lng: 115.98 },
  styles: [
    {
      name: "轻装速穿",
      distance: "15km",
      duration: "1天",
      altitude: "1358m",
      difficulty: "中等",
      description: "世界文化遗产，五老峰为庐山最高峰，三叠泉落差155米被誉为'庐山第一奇观'。沿途云雾缭绕、古道幽深，4-6月和9-11月最佳。住山下酒店即可。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 三清山（大环线）
const sanqingshanRoute: Route = {
  id: "sanqingshan",
  name: "三清山（大环线）",
  province: "江西",
  location: "上饶市 · 玉山县",
  mountainRange: "三清山",
  image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
  coordinates: { lat: 28.88, lng: 118.06 },
  styles: [
    {
      name: "轻装速穿",
      distance: "25km",
      duration: "2天",
      altitude: "1820m",
      difficulty: "中等",
      description: "世界自然遗产，花岗岩峰林地貌堪称一绝。巨蟒出山、司春女神等奇石令人叹为观止。云海、晚霞、日出是三大看点。住山顶酒店。",
      weightRange: "3-6kg",
      timeReduction: "30-50%",
    },
    {
      name: "重装露营",
      distance: "25km",
      duration: "2天",
      altitude: "1820m",
      difficulty: "中等",
      description: "世界自然遗产，花岗岩峰林地貌堪称一绝。大环线涵盖核心景区，自带帐篷在指定营地露营，感受山间星空。",
      weightRange: "12-16kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 井冈山（主峰线）
const jinggangshanRoute: Route = {
  id: "jinggangshan",
  name: "井冈山（主峰线）",
  province: "江西",
  location: "吉安市 · 井冈山市",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 26.58, lng: 114.17 },
  styles: [
    {
      name: "轻装速穿",
      distance: "18km",
      duration: "1天",
      altitude: "1580m",
      difficulty: "简单",
      description: "革命圣地与自然风光完美结合。沿途竹林蔽日、瀑布飞泻，空气清新。线路成熟，台阶为主，适合新手和红色文化爱好者。3-5月和9-11月最佳。",
      weightRange: "2-4kg",
      timeReduction: "60-70%",
    },
  ],
};

// 龙虎山（仙水岩）
const longhushanRoute: Route = {
  id: "longhushan",
  name: "龙虎山（仙水岩）",
  province: "江西",
  location: "鹰潭市 · 贵溪市",
  mountainRange: "龙虎山",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  coordinates: { lat: 28.12, lng: 116.98 },
  styles: [
    {
      name: "轻装速穿",
      distance: "12km",
      duration: "1天",
      altitude: "230m",
      difficulty: "简单",
      description: "道教名山，丹霞地貌与泸溪河相映成趣。崖墓群、仙水岩等景点独具特色。线路平缓，适合全家出游。3-5月和9-11月最佳。",
      weightRange: "2-3kg",
      timeReduction: "60-70%",
    },
  ],
};

// 明月山
const mingyueshanRoute: Route = {
  id: "mingyueshan",
  name: "明月山",
  province: "江西",
  location: "宜春市 · 温汤镇",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 27.65, lng: 114.32 },
  styles: [
    {
      name: "轻装速穿",
      distance: "16km",
      duration: "1天",
      altitude: "1736m",
      difficulty: "中等",
      description: "瀑布群壮观，高山草甸开阔，山脚温汤镇有天然温泉可泡。线路强度适中，适合周末一日游。4-6月和9-11月最佳。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 黄岗山
const huanggangshanRoute: Route = {
  id: "huanggangshan",
  name: "黄岗山",
  province: "江西",
  location: "上饶市 · 铅山县",
  mountainRange: "武夷山脉",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 27.85, lng: 117.78 },
  styles: [
    {
      name: "重装露营",
      distance: "22km",
      duration: "2天",
      altitude: "2158m",
      difficulty: "困难",
      description: "华东最高峰，武夷山脉主峰。原始森林密布，生物多样性丰富。登顶可远眺闽赣两省。线路较长且海拔高，需充足体能。5-6月和9-10月最佳。",
      weightRange: "15-20kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 齐云山
const qiyunshanRoute: Route = {
  id: "qiyunshan",
  name: "齐云山",
  province: "江西",
  location: "赣州市 · 崇义县",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
  coordinates: { lat: 25.72, lng: 114.12 },
  styles: [
    {
      name: "重装露营",
      distance: "20km",
      duration: "2天",
      altitude: "2061m",
      difficulty: "困难",
      description: "赣南最高峰，高山草甸连绵，4-5月杜鹃花海漫山遍野。线路有一定难度，需负重露营。人少清静，适合追求原生态体验的徒步者。",
      weightRange: "15-20kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 九岭山（萝卜潭）
const jiulingshanRoute: Route = {
  id: "jiulingshan",
  name: "九岭山（萝卜潭）",
  province: "江西",
  location: "宜春市 · 九江市",
  mountainRange: "九岭山脉",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 28.72, lng: 114.85 },
  styles: [
    {
      name: "重装露营",
      distance: "18km",
      duration: "2天",
      altitude: "1794m",
      difficulty: "中等",
      description: "较少人知的宝藏线路，瀑布群密集，原始森林保存完好。萝卜潭瀑布群是核心看点。人少清静，适合喜欢探索的徒步者。4-6月最佳。",
      weightRange: "12-16kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 羊狮慕
const yangshimuRoute: Route = {
  id: "yangshimu",
  name: "羊狮慕",
  province: "江西",
  location: "吉安市 · 安福县",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 27.38, lng: 114.25 },
  styles: [
    {
      name: "轻装速穿",
      distance: "12km",
      duration: "1天",
      altitude: "1766m",
      difficulty: "中等",
      description: "奇峰怪石、云海翻涌，与武功山可串联。线路较短但风景集中，适合周末一日游。4-6月和9-11月最佳。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 灵山
const lingshanRoute: Route = {
  id: "lingshan",
  name: "灵山",
  province: "江西",
  location: "上饶市 · 上饶县",
  mountainRange: "灵山",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  coordinates: { lat: 28.42, lng: 118.12 },
  styles: [
    {
      name: "轻装速穿",
      distance: "14km",
      duration: "1天",
      altitude: "1496m",
      difficulty: "中等",
      description: "花岗岩地貌独特，玻璃栈道惊险刺激。线路强度适中，适合周末出行。3-5月和9-11月最佳。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 大觉山
const dajueshanRoute: Route = {
  id: "dajueshan",
  name: "大觉山",
  province: "江西",
  location: "抚州市 · 资溪县",
  mountainRange: "武夷山脉",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 27.58, lng: 116.78 },
  styles: [
    {
      name: "轻装速穿",
      distance: "10km",
      duration: "1天",
      altitude: "1328m",
      difficulty: "简单",
      description: "漂流胜地，瀑布飞泻，竹林幽深。线路轻松，适合夏季避暑。5-9月最佳，可搭配漂流体验。",
      weightRange: "2-3kg",
      timeReduction: "60-70%",
    },
  ],
};

// 三百山
const sanbaishanRoute: Route = {
  id: "sanbaishan",
  name: "三百山",
  province: "江西",
  location: "赣州市 · 安远县",
  mountainRange: "武夷山脉",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 25.08, lng: 115.32 },
  styles: [
    {
      name: "轻装速穿",
      distance: "12km",
      duration: "1天",
      altitude: "1169m",
      difficulty: "简单",
      description: "东江源头，原始森林保存完好。溪流清澈，空气负氧离子含量极高。线路轻松，适合亲子出行。4-6月和9-11月最佳。",
      weightRange: "2-3kg",
      timeReduction: "60-70%",
    },
  ],
};

// 龟峰
const guifengRoute: Route = {
  id: "guifeng",
  name: "龟峰",
  province: "江西",
  location: "上饶市 · 弋阳县",
  mountainRange: "龟峰",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  coordinates: { lat: 28.38, lng: 117.42 },
  styles: [
    {
      name: "轻装速穿",
      distance: "8km",
      duration: "半天",
      altitude: "486m",
      difficulty: "简单",
      description: "世界自然遗产，丹霞地貌形态各异，龟形山石栩栩如生。线路短平快，适合半日游。全年可走。",
      weightRange: "1-2kg",
      timeReduction: "60-70%",
    },
  ],
};

// 梅岭
const meilingRoute: Route = {
  id: "meiling",
  name: "梅岭",
  province: "江西",
  location: "南昌市 · 湾里区",
  mountainRange: "梅岭",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 28.78, lng: 115.78 },
  styles: [
    {
      name: "轻装速穿",
      distance: "10km",
      duration: "1天",
      altitude: "841m",
      difficulty: "简单",
      description: "南昌近郊最佳徒步地，竹林蔽日、溪流潺潺、古道幽深。交通便利，适合周末半日或一日休闲。3-5月和9-11月最佳。",
      weightRange: "2-3kg",
      timeReduction: "60-70%",
    },
  ],
};

// 军峰山
const junfengshanRoute: Route = {
  id: "junfengshan",
  name: "军峰山",
  province: "江西",
  location: "抚州市 · 南丰县",
  mountainRange: "雩山",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 27.22, lng: 116.52 },
  styles: [
    {
      name: "轻装速穿",
      distance: "16km",
      duration: "1天",
      altitude: "1761m",
      difficulty: "中等",
      description: "赣东最高峰，高山草甸连绵，4-5月杜鹃花海绚烂。线路有一定强度，适合有经验的徒步者。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 翠微峰
const cuiweifengRoute: Route = {
  id: "cuiweifeng",
  name: "翠微峰",
  province: "江西",
  location: "赣州市 · 宁都县",
  mountainRange: "翠微峰",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  coordinates: { lat: 26.48, lng: 116.02 },
  styles: [
    {
      name: "轻装速穿",
      distance: "8km",
      duration: "半天",
      altitude: "530m",
      difficulty: "简单",
      description: "丹霞地貌，石城景观独特。线路短平快，适合半日游。全年可走。",
      weightRange: "1-2kg",
      timeReduction: "60-70%",
    },
  ],
};

// 云居山
const yunjushanRoute: Route = {
  id: "yunjushan",
  name: "云居山",
  province: "江西",
  location: "九江市 · 永修县",
  mountainRange: "九岭山脉",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 29.12, lng: 115.58 },
  styles: [
    {
      name: "轻装速穿",
      distance: "12km",
      duration: "1天",
      altitude: "1143m",
      difficulty: "简单",
      description: "佛教禅宗道场，真如禅寺历史悠久。竹林幽深，空气清新。线路轻松，适合修身养性。3-5月和9-11月最佳。",
      weightRange: "2-3kg",
      timeReduction: "60-70%",
    },
  ],
};

export const routes: Route[] = [
  wugongRoute,
  lushanRoute,
  sanqingshanRoute,
  jinggangshanRoute,
  longhushanRoute,
  mingyueshanRoute,
  huanggangshanRoute,
  qiyunshanRoute,
  jiulingshanRoute,
  yangshimuRoute,
  lingshanRoute,
  dajueshanRoute,
  sanbaishanRoute,
  guifengRoute,
  meilingRoute,
  junfengshanRoute,
  cuiweifengRoute,
  yunjushanRoute,
];

// 获取所有唯一省份
export function getProvinces(): string[] {
  const provinces = new Set(routes.map((route) => route.province));
  return Array.from(provinces);
}

// 按省份获取线路
export function getRoutesByProvince(province: string): Route[] {
  return routes.filter((route) => route.province === province);
}

// 按ID获取线路
export function getRouteById(id: string): Route | undefined {
  return routes.find((route) => route.id === id);
}

// 获取线路的特定走法
export function getRouteStyle(routeId: string, styleName: string): RouteStyleData | undefined {
  const route = getRouteById(routeId);
  return route?.styles.find((s) => s.name === styleName);
}

// 搜索线路
export function searchRoutes(query: string): Route[] {
  const lowerQuery = query.toLowerCase();
  return routes.filter(
    (route) =>
      route.name.toLowerCase().includes(lowerQuery) ||
      route.province.toLowerCase().includes(lowerQuery) ||
      route.location.toLowerCase().includes(lowerQuery)
  );
}
