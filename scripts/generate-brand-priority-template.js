const ExcelJS = require('exceljs');
const path = require('path');

const categories = [
  { id: 'footwear', name: '鞋类', icon: '🥾' },
  { id: 'base-layer', name: '基础层', icon: '👕' },
  { id: 'mid-layer', name: '保暖层', icon: '🧥' },
  { id: 'outer-layer', name: '防护层（冲锋衣）', icon: '🧥' },
  { id: 'rain-gear', name: '雨具', icon: '🌧️' },
  { id: 'sun-protection', name: '防晒', icon: '☀️' },
  { id: 'backpack', name: '背包', icon: '🎒' },
  { id: 'tent', name: '帐篷', icon: '⛺' },
  { id: 'sleeping', name: '睡眠系统', icon: '🛏️' },
  { id: 'trekking-poles', name: '登山杖', icon: '🏔️' },
  { id: 'cooking', name: '炊具', icon: '🍳' },
  { id: 'navigation', name: '导航', icon: '🧭' },
  { id: 'snow-gear', name: '雪地装备', icon: '❄️' },
  { id: 'lighting', name: '照明', icon: '🔦' },
  { id: 'emergency', name: '应急', icon: '🆘' },
  { id: 'hydration', name: '水系统', icon: '💧' },
];

// 条件组合
const conditions = [
  { label: '高海拔 + 多日 + 长距离 + 寒冷', altitude: 'high', duration: 'multi', distance: 'long', weather: 'cold' },
  { label: '高海拔 + 多日 + 长距离 + 多雨', altitude: 'high', duration: 'multi', distance: 'long', weather: 'rain' },
  { label: '高海拔 + 多日 + 长距离 + 正常', altitude: 'high', duration: 'multi', distance: 'long', weather: 'normal' },
  { label: '高海拔 + 单日 + 寒冷', altitude: 'high', duration: 'single', weather: 'cold' },
  { label: '高海拔 + 单日 + 正常', altitude: 'high', duration: 'single', weather: 'normal' },
  { label: '低海拔 + 多日 + 长距离 + 多雨', altitude: 'low', duration: 'multi', distance: 'long', weather: 'rain' },
  { label: '低海拔 + 多日 + 长距离 + 正常', altitude: 'low', duration: 'multi', distance: 'long', weather: 'normal' },
  { label: '低海拔 + 多日 + 短距离 + 正常', altitude: 'low', duration: 'multi', distance: 'short', weather: 'normal' },
  { label: '低海拔 + 单日 + 长距离 + 正常', altitude: 'low', duration: 'single', distance: 'long', weather: 'normal' },
  { label: '低海拔 + 单日 + 短距离 + 正常', altitude: 'low', duration: 'single', distance: 'short', weather: 'normal' },
  { label: '默认兜底（其他情况）', altitude: '', duration: '', distance: '', weather: '' },
];

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = '径迹';
  wb.created = new Date();

  // === 说明 Sheet ===
  const introSheet = wb.addWorksheet('填写说明', { properties: { tabColor: { argb: '22C55E' } } });
  introSheet.getColumn(1).width = 80;
  introSheet.addRow(['径迹装备推荐 — 品牌优先级配置模板']);
  introSheet.addRow([]);
  introSheet.addRow(['每个品类一个 Sheet，请在各 Sheet 中填写品牌排序。']);
  introSheet.addRow([]);
  introSheet.addRow(['填写规则：']);
  introSheet.addRow(['1. 每行代表一个条件组合，按从上到下的优先级匹配（第一个匹配的生效）']);
  introSheet.addRow(['2. 品牌列从左到右填写，排在前面的优先展示']);
  introSheet.addRow(['3. 每个条件组合填 5-8 个品牌，多余的可不填']);
  introSheet.addRow(['4. "默认兜底"行必须填写，作为没有匹配到其他条件时的结果']);
  introSheet.addRow(['5. 品牌名称必须与数据库中一致（区分大小写）']);
  introSheet.addRow([]);
  introSheet.addRow(['条件说明：']);
  introSheet.addRow(['  海拔：高海拔 = >3500m，低海拔 = ≤3500m']);
  introSheet.addRow(['  时长：单日 = 1天行程，多日 = 2天及以上']);
  introSheet.addRow(['  距离：长距离 = >20km，短距离 = ≤20km']);
  introSheet.addRow(['  天气：寒冷 = 最低温<5°C，多雨 = 降水概率>50%，正常 = 其他']);
  introSheet.addRow([]);
  introSheet.addRow(['数据库中已有的品牌参考：']);
  introSheet.addRow(['迪卡侬、黑冰、凯乐石、牧高笛、探路者、拓路者、Osprey、挪客、始祖鸟、']);
  introSheet.addRow(['Salomon、The North Face、Gregory、Black Diamond、骆驼喜马拉雅、Patagonia、']);
  introSheet.addRow(['伯希和、三峰出、Marmot、MSR、LEKI、骆驼、天石、HOKA、Deuter、Columbia、']);
  introSheet.addRow(['静星、猛犸象、Ultimate Direction、Sea to Summit、Hilleberg、Big Agnes等']);

  introSheet.getRow(1).font = { bold: true, size: 16 };
  introSheet.getRow(5).font = { bold: true, size: 12 };

  // === 每个品类一个 Sheet ===
  for (const cat of categories) {
    const ws = wb.addWorksheet(`${cat.icon} ${cat.name}`, {
      properties: { tabColor: { argb: 'E8F5E9' } },
    });

    // 列宽
    ws.getColumn(1).width = 40;  // 条件组合
    for (let i = 2; i <= 9; i++) {
      ws.getColumn(i).width = 18;  // 品牌列
    }

    // 标题行
    const headerRow = ws.addRow(['条件组合', '品牌1', '品牌2', '品牌3', '品牌4', '品牌5', '品牌6', '品牌7', '品牌8']);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '22C55E' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 28;

    // 条件行
    for (const cond of conditions) {
      const row = ws.addRow([cond.label]);
      row.height = 24;
      row.getCell(1).font = { bold: true };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0FDF4' } };

      // 品牌列浅灰背景提示
      for (let i = 2; i <= 9; i++) {
        row.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FAFAFA' } };
      }
    }

    // 默认兜底行高亮
    const lastRow = ws.lastRow;
    if (lastRow) {
      for (let i = 1; i <= 9; i++) {
        lastRow.getCell(i).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEFCE8' } };
      }
      lastRow.getCell(1).font = { bold: true, color: { argb: 'A16207' } };
    }

    // 边框
    ws.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'E5E7EB' } },
          bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
          left: { style: 'thin', color: { argb: 'E5E7EB' } },
          right: { style: 'thin', color: { argb: 'E5E7EB' } },
        };
      });
    });
  }

  const outPath = path.join('C:/Users/Simon/outdoor-trails/docs/research/品牌优先级配置模板.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log('Done:', outPath);
}

main().catch(console.error);
