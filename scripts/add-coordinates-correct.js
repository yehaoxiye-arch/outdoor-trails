const fs = require('fs');
const path = require('path');

// 读取路线数据文件
const routesPath = path.join(__dirname, '../src/data/routes.ts');
let content = fs.readFileSync(routesPath, 'utf8');

// 坐标映射（根据location）
const coordinatesMap = {
  // 武功山地区
  '萍乡市 · 芦溪县': { lat: 27.45, lng: 114.18 },
  '萍乡/吉安/宜春 · 芦溪/安福/袁州': { lat: 27.45, lng: 114.18 },
  '吉安市 · 安福县': { lat: 27.40, lng: 114.25 },

  // 上饶地区
  '上饶市 · 铅山县': { lat: 27.85, lng: 117.75 },
  '上饶市 · 广信区': { lat: 28.45, lng: 117.90 },
  '上饶市 · 婺源县': { lat: 29.25, lng: 117.85 },
  '上饶市 · 玉山县': { lat: 28.68, lng: 118.25 },

  // 赣州地区
  '赣州市 · 崇义县': { lat: 25.68, lng: 114.30 },
  '赣州市 · 崇义/上犹': { lat: 25.68, lng: 114.30 },
  '赣州市 · 上犹县': { lat: 25.78, lng: 114.55 },
  '赣州市 · 信丰县': { lat: 25.38, lng: 114.92 },
  '赣州市 · 于都县': { lat: 25.95, lng: 115.42 },
  '赣州市 · 遂川县': { lat: 26.32, lng: 114.52 },
  '赣州市 · 龙南市': { lat: 24.90, lng: 114.80 },
  '赣州市 · 章贡区': { lat: 25.82, lng: 114.93 },

  // 吉安地区
  '吉安市 · 井冈山市': { lat: 26.58, lng: 114.15 },
  '吉安市 · 遂川县': { lat: 26.32, lng: 114.52 },

  // 宜春地区
  '宜春市 · 靖安县': { lat: 28.85, lng: 115.35 },

  // 抚州地区
  '抚州市 · 南丰县': { lat: 27.22, lng: 116.52 },

  // 南昌地区
  '南昌市 · 湾里区': { lat: 28.72, lng: 115.78 },

  // 九江地区
  '九江市 · 庐山市': { lat: 29.55, lng: 115.98 },

  // 景德镇地区
  '景德镇市 · 浮梁县': { lat: 29.35, lng: 117.25 },
};

// 在 image2 字段后添加 coordinates
for (const [location, coords] of Object.entries(coordinatesMap)) {
  // 匹配 location 字段后面直到 image2 字段的模式
  const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(location: "${escapedLocation}",[\\s\\S]*?image2: "[^"]+",)\\n`,
    'g'
  );
  content = content.replace(regex, `$1\n    coordinates: { lat: ${coords.lat}, lng: ${coords.lng } },\n`);
}

// 写入文件
fs.writeFileSync(routesPath, content, 'utf8');

console.log('坐标添加完成！');
