const fs = require('fs');
const path = require('path');

// 读取路线数据文件
const routesPath = path.join(__dirname, '../src/data/routes.ts');
let content = fs.readFileSync(routesPath, 'utf8');

// 删除错误位置的 coordinates（在 location 和 mountainRange 之间的）
content = content.replace(
  /(\s+location: "[^"]+",)\s*\n\s*coordinates: \{[^}]+\},\s*\n(\s+mountainRange:)/g,
  '$1\n$2'
);

// 写入文件
fs.writeFileSync(routesPath, content, 'utf8');

console.log('坐标修复完成！');
