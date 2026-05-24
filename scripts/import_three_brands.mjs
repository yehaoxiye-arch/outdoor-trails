/**
 * 导入脚本：删除凯乐石/迪卡侬/拓路者旧数据，从 Excel 导入新产品
 *
 * 用法: node scripts/import_three_brands.mjs
 */

import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

const EXCEL_PATH = 'C:\\Users\\Simon\\Documents\\Codex\\2026-05-18\\files-mentioned-by-the-user-2\\户外品牌产品数据_更新版_已填商品图链接.xlsx';
const PRODUCTS_PATH = path.resolve('src/data/products.ts');

// 要删除的品牌（products.ts 中的 brand 值，中文）
const BRANDS_TO_REMOVE = new Set(['凯乐石', '迪卡侬', '拓路者']);

// 品类映射：Excel 大品类/小品类 → ProductCategory + array name
function mapCategory(大品类, 小品类) {
  if (大品类 === '鞋类') {
    return { category: 'footwear', array: 'footwearProducts' };
  }
  if (大品类 === '服饰类') {
    if (小品类 === '冲锋衣(硬壳)') return { category: 'outer-layer', array: 'outerlayerProducts' };
    if (小品类 === '软壳') return { category: 'mid-layer', array: 'midlayerProducts' };
    if (小品类 === '抓绒衣') return { category: 'mid-layer', array: 'midlayerProducts' };
    if (小品类 === '羽绒衣') return { category: 'mid-layer', array: 'midlayerProducts' };
    if (小品类 === '硬壳裤') return { category: 'outer-layer', array: 'outerlayerProducts', garmentType: 'bottom' };
    if (小品类 === '软壳裤') return { category: 'outer-layer', array: 'outerlayerProducts', garmentType: 'bottom' };
    if (小品类 === '防晒衣') return { category: 'sun-protection', array: 'sunprotectionProducts' };
    if (小品类 === '速干衣') return { category: 'base-layer', array: 'baselayerProducts' };
    if (小品类 === '速干裤') return { category: 'base-layer', array: 'baselayerProducts', garmentType: 'bottom' };
    return { category: 'mid-layer', array: 'midlayerProducts' };
  }
  if (大品类 === '装备类') {
    if (小品类 === '帐篷') return { category: 'tent', array: 'tentProducts' };
    if (小品类 === '背包') return { category: 'backpack', array: 'backpackProducts' };
    if (小品类 === '睡袋') return { category: 'sleeping', array: 'sleepingProducts' };
  }
  console.warn(`未知品类: ${大品类}/${小品类}`);
  return null;
}

// 生成产品 ID（kebab-case）
function generateId(brand, name, model) {
  const brandSlug = {
    '凯乐石': 'kailas',
    '迪卡侬': 'decathlon',
    '拓路者': 'pioneer-camp',
  }[brand] || brand.toLowerCase();

  let raw = (model || name || '');
  const engParts = raw.match(/[a-zA-Z0-9]+/g);
  let slug = engParts ? engParts.join('-').toLowerCase() : '';

  if (slug.length < 3) {
    slug = raw
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  return `${brandSlug}-${slug}`;
}

// 解析重量
function parseWeight(weightStr) {
  if (!weightStr) return 0;
  const match = String(weightStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// 解析价格
function parsePrice(price) {
  if (!price) return 0;
  const num = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : Math.round(num);
}

// 解析温度范围
function parseTempRange(str) {
  if (!str) return { min: -10, max: 30 };
  const nums = String(str).match(/-?\d+/g);
  if (nums && nums.length >= 2) {
    return { min: parseInt(nums[0]), max: parseInt(nums[1]) };
  }
  return { min: -10, max: 30 };
}

function inferWaterproof(大品类, 小品类, 关键技术参数) {
  const text = String(关键技术参数 || '').toLowerCase();
  if (text.includes('gore-tex') || text.includes('防水') || text.includes('waterproof')) return true;
  if (小品类 === '冲锋衣(硬壳)' || 小品类 === '硬壳裤') return true;
  if (小品类 === '越野跑鞋' && text.includes('gtx')) return true;
  return false;
}

function inferWindproof(小品类, 关键技术参数) {
  const text = String(关键技术参数 || '');
  if (text.includes('防风') || text.includes('windproof')) return true;
  if (['软壳', '软壳裤', '冲锋衣(硬壳)', '硬壳裤'].includes(小品类)) return true;
  return false;
}

function inferWarmthLevel(小品类) {
  if (小品类 === '羽绒衣') return 4;
  if (小品类 === '抓绒衣') return 3;
  if (小品类 === '软壳' || 小品类 === '软壳裤') return 3;
  if (小品类 === '冲锋衣(硬壳)') return 3;
  if (小品类 === '硬壳裤') return 3;
  if (小品类 === '防晒衣') return 1;
  if (小品类 === '速干衣' || 小品类 === '速干裤') return 1;
  return 2;
}

function inferBreathability(小品类, 关键技术参数) {
  const text = String(关键技术参数 || '');
  if (text.includes('透气') && (text.includes('高') || text.includes('极'))) return 'high';
  if (小品类 === '速干衣' || 小品类 === '速干裤' || 小品类 === '防晒衣') return 'high';
  if (小品类 === '冲锋衣(硬壳)' || 小品类 === '硬壳裤') return 'low';
  if (小品类 === '软壳' || 小品类 === '软壳裤') return 'medium';
  return 'medium';
}

function inferMaterial(材质, 小品类) {
  if (材质) return String(材质);
  if (小品类 === '冲锋衣(硬壳)' || 小品类 === '硬壳裤') return 'GORE-TEX';
  if (小品类 === '软壳' || 小品类 === '软壳裤') return '软壳面料';
  if (小品类 === '抓绒衣') return '摇粒绒';
  if (小品类 === '羽绒衣') return '鹅绒/鸭绒';
  return '合成纤维';
}

function inferScenarios(适用场景, 小品类) {
  if (适用场景) {
    return String(适用场景).split(/[,，/、]/).map(s => s.trim()).filter(Boolean);
  }
  if (['越野跑鞋'].includes(小品类)) return ['越野跑', '徒步'];
  if (['登山鞋'].includes(小品类)) return ['登山', '徒步'];
  if (['帐篷'].includes(小品类)) return ['露营', '徒步'];
  if (['背包'].includes(小品类)) return ['徒步', '登山'];
  if (['睡袋'].includes(小品类)) return ['露营', '徒步'];
  return ['徒步'];
}

function inferAnkleSupport(小品类, 产品名称) {
  const name = String(产品名称 || '').toLowerCase();
  if (小品类 === '登山鞋') return 'high';
  if (name.includes('mid') || name.includes('中帮')) return 'mid';
  if (name.includes('high') || name.includes('高帮')) return 'high';
  return 'low';
}

function inferTerrain(小品类) {
  if (小品类 === '越野跑鞋') return ['越野跑', '技术地形'];
  if (小品类 === '登山鞋') return ['技术型徒步', '混合地形', '岩石'];
  return ['全地形徒步', '混合地形'];
}

function inferSoleType(关键技术参数) {
  const text = String(关键技术参数 || '');
  if (text.includes('vibram')) return 'Vibram橡胶';
  if (text.includes('contagrip')) return 'Contagrip橡胶';
  return '橡胶大底';
}

function buildClothingSpecs(row, catInfo) {
  return {
    material: inferMaterial(row['材质'], row['小品类']),
    warmthLevel: inferWarmthLevel(row['小品类']),
    breathability: inferBreathability(row['小品类'], row['关键技术参数']),
    weight: parseWeight(row['重量']),
    windproof: inferWindproof(row['小品类'], row['关键技术参数']),
    waterproof: inferWaterproof(row['大品类'], row['小品类'], row['关键技术参数']),
    temperatureRange: parseTempRange(row['关键技术参数']),
    ...(catInfo.garmentType ? { garmentType: catInfo.garmentType } : {}),
    ...(row['小品类'] === '速干裤' || row['小品类'] === '软壳裤' || row['小品类'] === '硬壳裤'
      ? { pantsType: 'long' } : {}),
  };
}

function buildFootwearSpecs(row) {
  return {
    weight: parseWeight(row['重量']),
    waterproof: inferWaterproof(row['大品类'], row['小品类'], row['关键技术参数']),
    waterproofRating: inferWaterproof(row['大品类'], row['小品类'], row['关键技术参数'])
      ? (row['防水指数'] || '防水透气膜')
      : undefined,
    temperatureRange: parseTempRange(row['关键技术参数']),
    soleType: inferSoleType(row['关键技术参数']),
    ankleSupport: inferAnkleSupport(row['小品类'], row['产品名称']),
    terrain: inferTerrain(row['小品类']),
  };
}

function buildTentSpecs(row) {
  return {
    capacity: 2,
    weight: parseWeight(row['重量']),
    waterproof: true,
    waterproofRating: String(row['防水指数'] || '3000mm'),
    seasonRating: '3-season',
    material: String(row['材质'] || '尼龙'),
  };
}

function buildBackpackSpecs(row) {
  const weight = parseWeight(row['重量']);
  const text = String(row['关键技术参数'] || '');
  const volMatch = text.match(/(\d+)\s*[lL升]/);
  const volume = volMatch ? parseInt(volMatch[1]) : (weight > 1500 ? 50 : 30);
  return {
    volume,
    weight,
    frameType: volume > 40 ? 'internal' : 'none',
    hipBelt: volume > 35,
    rainCover: text.includes('防雨') || text.includes('雨罩'),
  };
}

function buildSleepingSpecs(row) {
  const text = String(row['关键技术参数'] || '');
  const tempMatch = text.match(/(-?\d+)\s*[°℃]/);
  const tempRating = tempMatch ? parseInt(tempMatch[1]) : 0;
  return {
    temperatureRating: tempRating,
    weight: parseWeight(row['重量']),
    fillType: text.includes('鹅绒') || text.includes('鸭绒') ? 'down' : 'synthetic',
    packedSize: '压缩收纳袋',
  };
}

function buildSpecs(row, catInfo) {
  switch (catInfo.category) {
    case 'footwear': return buildFootwearSpecs(row);
    case 'tent': return buildTentSpecs(row);
    case 'backpack': return buildBackpackSpecs(row);
    case 'sleeping': return buildSleepingSpecs(row);
    default: return buildClothingSpecs(row, catInfo);
  }
}

// 将产品对象转为 TypeScript 对象字面量格式
function productToTS(p, indent = 4) {
  const pad = ' '.repeat(indent);
  const pad2 = ' '.repeat(indent + 2);
  const pad3 = ' '.repeat(indent + 4);
  const pad4 = ' '.repeat(indent + 6);

  let lines = [];
  lines.push(`${pad}{`);
  lines.push(`${pad2}id: "${p.id}",`);
  lines.push(`${pad2}name: "${p.name}",`);
  lines.push(`${pad2}brand: "${p.brand}",`);
  lines.push(`${pad2}category: "${p.category}",`);
  lines.push(`${pad2}image: "${p.image}",`);

  // specs
  lines.push(`${pad2}specs: {`);
  const specs = p.specs;
  const specKeys = Object.keys(specs).filter(k => specs[k] !== undefined);
  for (let i = 0; i < specKeys.length; i++) {
    const key = specKeys[i];
    const val = specs[key];
    const comma = i < specKeys.length - 1 ? ',' : '';
    if (typeof val === 'string') {
      lines.push(`${pad3}${key}: "${val}"${comma}`);
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      lines.push(`${pad3}${key}: ${val}${comma}`);
    } else if (Array.isArray(val)) {
      lines.push(`${pad3}${key}: [${val.map(v => `"${v}"`).join(', ')}]${comma}`);
    } else if (typeof val === 'object' && val !== null) {
      const entries = Object.entries(val);
      const inner = entries.map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`).join(', ');
      lines.push(`${pad3}${key}: {${inner}}${comma}`);
    }
  }
  lines.push(`${pad2}},`);

  // scenarios
  lines.push(`${pad2}scenarios: [${p.scenarios.map(s => `"${s}"`).join(', ')}],`);

  // price
  lines.push(`${pad2}price: ${p.price},`);
  lines.push(`${pad}},`);

  return lines.join('\n');
}

// 读取 Excel 单元格值，处理超链接对象
function getCellText(cell) {
  if (!cell || cell.value === null || cell.value === undefined) return '';
  // 超链接对象 {text, hyperlink}
  if (typeof cell.value === 'object' && cell.value.text !== undefined) {
    return String(cell.value.text).trim();
  }
  return String(cell.value).trim();
}

async function main() {
  console.log('=== 开始导入 ===\n');

  // 1. 读取 Excel
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const newProducts = [];

  for (const sheet of workbook.worksheets) {
    const brandCn = sheet.name;
    if (!BRANDS_TO_REMOVE.has(brandCn)) {
      console.log(`跳过未知品牌 sheet: ${brandCn}`);
      continue;
    }

    console.log(`读取 sheet: ${brandCn}`);

    const headers = [];
    sheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber] = String(cell.value).trim();
    });

    for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
      const row = sheet.getRow(rowNum);
      if (!row || row.cellCount === 0) continue;

      const data = {};
      row.eachCell((cell, colNumber) => {
        const key = headers[colNumber];
        if (key) data[key] = getCellText(cell);
      });

      // 也读取没有 eachCell 遍历到的空单元格
      for (let col = 1; col <= row.cellCount; col++) {
        if (!headers[col]) continue;
        if (!(headers[col] in data)) {
          data[headers[col]] = getCellText(row.getCell(col));
        }
      }

      if (!data['产品名称'] && !data['产品型号']) continue;

      const catInfo = mapCategory(data['大品类'], data['小品类']);
      if (!catInfo) {
        console.warn(`  跳过: ${data['产品名称']} (未知品类: ${data['大品类']}/${data['小品类']})`);
        continue;
      }

      const product = {
        id: generateId(brandCn, data['产品名称'], data['产品型号']),
        name: String(data['产品名称'] || data['产品型号'] || '').trim(),
        brand: brandCn,
        category: catInfo.category,
        image: data['商品图链接'] || '',
        specs: buildSpecs(data, catInfo),
        scenarios: inferScenarios(data['适用场景'], data['小品类']),
        price: parsePrice(data['官方售价']),
      };

      newProducts.push({ array: catInfo.array, product });
      console.log(`  ✓ ${product.name} → ${catInfo.category}`);
    }
  }

  console.log(`\n共读取 ${newProducts.length} 个产品\n`);

  // 2. 读取 products.ts
  let content = fs.readFileSync(PRODUCTS_PATH, 'utf-8');
  const lines = content.split('\n');

  // 3. 删除旧产品
  console.log('删除旧产品...');
  const deleteRanges = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const brand of BRANDS_TO_REMOVE) {
      if (line.includes(`brand: "${brand}"`)) {
        let start = i;
        while (start > 0 && !lines[start].trimStart().startsWith('{')) {
          start--;
        }
        let end = i;
        let braceCount = 0;
        for (let j = start; j < lines.length; j++) {
          for (const ch of lines[j]) {
            if (ch === '{') braceCount++;
            if (ch === '}') braceCount--;
          }
          if (braceCount === 0) {
            end = j;
            break;
          }
        }
        if (end + 1 < lines.length && lines[end + 1].trim() === ',') {
          end++;
        }
        deleteRanges.push([start, end]);
        break;
      }
    }
  }

  deleteRanges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const range of deleteRanges) {
    if (merged.length > 0 && range[0] <= merged[merged.length - 1][1] + 1) {
      merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], range[1]);
    } else {
      merged.push([...range]);
    }
  }

  for (let i = merged.length - 1; i >= 0; i--) {
    const [start, end] = merged[i];
    lines.splice(start, end - start + 1);
  }

  console.log(`  共删除 ${deleteRanges.length} 个旧产品\n`);
  content = lines.join('\n');

  // 4. 插入新产品
  console.log('插入新产品...');

  const byArray = {};
  for (const { array, product } of newProducts) {
    if (!byArray[array]) byArray[array] = [];
    byArray[array].push(product);
  }

  for (const [arrayName, products] of Object.entries(byArray)) {
    const constPattern = `const ${arrayName}: Product[] = [`;
    const constIdx = content.indexOf(constPattern);
    if (constIdx === -1) {
      console.warn(`  未找到数组: ${arrayName}，跳过`);
      continue;
    }

    // 找到 "= [" 之后的位置（跳过类型注释中的 []）
    const eqBracketIdx = content.indexOf('= [', constIdx);
    if (eqBracketIdx === -1) {
      console.warn(`  未找到数组开头: ${arrayName}，跳过`);
      continue;
    }
    const arrayStart = eqBracketIdx + 3; // 跳过 "= ["

    // 从 arrayStart 开始找匹配的 ]
    let braceCount = 1;
    let endIdx = arrayStart;
    for (let i = arrayStart; i < content.length; i++) {
      if (content[i] === '[') braceCount++;
      if (content[i] === ']') {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }

    let insertStr = '\n';
    for (const p of products) {
      insertStr += productToTS(p) + '\n';
    }

    content = content.slice(0, endIdx) + insertStr + content.slice(endIdx);
    console.log(`  插入 ${products.length} 个产品到 ${arrayName}`);
  }

  // 5. 写回文件
  fs.writeFileSync(PRODUCTS_PATH, content, 'utf-8');
  console.log('\n✅ products.ts 已更新');
}

main().catch(err => {
  console.error('错误:', err);
  process.exit(1);
});
