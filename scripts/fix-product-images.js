const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'src', 'data', 'products.ts');
const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');

const HOTLINK_PATTERNS = [
  /img\.alicdn\.com/g,
  /cbu01\.alicdn\.com/g,
  /img14\.360buyimg\.com/g,
  /gd-hbimg\.huaban\.com/g,
  /imgservice\.suning\.cn/g,
  /cdn\.sportmaster\.ru/g,
  /ir\.ozone\.ru/g,
  /contents\.mediadecathlon\.com/g,
  /www\.decathlon\.com/g,
  /geartrade\.com/g,
];

console.log('扫描防盗链图片...\n');

const lines = content.split('\n');
const issues = [];

lines.forEach((line, index) => {
  for (const pattern of HOTLINK_PATTERNS) {
    // Reset regex lastIndex since we use global flag
    pattern.lastIndex = 0;
    if (pattern.test(line)) {
      issues.push({
        line: index + 1,
        content: line.trim().substring(0, 150),
        domain: pattern.source,
      });
    }
  }
});

console.log(`发现 ${issues.length} 处防盗链图片:\n`);
issues.forEach(issue => {
  console.log(`行 ${issue.line}: ${issue.domain}`);
  console.log(`  ${issue.content}`);
});

const outputPath = path.join(__dirname, 'hotlink-issues.json');
fs.writeFileSync(outputPath, JSON.stringify(issues, null, 2));
console.log(`\n已导出到: ${outputPath}`);
