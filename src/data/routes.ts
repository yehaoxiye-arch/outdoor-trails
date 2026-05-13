import { Route, RouteStyleData, Difficulty } from "@/types/route";

// 武功山反穿 - 示例线路
const wugongRoute: Route = {
  id: "wugong",
  name: "武功山反穿",
  province: "江西",
  location: "萍乡市 · 芦溪县 · 武功山",
  mountainRange: "罗霄山脉",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 27.4, lng: 114.1 },
  styles: [
    {
      name: "轻装速穿",
      distance: "23.5km",
      duration: "1天",
      altitude: "1918m",
      difficulty: "中等",
      description: "华东最经典高山草甸路线，从龙山村非景区入口逆向穿越，串联发云界、绝望坡、金顶核心地标，体验纯粹山野。不露营，住沿途客栈，负重轻，适合有一定体力的徒步者。",
      weightRange: "5-8kg",
      timeReduction: "30-50%",
    },
    {
      name: "重装露营",
      distance: "23.5km",
      duration: "2天",
      altitude: "1918m",
      difficulty: "中等",
      description: "华东最经典高山草甸路线，从龙山村非景区入口逆向穿越，串联发云界、绝望坡、金顶核心地标。自带帐篷露营，体验山野星空，适合喜欢户外露营的徒步者。",
      weightRange: "12-18kg",
      timeReduction: "按建议天数",
    },
    {
      name: "越野跑",
      distance: "23.5km",
      duration: "6小时",
      altitude: "1918m",
      difficulty: "困难",
      description: "华东最经典高山草甸路线，从龙山村非景区入口逆向穿越，串联发云界、绝望坡、金顶核心地标。极简装备，追求速度，适合有越野跑经验的运动者。",
      weightRange: "2-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 冈仁波齐转山
const kailashRoute: Route = {
  id: "kailash",
  name: "冈仁波齐转山",
  province: "西藏",
  location: "阿里地区 · 普兰县",
  mountainRange: "冈底斯山脉",
  image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1920&q=80",
  coordinates: { lat: 31.0, lng: 81.3 },
  styles: [
    {
      name: "轻装速穿",
      distance: "52km",
      duration: "2天",
      altitude: "4688m",
      difficulty: "困难",
      description: "世界公认的神山，海拔4688米的卓玛拉山口是全程最高点。转山一圈可洗尽一生罪孽，是藏传佛教、印度教、苯教共同的圣地。轻装住沿途寺庙。",
      weightRange: "5-8kg",
      timeReduction: "30-50%",
    },
    {
      name: "重装露营",
      distance: "52km",
      duration: "3天",
      altitude: "4688m",
      difficulty: "困难",
      description: "世界公认的神山，海拔4688米的卓玛拉山口是全程最高点。转山一圈可洗尽一生罪孽，是藏传佛教、印度教、苯教共同的圣地。自带装备，体验高原露营。",
      weightRange: "15-20kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 麦理浩径
const maclehoseRoute: Route = {
  id: "maclehose",
  name: "麦理浩径",
  province: "香港",
  location: "西贡万宜水库",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 22.4, lng: 114.3 },
  styles: [
    {
      name: "轻装速穿",
      distance: "100km",
      duration: "4天",
      altitude: "957m",
      difficulty: "中等",
      description: "香港最著名的远足径，全长100公里，横跨新界东西。沿途可欣赏壮丽的海岸线、清澈的水库和翠绿的山峦。住沿途营地或旅馆。",
      weightRange: "5-8kg",
      timeReduction: "30-50%",
    },
    {
      name: "重装露营",
      distance: "100km",
      duration: "5天",
      altitude: "957m",
      difficulty: "中等",
      description: "香港最著名的远足径，全长100公里，横跨新界东西。沿途可欣赏壮丽的海岸线、清澈的水库和翠绿的山峦。自带帐篷，沿途营地露营。",
      weightRange: "12-15kg",
      timeReduction: "按建议天数",
    },
    {
      name: "越野跑",
      distance: "100km",
      duration: "2天",
      altitude: "957m",
      difficulty: "困难",
      description: "香港最著名的远足径，全长100公里，横跨新界东西。沿途可欣赏壮丽的海岸线、清澈的水库和翠绿的山峦。分两天完成，挑战速度极限。",
      weightRange: "3-5kg",
      timeReduction: "60-70%",
    },
  ],
};

// 贡嘎大环线
const gonggaRoute: Route = {
  id: "gongga",
  name: "贡嘎大环线",
  province: "四川",
  location: "甘孜藏族自治州",
  mountainRange: "大雪山脉",
  image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
  coordinates: { lat: 29.6, lng: 101.9 },
  styles: [
    {
      name: "重装露营",
      distance: "120km",
      duration: "8天",
      altitude: "4900m",
      difficulty: "困难",
      description: "贡嘎雪山是四川最高峰，海拔7556米。大环线围绕贡嘎主峰，穿越原始森林、高山草甸和冰川，是徒步者的终极挑战。",
      weightRange: "18-25kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 虎跳峡高路
const tigerLeapingRoute: Route = {
  id: "tiger-leaping",
  name: "虎跳峡高路",
  province: "云南",
  location: "丽江与香格里拉交界",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 27.2, lng: 100.1 },
  styles: [
    {
      name: "轻装速穿",
      distance: "22km",
      duration: "2天",
      altitude: "2670m",
      difficulty: "中等",
      description: "世界最深的峡谷之一，金沙江在此急转直下。高路徒步可俯瞰整个峡谷，感受大自然的鬼斧神工。住沿途客栈。",
      weightRange: "3-6kg",
      timeReduction: "30-50%",
    },
    {
      name: "越野跑",
      distance: "22km",
      duration: "6小时",
      altitude: "2670m",
      difficulty: "困难",
      description: "世界最深的峡谷之一，金沙江在此急转直下。高路徒步可俯瞰整个峡谷，感受大自然的鬼斧神工。一日速穿，挑战速度。",
      weightRange: "2-4kg",
      timeReduction: "60-70%",
    },
  ],
};

// 鳌太穿越
const aitaobaoRoute: Route = {
  id: "aitaobao",
  name: "鳌太穿越",
  province: "陕西",
  location: "宝鸡至太白",
  mountainRange: "秦岭",
  image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&q=80",
  coordinates: { lat: 33.9, lng: 107.7 },
  styles: [
    {
      name: "重装露营",
      distance: "80km",
      duration: "5天",
      altitude: "3767m",
      difficulty: "困难",
      description: "秦岭最经典的穿越路线，从鳌山到太白山。沿途石海、杜鹃、云海交替出现，是中国十大经典徒步路线之一。",
      weightRange: "15-20kg",
      timeReduction: "按建议天数",
    },
  ],
};

// 黄山
const huangshanRoute: Route = {
  id: "huangshan",
  name: "黄山",
  province: "安徽",
  location: "黄山市",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  coordinates: { lat: 30.1, lng: 118.2 },
  styles: [
    {
      name: "轻装速穿",
      distance: "30km",
      duration: "2天",
      altitude: "1864m",
      difficulty: "中等",
      description: "黄山以奇松、怪石、云海、温泉、冬雪「五绝」著称于世，拥有「天下第一奇山」之称。住山顶酒店。",
      weightRange: "3-5kg",
      timeReduction: "30-50%",
    },
  ],
};

// 张家界
const zhangjiajieRoute: Route = {
  id: "zhangjiajie",
  name: "张家界",
  province: "湖南",
  location: "张家界市",
  image: "https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=1920&q=80",
  coordinates: { lat: 29.3, lng: 110.5 },
  styles: [
    {
      name: "轻装速穿",
      distance: "40km",
      duration: "3天",
      altitude: "1262m",
      difficulty: "中等",
      description: "张家界国家森林公园以独特的石英砂岩峰林地貌闻名，电影《阿凡达》的取景地。住景区酒店。",
      weightRange: "3-6kg",
      timeReduction: "30-50%",
    },
  ],
};

// 峨眉山
const emeishanRoute: Route = {
  id: "emeishan",
  name: "峨眉山",
  province: "四川",
  location: "乐山市",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  coordinates: { lat: 29.5, lng: 103.3 },
  styles: [
    {
      name: "轻装速穿",
      distance: "50km",
      duration: "2天",
      altitude: "3099m",
      difficulty: "中等",
      description: "峨眉山是中国四大佛教名山之一，以雄秀奇险的自然风光和深厚的佛教文化著称。住沿途寺庙或酒店。",
      weightRange: "3-6kg",
      timeReduction: "30-50%",
    },
  ],
};

// 华山
const huashanRoute: Route = {
  id: "huashan",
  name: "华山",
  province: "陕西",
  location: "渭南市",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
  coordinates: { lat: 34.5, lng: 110.1 },
  styles: [
    {
      name: "轻装速穿",
      distance: "25km",
      duration: "2天",
      altitude: "2155m",
      difficulty: "困难",
      description: "华山以「险」著称，是五岳之一。长空栈道、鹞子翻身等景点考验着每一位登山者的勇气。住山顶酒店。",
      weightRange: "3-6kg",
      timeReduction: "30-50%",
    },
  ],
};

// 泰山
const taishanRoute: Route = {
  id: "taishan",
  name: "泰山",
  province: "山东",
  location: "泰安市",
  image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  coordinates: { lat: 36.3, lng: 117.1 },
  styles: [
    {
      name: "轻装速穿",
      distance: "20km",
      duration: "1天",
      altitude: "1545m",
      difficulty: "简单",
      description: "泰山是五岳之首，自古以来就是帝王封禅之地。日出、云海、晚霞是泰山三大奇观。一日往返，适合新手。",
      weightRange: "2-4kg",
      timeReduction: "60-70%",
    },
  ],
};

export const routes: Route[] = [
  wugongRoute,
  kailashRoute,
  maclehoseRoute,
  gonggaRoute,
  tigerLeapingRoute,
  aitaobaoRoute,
  huangshanRoute,
  zhangjiajieRoute,
  emeishanRoute,
  huashanRoute,
  taishanRoute,
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
