import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 品类映射
const categoryMap = {
  "鞋类": "footwear",
  "户外服装": null, // 需要根据子品类判断
  "背包": "backpack",
  "帐篷": "tent",
  "睡袋": "sleeping",
  "登山杖": "trekking-poles",
};

// 服装子品类映射
const clothingSubcategoryMap = {
  "硬壳冲锋衣": "outer-layer",
  "软壳衣": "outer-layer",
  "三合一冲锋衣": "outer-layer",
  "抓绒衣": "mid-layer",
  "棉服": "mid-layer",
  "羽绒服": "mid-layer",
  "速干T恤": "base-layer",
};

// 解析温度范围
function parseTempRange(tempStr) {
  if (!tempStr) return { min: -10, max: 30 };
  const str = String(tempStr);
  const match = str.match(/(-?\d+)~(-?\d+)/);
  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2]) };
  }
  // 尝试解析单个值
  const single = str.match(/(-?\d+)/);
  if (single) {
    const val = parseInt(single[1]);
    return { min: val - 10, max: val + 10 };
  }
  return { min: -10, max: 30 };
}

// 解析重量
function parseWeight(weight) {
  if (typeof weight === "number") return weight;
  if (typeof weight === "string") {
    const match = weight.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

// 解析价格
function parsePrice(price) {
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const match = price.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

// 判断防水性
function isWaterproof(item) {
  const wp = String(item["防水等级"] || "");
  return wp.includes("GORE-TEX") || wp.includes("防水") || wp.includes("Gore-Tex");
}

// 获取防水等级
function getWaterproofRating(item) {
  const wp = String(item["防水等级"] || "");
  if (wp.includes("GORE-TEX") || wp.includes("Gore-Tex")) return "GORE-TEX";
  if (wp.includes("防水涂层")) return "防水涂层";
  if (wp.includes("防水")) return "防水";
  return undefined;
}

// 解析透气性
function parseBreathability(item) {
  const bt = String(item["透气性"] || "");
  if (bt.includes("极高") || bt.includes("高")) return "high";
  if (bt.includes("中")) return "medium";
  return "low";
}

// 解析保暖等级
function parseWarmthLevel(item) {
  const season = String(item["适用季节"] || "");
  const temp = String(item["温度评级(℃)"] || "");
  if (season.includes("冬季") || temp.includes("-20") || temp.includes("-15")) return 5;
  if (season.includes("秋") || temp.includes("-10")) return 4;
  if (season.includes("春") || temp.includes("0")) return 3;
  if (season.includes("夏")) return 1;
  return 2;
}

// 生成产品ID
function generateId(brand, name) {
  const brandSlug = brand.toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const nameSlug = name.toLowerCase()
    .replace(/[^a-z0-9一-龥]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${brandSlug}-${nameSlug}`.substring(0, 50);
}

// 解析适用场景
function parseScenarios(item) {
  const useCase = String(item["适用场景"] || "");
  const scenarios = [];
  if (useCase.includes("徒步")) scenarios.push("徒步");
  if (useCase.includes("登山")) scenarios.push("登山");
  if (useCase.includes("越野")) scenarios.push("越野跑");
  if (useCase.includes("露营")) scenarios.push("露营");
  if (useCase.includes("穿越")) scenarios.push("穿越");
  if (useCase.includes("攀登")) scenarios.push("攀登");
  if (useCase.includes("旅行")) scenarios.push("旅行");
  if (useCase.includes("日常")) scenarios.push("日常");
  if (scenarios.length === 0) scenarios.push("户外活动");
  return scenarios;
}

// 解析护踝支撑
function parseAnkleSupport(subcategory) {
  if (subcategory.includes("登山鞋") || subcategory.includes("高帮")) return "high";
  if (subcategory.includes("中帮")) return "mid";
  return "low";
}

// 转换单个产品
function convertItem(item, category) {
  const brand = String(item["品牌"] || "");
  const name = String(item["产品名称"] || "");
  const id = generateId(brand, name);

  const base = {
    id,
    name,
    brand,
    category,
    image: `/images/products/${id}.jpg`,
    scenarios: parseScenarios(item),
    price: parsePrice(item["建议零售价(元)"]) || parsePrice(item["实际售价(元)"]),
  };

  const weight = parseWeight(item["重量(g)"]);
  const tempRange = parseTempRange(item["温度评级(℃)"]);

  switch (category) {
    case "footwear":
      return {
        ...base,
        specs: {
          waterproof: isWaterproof(item),
          waterproofRating: getWaterproofRating(item),
          weight,
          ankleSupport: parseAnkleSupport(item["子品类"]),
          soleType: String(item["备注"] || "").match(/([A-Za-z]+\s*[A-Za-z]+\s*(?:大底|底))/)?.[1] || "橡胶大底",
          terrain: ["碎石", "泥地", "岩石"],
          temperatureRange: tempRange,
        },
      };

    case "outer-layer":
    case "mid-layer":
    case "base-layer":
      return {
        ...base,
        specs: {
          material: String(item["材质"] || ""),
          warmthLevel: parseWarmthLevel(item),
          breathability: parseBreathability(item),
          weight,
          windproof: category === "outer-layer",
          waterproof: isWaterproof(item),
          temperatureRange: tempRange,
        },
      };

    case "backpack":
      const sizeMatch = String(item["尺寸/容量"] || "").match(/(\d+)\s*L/i);
      return {
        ...base,
        specs: {
          volume: sizeMatch ? parseInt(sizeMatch[1]) : 30,
          weight,
          frameType: "internal",
          hipBelt: true,
          rainCover: isWaterproof(item),
        },
      };

    case "tent":
      const sizeStr = String(item["尺寸/容量"] || "");
      let capacity = 2;
      if (sizeStr.includes("1")) capacity = 1;
      else if (sizeStr.includes("3")) capacity = 3;
      else if (sizeStr.includes("4")) capacity = 4;
      return {
        ...base,
        specs: {
          capacity,
          weight,
          waterproof: isWaterproof(item),
          waterproofRating: getWaterproofRating(item),
          seasonRating: String(item["适用季节"] || "").includes("四季") ? "4-season" : "3-season",
          material: String(item["材质"] || ""),
        },
      };

    case "sleeping":
      const tempMatch = String(item["温度评级(℃)"] || "").match(/(-?\d+)/);
      return {
        ...base,
        specs: {
          temperatureRating: tempMatch ? parseInt(tempMatch[1]) : 0,
          weight,
          fillType: String(item["材质"] || "").includes("羽绒") || String(item["材质"] || "").includes("鹅绒") || String(item["材质"] || "").includes("鸭绒") ? "down" : "synthetic",
          packedSize: String(item["尺寸/容量"] || ""),
        },
      };

    case "trekking-poles":
      return {
        ...base,
        specs: {
          weight,
          material: String(item["材质"] || "铝合金"),
          collapsible: String(item["子品类"] || "").includes("折叠"),
          adjustable: String(item["子品类"] || "").includes("伸缩"),
        },
      };

    default:
      return {
        ...base,
        specs: { weight },
      };
  }
}

async function convertData() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("D:\\户外装备数据_扩充完整版.xlsx");

  const sheet = workbook.worksheets[0];
  const productsByCategory = {};

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const item = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = sheet.getRow(1).getCell(colNumber).value;
      if (header) item[header] = cell.value;
    });

    if (!item["品类"]) continue;

    let category = categoryMap[item["品类"]];
    if (category === null) {
      // 服装需要根据子品类判断
      category = clothingSubcategoryMap[item["子品类"]] || "base-layer";
    }

    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }

    const product = convertItem(item, category);
    productsByCategory[category].push(product);
  }

  // 生成 TypeScript 代码
  let output = `import { Product, ProductCategory } from "@/types/product";\n\n`;

  // 生成品类定义（添加新品类）
  output += `// 品类定义\n`;
  output += `export const productCategories: { id: ProductCategory; name: string; icon: string }[] = [\n`;
  output += `  { id: "footwear", name: "鞋类", icon: "🥾" },\n`;
  output += `  { id: "base-layer", name: "基础层", icon: "👕" },\n`;
  output += `  { id: "mid-layer", name: "保暖层", icon: "🧥" },\n`;
  output += `  { id: "outer-layer", name: "防护层", icon: "🧥" },\n`;
  output += `  { id: "rain-gear", name: "雨具", icon: "🌧️" },\n`;
  output += `  { id: "sun-protection", name: "防晒", icon: "☀️" },\n`;
  output += `  { id: "backpack", name: "背包", icon: "🎒" },\n`;
  output += `  { id: "tent", name: "帐篷", icon: "⛺" },\n`;
  output += `  { id: "sleeping", name: "睡眠", icon: "🛏️" },\n`;
  output += `  { id: "trekking-poles", name: "登山杖", icon: "🏔️" },\n`;
  output += `  { id: "cooking", name: "炊具", icon: "🍳" },\n`;
  output += `  { id: "navigation", name: "导航", icon: "🧭" },\n`;
  output += `  { id: "safety", name: "安全", icon: "🏥" },\n`;
  output += `];\n\n`;

  // 生成每个品类的产品数组
  for (const [category, products] of Object.entries(productsByCategory)) {
    const varName = `${category.replace(/-/g, "")}Products`;
    output += `// ${category} 产品 (${products.length}条)\n`;
    output += `const ${varName}: Product[] = [\n`;

    for (const product of products) {
      output += `  {\n`;
      output += `    id: "${product.id}",\n`;
      output += `    name: ${JSON.stringify(product.name)},\n`;
      output += `    brand: ${JSON.stringify(product.brand)},\n`;
      output += `    category: "${product.category}",\n`;
      output += `    image: "${product.image}",\n`;
      output += `    specs: ${JSON.stringify(product.specs, null, 6).replace(/\n/g, "\n    ")},\n`;
      output += `    scenarios: ${JSON.stringify(product.scenarios)},\n`;
      if (product.price) output += `    price: ${product.price},\n`;
      output += `  },\n`;
    }

    output += `];\n\n`;
  }

  // 导出所有产品
  output += `// 所有产品\n`;
  output += `export const products: Product[] = [\n`;
  for (const category of Object.keys(productsByCategory)) {
    const varName = `${category.replace(/-/g, "")}Products`;
    output += `  ...${varName},\n`;
  }
  output += `];\n\n`;

  // 辅助函数
  output += `// 按品类获取产品\n`;
  output += `export function getProductsByCategory(category: ProductCategory): Product[] {\n`;
  output += `  return products.filter((p) => p.category === category);\n`;
  output += `}\n\n`;

  output += `// 按ID获取产品\n`;
  output += `export function getProductById(id: string): Product | undefined {\n`;
  output += `  return products.find((p) => p.id === id);\n`;
  output += `}\n\n`;

  output += `// 获取产品的替代品\n`;
  output += `export function getAlternativeProducts(productId: string): Product[] {\n`;
  output += `  const product = getProductById(productId);\n`;
  output += `  if (!product?.alternatives) return [];\n`;
  output += `  return product.alternatives\n`;
  output += `    .map((id) => getProductById(id))\n`;
  output += `    .filter((p): p is Product => p !== undefined);\n`;
  output += `}\n`;

  // 写入文件
  const outputPath = path.join(__dirname, "..", "src", "data", "products.ts");
  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`已生成产品数据文件: ${outputPath}`);
  console.log(`\n品类统计:`);
  for (const [category, products] of Object.entries(productsByCategory)) {
    console.log(`  ${category}: ${products.length} 条`);
  }
  console.log(`\n总计: ${Object.values(productsByCategory).reduce((sum, p) => sum + p.length, 0)} 条产品`);
}

convertData().catch(console.error);
