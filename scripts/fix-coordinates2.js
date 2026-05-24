const fs = require('fs');
const path = require('path');

// 读取路线数据文件
const routesPath = path.join(__dirname, '../src/data/routes.ts');
let content = fs.readFileSync(routesPath, 'utf8');

// 删除错误位置的 coordinates（在 location 行末尾的）
// 匹配模式：location: "...",    coordinates: {...},    mountainRange:
content = content.replace(
  /(location: "[^"]+",)\s+coordinates: \{[^}]+\},\s+(mountainRange:)/g,
  '$1\n    $2'
);

// 删除重复的 coordinates（在 image2 行后面、styles 行前面的）
content = content.replace(
  /(image2: "[^"]+",)\s*\n\s*coordinates: \{[^}]+\},\s*\n(\s+styles:)/g,
  '$1\n$2'
);

// 写入文件
fs.writeFileSync(routesPath, content, 'utf8');

console.log('坐标修复完成！');
