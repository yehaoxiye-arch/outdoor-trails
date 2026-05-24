const ExcelJS = require('exceljs');
const fs = require('fs');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('D:\\户外品牌产品数据_更新版.xlsx');

  const excelProducts = [];
  for (const sheet of workbook.worksheets) {
    const header = [];
    sheet.getRow(1).eachCell((cell, colNum) => { header[colNum] = cell.value; });
    for (let i = 2; i <= sheet.rowCount; i++) {
      const row = {};
      let hasData = false;
      sheet.getRow(i).eachCell((cell, colNum) => {
        row[header[colNum]] = cell.value;
        if (cell.value) hasData = true;
      });
      if (hasData && row['产品名称']) {
        excelProducts.push(row);
      }
    }
  }

  const content = fs.readFileSync('src/data/products.ts', 'utf8');
  const idRegex = /id:\s*"([^"]+)"/g;
  const existingIds = new Set();
  let m;
  while ((m = idRegex.exec(content)) !== null) {
    existingIds.add(m[1]);
  }
  const nameRegex = /name:\s*"([^"]+)"/g;
  const existingNames = new Set();
  while ((m = nameRegex.exec(content)) !== null) {
    existingNames.add(m[1]);
  }

  function mapCategory(bigCat, smallCat) {
    if (bigCat === '鞋类') return 'footwear';
    if (bigCat === '服饰类') {
      if (smallCat.includes('冲锋衣') || smallCat.includes('硬壳裤')) return 'outer-layer';
      if (smallCat.includes('软壳裤')) return 'outer-layer';
      if (smallCat.includes('软壳')) return 'mid-layer';
      if (smallCat.includes('羽绒')) return 'mid-layer';
      if (smallCat.includes('抓绒')) return 'mid-layer';
      if (smallCat.includes('防晒')) return 'sun-protection';
    }
    if (bigCat === '装备类') {
      if (smallCat.includes('帐篷')) return 'tent';
      if (smallCat.includes('背包')) return 'backpack';
      if (smallCat.includes('睡袋')) return 'sleeping';
    }
    return 'outer-layer';
  }

  function generateId(brand, model) {
    const brandMap = { '迪卡侬': 'decathlon', '凯乐石': 'kailas', '拓路者': 'toread' };
    const brandPrefix = brandMap[brand] || brand.toLowerCase();
    let cleanModel = String(model);
    cleanModel = cleanModel.replace(/^(拓路者|迪卡侬|凯乐石|QUECHUA|SIMOND|FORCLAZ|KIPRUN|KAILAS|Tribord|WEDZE)\s*/i, '');
    cleanModel = cleanModel.replace(/[\/\\:*?"<>|]/g, ' ').replace(/\s+/g, '-').toLowerCase().replace(/^-|-$/g, '');
    return brandPrefix + '-' + cleanModel;
  }

  function parseWeight(weightStr) {
    if (!weightStr) return 400;
    const s = String(weightStr);
    const match = s.match(/(\d+)/);
    return match ? parseInt(match[1]) : 400;
  }

  function parsePrice(priceStr) {
    if (!priceStr) return undefined;
    const s = String(priceStr);
    const match = s.match(/^\d+/);
    return match ? parseInt(match[0]) : undefined;
  }

  function parseWaterproof(wpStr) {
    if (!wpStr) return false;
    const s = String(wpStr);
    return !s.includes('无防水') && s !== '无';
  }

  function parseWaterproofRating(wpStr) {
    if (!wpStr) return undefined;
    const s = String(wpStr);
    if (s === '无' || s === '无防水') return undefined;
    return s;
  }

  function parseAnkleSupport(str) {
    if (!str) return 'low';
    const s = String(str).toLowerCase();
    if (s.includes('high') || s.includes('高')) return 'high';
    if (s.includes('mid') || s.includes('中')) return 'mid';
    return 'low';
  }

  function parseBreathability(str) {
    if (!str) return 'medium';
    const s = String(str);
    if (s.includes('极致') || s.includes('超') || s.includes('优秀') || s.includes('高')) return 'high';
    if (s.includes('低') || s.includes('基础')) return 'low';
    return 'medium';
  }

  function parseScenarios(str) {
    if (!str) return ['户外活动'];
    return String(str).split(/[、,，]/).map(s => s.trim()).filter(Boolean);
  }

  function parseWarmthLevel(category, material) {
    if (category === 'mid-layer') {
      if (material && (material.includes('羽绒') || material.includes('down'))) return 5;
      if (material && material.includes('加厚')) return 4;
      return 3;
    }
    return 3;
  }

  // Build new products
  const newProducts = [];
  const seenIds = new Set();
  const stats = { total: 0, new: 0, dup: 0, byCategory: {} };

  for (const p of excelProducts) {
    stats.total++;
    const category = mapCategory(p['大品类'], p['小品类']);
    let id = generateId(p['品牌'], p['产品型号'] || p['产品名称']);
    const name = p['产品名称'];

    if (existingIds.has(id) || existingNames.has(name)) {
      stats.dup++;
      continue;
    }

    if (seenIds.has(id)) {
      let suffix = 2;
      let newId = id + '-' + suffix;
      while (seenIds.has(newId) || existingIds.has(newId)) {
        suffix++;
        newId = id + '-' + suffix;
      }
      id = newId;
    }
    seenIds.add(id);

    const weight = parseWeight(p['重量']);
    const price = parsePrice(p['官方售价(元)']);
    const wp = parseWaterproof(p['防水指数']);
    const wpRating = parseWaterproofRating(p['防水指数']);
    const scenarios = parseScenarios(p['适用场景']);
    const material = p['材质'] || '';

    let specs;
    if (category === 'footwear') {
      specs = {
        weight,
        waterproof: wp,
        waterproofRating: wpRating,
        temperatureRange: { min: -5, max: 30 },
        soleType: p['关键技术参数'] || '橡胶大底',
        ankleSupport: parseAnkleSupport(p['帮高']),
        terrain: scenarios,
      };
    } else if (category === 'outer-layer' || category === 'mid-layer') {
      specs = {
        weight,
        waterproof: wp,
        windproof: true,
        breathability: parseBreathability(p['透气指数']),
        warmthLevel: parseWarmthLevel(category, material),
        temperatureRange: { min: -10, max: 30 },
        material,
      };
    } else if (category === 'tent') {
      const weightStr = String(p['重量'] || '2.5');
      const weightKg = parseFloat(weightStr.replace(/[^\d.]/g, '')) || 2.5;
      const isKg = weightStr.includes('kg') || weightStr.includes('KG') || weightKg < 20;
      specs = {
        capacity: name.includes('单人') ? 1 : (name.includes('3人') || name.includes('3P') || name.includes('4人')) ? 3 : 2,
        weight: isKg ? Math.round(weightKg * 1000) : Math.round(weightKg),
        waterproof: true,
        waterproofRating: wpRating || '防水',
        seasonRating: '3-season',
        material,
      };
    } else if (category === 'backpack') {
      const volMatch = String(p['产品名称'] + ' ' + (p['关键技术参数'] || '')).match(/(\d+)\s*[Ll升]/);
      const volume = volMatch ? parseInt(volMatch[1]) : 30;
      specs = {
        volume,
        weight,
        frameType: 'internal',
        hipBelt: true,
        rainCover: false,
      };
    } else if (category === 'sleeping') {
      const tempMatch = String(p['适用场景'] || '').match(/(-?\d+)℃/);
      const tempRating = tempMatch ? parseInt(tempMatch[1]) : 5;
      specs = {
        temperatureRating: tempRating,
        weight,
        fillType: material.includes('羽绒') || material.includes('蓬') ? 'down' : 'synthetic',
        packedSize: '可压缩',
      };
    } else if (category === 'sun-protection') {
      specs = {
        type: 'sun-hat',
        weight,
        waterproof: false,
      };
    }

    const product = {
      id,
      name,
      brand: p['品牌'],
      category,
      image: '',
      specs,
      scenarios,
      price,
    };

    newProducts.push(product);
    stats.new++;
    if (!stats.byCategory[category]) stats.byCategory[category] = 0;
    stats.byCategory[category]++;
  }

  // Group by category
  const categoryGroups = {};
  for (const p of newProducts) {
    if (!categoryGroups[p.category]) categoryGroups[p.category] = [];
    categoryGroups[p.category].push(p);
  }

  console.log('=== FINAL IMPORT STATS ===');
  console.log('Total Excel:', stats.total);
  console.log('New:', stats.new);
  console.log('Duplicates skipped:', stats.dup);
  console.log('By category:', JSON.stringify(stats.byCategory, null, 2));

  // Generate TypeScript product entries for each category
  const output = {};
  for (const [cat, products] of Object.entries(categoryGroups)) {
    output[cat] = products.map(p => {
      let specsStr;
      if (cat === 'tent') {
        specsStr = `{\n        capacity: ${p.specs.capacity},\n        weight: ${p.specs.weight},\n        waterproof: true,\n        waterproofRating: "${p.specs.waterproofRating}",\n        seasonRating: "3-season",\n        material: "${p.specs.material}",\n      }`;
      } else if (cat === 'backpack') {
        specsStr = `{\n        volume: ${p.specs.volume},\n        weight: ${p.specs.weight},\n        frameType: "internal",\n        hipBelt: true,\n        rainCover: false,\n      }`;
      } else if (cat === 'sleeping') {
        specsStr = `{\n        temperatureRating: ${p.specs.temperatureRating},\n        weight: ${p.specs.weight},\n        fillType: "${p.specs.fillType}",\n        packedSize: "${p.specs.packedSize}",\n      }`;
      } else if (cat === 'sun-protection') {
        specsStr = `{\n        type: "sun-hat",\n        weight: ${p.specs.weight},\n        waterproof: false,\n      }`;
      } else if (cat === 'footwear') {
        const tr = p.specs.temperatureRange;
        specsStr = `{\n        weight: ${p.specs.weight},\n        waterproof: ${p.specs.waterproof},\n        ${p.specs.waterproofRating ? `waterproofRating: "${p.specs.waterproofRating}",` : ''}\n        temperatureRange: { min: ${tr.min}, max: ${tr.max} },\n        soleType: "${p.specs.soleType}",\n        ankleSupport: "${p.specs.ankleSupport}",\n        terrain: ${JSON.stringify(p.specs.terrain)},\n      }`;
      } else {
        // outer-layer or mid-layer
        const tr = p.specs.temperatureRange;
        specsStr = `{\n        weight: ${p.specs.weight},\n        waterproof: ${p.specs.waterproof},\n        windproof: true,\n        breathability: "${p.specs.breathability}",\n        warmthLevel: ${p.specs.warmthLevel},\n        temperatureRange: { min: ${tr.min}, max: ${tr.max} },\n        material: "${p.specs.material}",\n      }`;
      }
      return `  {\n    id: "${p.id}",\n    name: "${p.name}",\n    brand: "${p.brand}",\n    category: "${p.category}",\n    image: "",\n    specs: ${specsStr},\n    scenarios: ${JSON.stringify(p.scenarios)},\n    ${p.price ? `price: ${p.price},` : ''}\n  }`;
    }).join(',\n');
  }

  // Write the generated code to a temp file
  const tempOutput = JSON.stringify(output, null, 2);
  fs.writeFileSync('import-output.json', tempOutput);
  console.log('\\nGenerated code written to import-output.json');
  console.log('Product count by category:');
  for (const [cat, products] of Object.entries(output)) {
    console.log(`  ${cat}: ${products.length} entries`);
  }
}

main().catch(e => console.error(e));
