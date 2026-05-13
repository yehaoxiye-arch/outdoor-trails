export interface Route {
  id: string;
  name: string;
  province: string;
  location: string;
  altitude: string;
  duration: string;
  distance: string;
  difficulty: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
}

export const routes: Route[] = [
  {
    id: "kailash",
    name: "冈仁波齐转山",
    province: "西藏",
    location: "阿里地区",
    altitude: "4688m",
    duration: "3天",
    distance: "52km",
    difficulty: "中等",
    description: "世界公认的神山，海拔4688米的卓玛拉山口是全程最高点。转山一圈可洗尽一生罪孽，是藏传佛教、印度教、苯教共同的圣地。",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1920&q=80",
    bgColor: "#1a1208",
    textColor: "#f5ecd0",
  },
  {
    id: "maclehose",
    name: "麦理浩径",
    province: "香港",
    location: "西贡万宜水库",
    altitude: "957m",
    duration: "4天",
    distance: "100km",
    difficulty: "中等",
    description: "香港最著名的远足径，全长100公里，横跨新界东西。沿途可欣赏壮丽的海岸线、清澈的水库和翠绿的山峦。",
    image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
    bgColor: "#0a1929",
    textColor: "#d8f0fa",
  },
  {
    id: "gongga",
    name: "贡嘎大环线",
    province: "四川",
    location: "甘孜藏族自治州",
    altitude: "4900m",
    duration: "8天",
    distance: "120km",
    difficulty: "困难",
    description: "贡嘎雪山是四川最高峰，海拔7556米。大环线围绕贡嘎主峰，穿越原始森林、高山草甸和冰川，是徒步者的终极挑战。",
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
    bgColor: "#0a1f0a",
    textColor: "#d8f0d8",
  },
  {
    id: "tiger-leaping",
    name: "虎跳峡高路",
    province: "云南",
    location: "丽江与香格里拉交界",
    altitude: "2670m",
    duration: "2天",
    distance: "22km",
    difficulty: "中等",
    description: "世界最深的峡谷之一，金沙江在此急转直下。高路徒步可俯瞰整个峡谷，感受大自然的鬼斧神工。",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    bgColor: "#1a3a1a",
    textColor: "#b5e0b5",
  },
  {
    id: "wugong",
    name: "武功山",
    province: "江西",
    location: "萍乡市",
    altitude: "1918m",
    duration: "2天",
    distance: "25km",
    difficulty: "简单",
    description: "华东地区最受欢迎的徒步路线之一，十万亩高山草甸绵延不绝。日出云海、星空露营，是新手入门的绝佳选择。",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    bgColor: "#1a2810",
    textColor: "#d8f0d8",
  },
  {
    id: "aitaobao",
    name: "鳌太穿越",
    province: "陕西",
    location: "宝鸡至太白",
    altitude: "3767m",
    duration: "5天",
    distance: "80km",
    difficulty: "困难",
    description: "秦岭最经典的穿越路线，从鳌山到太白山。沿途石海、杜鹃、云海交替出现，是中国十大经典徒步路线之一。",
    image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1920&q=80",
    bgColor: "#1c1917",
    textColor: "#f5f5f4",
  },
  {
    id: "huangshan",
    name: "黄山",
    province: "安徽",
    location: "黄山市",
    altitude: "1864m",
    duration: "2天",
    distance: "30km",
    difficulty: "中等",
    description: "黄山以奇松、怪石、云海、温泉、冬雪「五绝」著称于世，拥有「天下第一奇山」之称。",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
    bgColor: "#1a2810",
    textColor: "#d8f0d8",
  },
  {
    id: "zhangjiajie",
    name: "张家界",
    province: "湖南",
    location: "张家界市",
    altitude: "1262m",
    duration: "3天",
    distance: "40km",
    difficulty: "中等",
    description: "张家界国家森林公园以独特的石英砂岩峰林地貌闻名，电影《阿凡达》的取景地。",
    image: "https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=1920&q=80",
    bgColor: "#1a2810",
    textColor: "#d8f0d8",
  },
  {
    id: "emeishan",
    name: "峨眉山",
    province: "四川",
    location: "乐山市",
    altitude: "3099m",
    duration: "2天",
    distance: "50km",
    difficulty: "中等",
    description: "峨眉山是中国四大佛教名山之一，以雄秀奇险的自然风光和深厚的佛教文化著称。",
    image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
    bgColor: "#0a1f0a",
    textColor: "#d8f0d8",
  },
  {
    id: "huashan",
    name: "华山",
    province: "陕西",
    location: "渭南市",
    altitude: "2155m",
    duration: "2天",
    distance: "25km",
    difficulty: "困难",
    description: "华山以「险」著称，是五岳之一。长空栈道、鹞子翻身等景点考验着每一位登山者的勇气。",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    bgColor: "#1c1917",
    textColor: "#f5f5f4",
  },
  {
    id: "taishan",
    name: "泰山",
    province: "山东",
    location: "泰安市",
    altitude: "1545m",
    duration: "1天",
    distance: "20km",
    difficulty: "简单",
    description: "泰山是五岳之首，自古以来就是帝王封禅之地。日出、云海、晚霞是泰山三大奇观。",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    bgColor: "#1a2810",
    textColor: "#d8f0d8",
  },
];

// Get all unique provinces
export function getProvinces(): string[] {
  const provinces = new Set(routes.map((route) => route.province));
  return Array.from(provinces);
}

// Get routes by province
export function getRoutesByProvince(province: string): Route[] {
  return routes.filter((route) => route.province === province);
}

// Get route by ID
export function getRouteById(id: string): Route | undefined {
  return routes.find((route) => route.id === id);
}
