// scripts/download-brand-logos.js
const fs = require('fs');
const path = require('path');

const BRANDS = [
  { name: 'salomon', search: 'Salomon logo png' },
  { name: 'merrell', search: 'Merrell shoes logo png' },
  { name: 'hoka', search: 'HOKA ONE ONE logo png' },
  { name: 'arcteryx', search: "Arc'teryx logo png" },
  { name: 'patagonia', search: 'Patagonia logo png' },
  { name: 'tnf', search: 'The North Face logo png' },
  { name: 'osprey', search: 'Osprey packs logo png' },
  { name: 'gregory', search: 'Gregory packs logo png' },
  { name: 'msr', search: 'MSR outdoor logo png' },
  { name: 'bigagnes', search: 'Big Agnes logo png' },
  { name: 'naturehike', search: 'Naturehike logo png' },
  { name: 'wm', search: 'Western Mountaineering logo png' },
  { name: 'marmot', search: 'Marmot outdoor logo png' },
  { name: 'thermarest', search: 'Therm-a-Rest logo png' },
  { name: 'bd', search: 'Black Diamond equipment logo png' },
  { name: 'leki', search: 'LEKI poles logo png' },
  { name: 'petzl', search: 'Petzl logo png' },
  { name: 'garmin', search: 'Garmin logo png' },
  { name: 'decathlon', search: 'Decathlon logo png' },
  { name: 'columbia', search: 'Columbia sportswear logo png' },
  { name: 'montbell', search: 'Montbell logo png' },
  { name: 'nemo', search: 'NEMO equipment logo png' },
  { name: 'snowpeak', search: 'Snow Peak logo png' },
  { name: 'toaks', search: 'TOAKS outdoor logo png' },
  { name: 'platypus', search: 'Platypus logo png' },
  { name: 'sawyer', search: 'Sawyer products logo png' },
  { name: 'jetboil', search: 'Jetboil logo png' },
  { name: 'soto', search: 'SOTO outdoors logo png' },
  { name: 'fjallraven', search: 'Fjallraven logo png' },
  { name: 'prana', search: 'Prana logo png' },
  { name: '2xu', search: '2XU logo png' },
  { name: 'keen', search: 'KEEN shoes logo png' },
  { name: 'hilleberg', search: 'Hilleberg tents logo png' },
  { name: 'granitegear', search: 'Granite Gear logo png' },
  { name: 'julbo', search: 'Julbo eyewear logo png' },
  { name: 'darntough', search: 'Darn Tough socks logo png' },
  { name: 'sundayafternoons', search: 'Sunday Afternoons logo png' },
  { name: 'or', search: 'Outdoor Research logo png' },
  { name: 'buff', search: 'Buff headwear logo png' },
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'brands');

// 确保目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('品牌Logo下载脚本');
console.log('注意：此脚本需要手动搜索并下载Logo');
console.log('请访问各品牌官网或Wikipedia获取高质量Logo');
console.log(`输出目录: ${OUTPUT_DIR}`);
console.log(`需要下载 ${BRANDS.length} 个品牌Logo`);

// 生成品牌列表文件
const listContent = BRANDS.map(b => `${b.name}: ${b.search}`).join('\n');
fs.writeFileSync(path.join(OUTPUT_DIR, '_download-list.txt'), listContent);
console.log('已生成下载列表: _download-list.txt');
