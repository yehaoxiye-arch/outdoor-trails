#!/usr/bin/env node
/**
 * integrate-rankings.mjs
 * 将 OutdoorsMagic 榜单产品集成到装备数据库
 *
 * 用法：
 *   node scripts/integrate-rankings.mjs --phase=parse     # 解析+去重报告
 *   node scripts/integrate-rankings.mjs --phase=generate   # 生成 TypeScript 产品文件
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── 多词品牌列表（按长度降序） ───
const MULTI_WORD_BRANDS = [
  "Outdoor Research",
  "Mountain Equipment",
  "Helly Hansen",
  "Jack Wolfskin",
  "Sierra Designs",
  "Arc'teryx",
  "Klättermusen",
  "Fjällräven",
  "Brandecosse",
];

// ─── 品类映射 ───
const CATEGORY_MAP = {
  backpacks: "backpack",
  boots: "footwear",
  jackets: "outer-layer",
};

// ─── 已知重复（榜单产品名 → 现有数据库 ID）───
const KNOWN_DUPLICATES = {
  "Osprey Kestrel 38L": "osprey-kestrel-38-小鹰38",
  "Arc'teryx Beta Jacket": "arcteryx-beta-jacket",
  "Patagonia Torrentshell 3L": "patagonia-torrentshell-3l",
};

/**
 * 解析模型名称，提取品牌、英文名、中文名
 */
function parseModel(model) {
  const match = model.match(/^(.+?)（(.+?)）$/);
  if (!match) return { englishName: model, chineseName: "", brand: "Unknown" };

  const englishName = match[1].trim();
  const chineseName = match[2].trim();

  // 提取品牌
  let brand = "Unknown";
  for (const mb of MULTI_WORD_BRANDS) {
    if (englishName.startsWith(mb)) {
      brand = mb;
      break;
    }
  }
  if (brand === "Unknown") {
    brand = englishName.split(/\s+/)[0];
  }

  return { englishName, chineseName, brand };
}

/**
 * 从模型名中提取容量(L)
 * 注意：夹克的 "2.5L"/"3L" 是面料层数，不是容量
 */
function extractVolume(model, category) {
  // 只对背包提取容量
  if (category !== "backpacks") return null;

  // 匹配 "40-60L" → 取较大值 60, "45+10L" → 取主值 45, "38L" → 38
  const rangeMatch = model.match(/(\d+)-(\d+)L/);
  if (rangeMatch) return parseInt(rangeMatch[2]);

  const plusMatch = model.match(/(\d+)\+\d+L/);
  if (plusMatch) return parseInt(plusMatch[1]);

  const simpleMatch = model.match(/(\d+)L/);
  if (simpleMatch) return parseInt(simpleMatch[1]);

  return null;
}

/**
 * 将非 ASCII 字符转为 ASCII 友好形式
 */
function toAsciiId(s) {
  const map = {
    ä: "a", ö: "o", ü: "u", å: "a",
    æ: "ae", ø: "o", ñ: "n", é: "e", è: "e", ê: "e",
    ë: "e", á: "a", à: "a", â: "a", í: "i", ì: "i",
    î: "i", ó: "o", ò: "o", ô: "o", ú: "u", ù: "u",
    û: "u", ý: "y", ç: "c", ß: "ss",
  };
  return s.replace(/[^\x00-\x7F]/g, (ch) => map[ch] || "");
}

/**
 * 生成产品 ID（kebab-case，纯 ASCII）
 */
function generateId(brand, englishName, chineseName) {
  // 移除品牌前缀
  let name = englishName;
  if (name.startsWith(brand)) {
    name = name.slice(brand.length).trim();
  }

  // 清理特殊字符，转 kebab-case
  let id = toAsciiId(name)
    .toLowerCase()
    .replace(/[()（）]/g, "")
    .replace(/[/'"]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 品牌也转 kebab-case
  const brandId = toAsciiId(brand)
    .toLowerCase()
    .replace(/[()（）'"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${brandId}-${id}`;
}

/**
 * Phase 1: 解析榜单数据并生成去重报告
 */
function phaseParseRankings() {
  console.log("=== Phase 1: 解析榜单数据 ===\n");

  const rankingsPath = join(ROOT, "src/data/outdoormagic-rankings.json");
  const rankings = JSON.parse(readFileSync(rankingsPath, "utf-8"));

  const results = { add: [], skip: [], review: [] };

  for (const [key, categoryData] of Object.entries(rankings)) {
    const targetCategory = CATEGORY_MAP[key];
    console.log(`\n--- ${categoryData.title} → ${targetCategory} ---`);

    for (const product of categoryData.products) {
      const { englishName, chineseName, brand } = parseModel(product.model);
      const volume = extractVolume(product.model, key);
      const id = generateId(brand, englishName, chineseName);

      // 检查已知重复
      if (KNOWN_DUPLICATES[englishName]) {
        console.log(`  SKIP: ${englishName} → 已存在于 ${KNOWN_DUPLICATES[englishName]}`);
        results.skip.push({
          model: product.model,
          reason: `已存在于数据库: ${KNOWN_DUPLICATES[englishName]}`,
          category: targetCategory,
        });
        continue;
      }

      // 标记为新增
      console.log(`  ADD:  ${englishName} (${brand}) id=${id} vol=${volume || "?"}L`);
      results.add.push({
        model: product.model,
        englishName,
        chineseName,
        brand,
        id,
        volume,
        category: targetCategory,
        categoryKey: key,
        image: product.image,
        awardTitle: product.awardTitle,
        verdict: product.verdict,
        isWinner: product.isWinner,
      });
    }
  }

  console.log(`\n=== 去重报告 ===`);
  console.log(`新增: ${results.add.length} 款`);
  console.log(`跳过: ${results.skip.length} 款`);
  results.skip.forEach((s) => console.log(`  - ${s.model}: ${s.reason}`));

  // 保存解析结果
  const outputPath = join(ROOT, "scripts/ranking-parsed.json");
  writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n解析结果已保存到: ${outputPath}`);

  return results;
}

/**
 * Phase 2: 生成 TypeScript 产品文件
 */
function phaseGenerate() {
  console.log("=== Phase 2: 生成 TypeScript 产品文件 ===\n");

  // 读取解析结果
  const parsedPath = join(ROOT, "scripts/ranking-parsed.json");
  const parsed = JSON.parse(readFileSync(parsedPath, "utf-8"));

  // 读取规格数据
  const specsPath = join(ROOT, "scripts/ranking-specs.json");
  let specs = {};
  try {
    specs = JSON.parse(readFileSync(specsPath, "utf-8"));
  } catch {
    console.log("警告: 未找到 ranking-specs.json，将使用默认规格");
  }

  // 生成产品数据
  const products = [];

  for (const item of parsed.add) {
    const spec = specs[item.id] || {};
    const product = buildProduct(item, spec);
    if (product) {
      products.push(product);
    }
  }

  // 按品类分组
  const byCategory = {};
  for (const p of products) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }

  // 生成 TypeScript 代码
  let ts = `import { Product } from "@/types/product";\n\n`;
  ts += `/**\n * OutdoorsMagic 榜单产品（${products.length}款）\n`;
  ts += ` * 数据来源：outdoorsmagic.com 2026年最佳装备榜单\n`;
  ts += ` * 自动生成于 ${new Date().toISOString().split("T")[0]}\n */\n\n`;

  for (const [category, categoryProducts] of Object.entries(byCategory)) {
    const categoryName =
      category === "backpack"
        ? "背包"
        : category === "footwear"
        ? "鞋类"
        : "防护层";

    ts += `// ${categoryName}（${categoryProducts.length}条）\n`;
    ts += `const ranking${capitalize(category)}Products: Product[] = [\n`;

    for (const p of categoryProducts) {
      ts += `  {\n`;
      ts += `    id: "${p.id}",\n`;
      ts += `    name: "${escapeStr(p.name)}",\n`;
      ts += `    brand: "${escapeStr(p.brand)}",\n`;
      ts += `    category: "${p.category}",\n`;
      ts += `    image: "${p.image}",\n`;
      ts += `    specs: ${formatSpecs(p.specs)},\n`;
      ts += `    scenarios: ${JSON.stringify(p.scenarios)},\n`;
      if (p.price) ts += `    price: ${p.price},\n`;
      ts += `  },\n`;
    }

    ts += `];\n\n`;
  }

  // 导出
  ts += `export const rankingProducts: Product[] = [\n`;
  for (const category of Object.keys(byCategory)) {
    ts += `  ...ranking${capitalize(category)}Products,\n`;
  }
  ts += `];\n`;

  const outPath = join(ROOT, "src/data/ranking-products.ts");
  writeFileSync(outPath, ts, "utf-8");
  console.log(`已生成: ${outPath}`);
  console.log(`共 ${products.length} 款产品`);

  // 输出集成指引
  console.log(`\n=== 集成指引 ===`);
  console.log(`在 products.ts 中添加以下导入和展开：`);
  console.log(`  import { rankingProducts } from "./ranking-products";`);
  console.log(`  在 export const products 数组中添加：...rankingProducts,`);

  return products;
}

/**
 * 构建单个产品对象
 */
function buildProduct(item, spec) {
  const { category, englishName, chineseName, brand, id, image } = item;

  // 产品名称：如果中文名已包含英文名则直接用，否则拼接
  let name = englishName;
  if (chineseName) {
    if (chineseName.startsWith(brand) || chineseName.startsWith(englishName)) {
      name = chineseName;
    } else {
      name = `${englishName} ${chineseName}`;
    }
  }

  // 通用场景
  const scenarios =
    category === "backpack"
      ? ["徒步"]
      : category === "footwear"
      ? ["徒步", "登山"]
      : ["徒步", "登山"];

  let specs;

  switch (category) {
    case "backpack":
      specs = buildBackpackSpecs(item, spec);
      break;
    case "footwear":
      specs = buildFootwearSpecs(item, spec);
      break;
    case "outer-layer":
      specs = buildClothingSpecs(item, spec);
      break;
    default:
      console.error(`未知品类: ${category}`);
      return null;
  }

  return { id, name, brand, category, image, specs, scenarios, price: spec.price || 0 };
}

/**
 * 构建背包规格
 */
function buildBackpackSpecs(item, spec) {
  return {
    weight: spec.weight || 1500, // 默认1.5kg
    waterproof: spec.waterproof || false,
    volume: item.volume || spec.volume || 40,
    frameType: spec.frameType || "internal",
    hipBelt: spec.hipBelt !== undefined ? spec.hipBelt : true,
    rainCover: spec.rainCover !== undefined ? spec.rainCover : true,
  };
}

/**
 * 构建鞋类规格
 */
function buildFootwearSpecs(item, spec) {
  const isGTX =
    item.englishName.includes("GTX") || item.englishName.includes("Gore-Tex");

  return {
    waterproof: spec.waterproof !== undefined ? spec.waterproof : isGTX,
    waterproofRating:
      spec.waterproofRating || (isGTX ? "GORE-TEX防水透气膜" : "防水涂层"),
    weight: spec.weight || 550, // 默认单只550g
    ankleSupport: spec.ankleSupport || "mid",
    soleType: spec.soleType || "Vibram橡胶",
    terrain: spec.terrain || ["全地形徒步", "山地"],
    temperatureRange: spec.temperatureRange || { min: -5, max: 30 },
  };
}

/**
 * 构建服装规格（防水夹克）
 */
function buildClothingSpecs(item, spec) {
  return {
    material: spec.material || "防水面料",
    warmthLevel: spec.warmthLevel || 3,
    breathability: spec.breathability || "medium",
    weight: spec.weight || 450, // 默认450g
    windproof: spec.windproof !== undefined ? spec.windproof : true,
    waterproof: spec.waterproof !== undefined ? spec.waterproof : true,
    temperatureRange: spec.temperatureRange || { min: -10, max: 30 },
  };
}

/**
 * 格式化 specs 对象为 TypeScript 代码
 */
function formatSpecs(specs) {
  const entries = Object.entries(specs)
    .map(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) {
        const inner = Object.entries(value)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        return `${key}: { ${inner} }`;
      }
      if (typeof value === "string") return `${key}: "${escapeStr(value)}"`;
      if (Array.isArray(value))
        return `${key}: [${value.map((v) => `"${escapeStr(v)}"`).join(", ")}]`;
      return `${key}: ${value}`;
    })
    .join(", ");
  return `{ ${entries} }`;
}

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function capitalize(s) {
  // 处理 "outer-layer" → "Outerlayer" 等连字符品类名
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// ─── 主程序 ───
const phase = process.argv.find((a) => a.startsWith("--phase="))?.split("=")[1];

if (!phase) {
  console.log("用法：");
  console.log("  node scripts/integrate-rankings.mjs --phase=parse");
  console.log("  node scripts/integrate-rankings.mjs --phase=generate");
  process.exit(0);
}

switch (phase) {
  case "parse":
    phaseParseRankings();
    break;
  case "generate":
    phaseGenerate();
    break;
  default:
    console.error(`未知阶段: ${phase}`);
    process.exit(1);
}
