import ExcelJS from "exceljs";
import fs from "fs";

const categoryMap = {
  "鞋类": "footwear",
  "基础层": "base-layer",
  "保暖层": "mid-layer",
  "防护层": "outer-layer",
  "雨具": "rain-gear",
  "防晒": "sun-protection",
  "背包": "backpack",
  "帐篷": "tent",
  "睡眠": "sleeping",
  "登山杖": "trekking-poles",
  "炊具": "cooking",
  "导航": "navigation",
  "安全": "safety",
  // 扩展映射
  "冲锋衣": "outer-layer",
  "徒步鞋": "footwear",
  "抓绒衣": "mid-layer",
  "攀岩装备": "safety",
  "棉服": "mid-layer",
  "登山鞋": "footwear",
  "羽绒服": "mid-layer",
  "越野跑鞋": "footwear",
  "软壳裤": "outer-layer",
  "速干衣": "base-layer",
};

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(
    "D:/户外装备数据库_更新版(含探路者+拓路者+骆驼喜马拉雅+迪卡侬).xlsx"
  );
  const ws = wb.worksheets[0];

  const products = [];

  for (let i = 2; i <= ws.rowCount; i++) {
    const row = ws.getRow(i);
    const id = row.getCell(1).value;
    if (!id) continue;

    const brand = String(row.getCell(2).value || "").replace(/"/g, "");
    const name = String(row.getCell(3).value || "").replace(/"/g, "");
    const catRaw = String(row.getCell(4).value || "");
    const category = categoryMap[catRaw] || catRaw;
    const price = Number(row.getCell(5).value) || 0;
    const scenariosStr = String(row.getCell(6).value || "");
    const weight = row.getCell(7).value;
    const waterproof = row.getCell(8).value === "是";
    const waterproofRating = String(row.getCell(9).value || "").replace(/"/g, "");
    const windproof = row.getCell(10).value === "是";
    const breathability = String(row.getCell(11).value || "").replace(/"/g, "");
    const warmthLevel = String(row.getCell(12).value || "").replace(/"/g, "");
    const tempMin = row.getCell(13).value;
    const tempMax = row.getCell(14).value;
    const temperatureRating = String(row.getCell(15).value || "").replace(/"/g, "");
    const seasonRating = String(row.getCell(16).value || "").replace(/"/g, "");
    const capacity = row.getCell(17).value;
    const volume = row.getCell(18).value;
    const material = String(row.getCell(19).value || "").replace(/"/g, "");
    const soleType = String(row.getCell(20).value || "").replace(/"/g, "");
    const ankleSupport = String(row.getCell(21).value || "").replace(/"/g, "");
    const terrain = String(row.getCell(22).value || "").replace(/"/g, "");
    const fillType = String(row.getCell(23).value || "").replace(/"/g, "");
    const packedSize = String(row.getCell(24).value || "").replace(/"/g, "");
    const frameType = String(row.getCell(25).value || "").replace(/"/g, "");
    const hipBelt = row.getCell(26).value === "是";
    const adjustable = row.getCell(27).value === "是";
    const collapsible = row.getCell(28).value === "是";
    const rainCover = row.getCell(29).value === "是";

    // Build specs
    const specs = {};
    if (weight) specs.weight = Number(weight) || weight;
    if (category === "footwear" || category === "tent" || category === "backpack" ||
        category === "mid-layer" || category === "outer-layer" || category === "base-layer") {
      specs.waterproof = waterproof;
    } else if (waterproof) {
      specs.waterproof = true;
    }
    if (waterproofRating) specs.waterproofRating = waterproofRating;
    if (category === "mid-layer" || category === "outer-layer" || category === "base-layer") {
      specs.windproof = windproof;
    } else if (windproof) {
      specs.windproof = true;
    }
    if (breathability) {
      const breathMap = { "高": "high", "中": "medium", "低": "low" };
      specs.breathability = breathMap[breathability] || "medium";
    }
    if (warmthLevel) {
      specs.warmthLevel = Number(warmthLevel) || 3;
    } else if (category === "mid-layer" || category === "outer-layer" || category === "base-layer") {
      specs.warmthLevel = 3;
    }
    if (tempMin || tempMax) {
      specs.temperatureRange = {
        min: tempMin ? Number(tempMin) : -10,
        max: tempMax ? Number(tempMax) : 30,
      };
    } else if (category === "footwear" || category === "mid-layer" || category === "outer-layer" || category === "base-layer") {
      specs.temperatureRange = { min: -10, max: 30 };
    }
    if (temperatureRating) {
      const numRating = Number(temperatureRating);
      specs.temperatureRating = isNaN(numRating) ? -10 : numRating;
    } else if (category === "sleeping") {
      specs.temperatureRating = -10;
    }
    if (seasonRating) {
      const seasonMap = { "三季": "3-season", "四季": "4-season", "3-season": "3-season", "4-season": "4-season" };
      specs.seasonRating = seasonMap[seasonRating] || "3-season";
    }
    if (capacity) specs.capacity = Number(capacity);
    if (volume) specs.volume = Number(volume);
    if (material) specs.material = material;
    if (soleType) specs.soleType = soleType;
    if (ankleSupport) specs.ankleSupport = ankleSupport;
    if (terrain) {
      specs.terrain = terrain.split(",").map((t) => t.trim());
    } else if (category === "footwear") {
      specs.terrain = ["碎石", "泥地", "岩石"];
    }
    if (fillType) {
      const fillMap = { "羽绒": "down", "棉": "synthetic", "化纤": "synthetic", "摇粒绒": "synthetic" };
      specs.fillType = fillMap[fillType] || "synthetic";
    }
    if (packedSize) specs.packedSize = packedSize;
    if (frameType) {
      const frameMap = { "铝合金": "external", "碳纤维": "internal", "无": "none" };
      specs.frameType = frameMap[frameType] || "internal";
    }
    if (hipBelt) specs.hipBelt = true;
    if (category === "trekking-poles") {
      specs.adjustable = adjustable || false;
      specs.collapsible = collapsible || false;
    } else {
      if (adjustable) specs.adjustable = true;
      if (collapsible) specs.collapsible = true;
    }
    if (category === "backpack") {
      specs.rainCover = rainCover;
      if (!specs.volume) specs.volume = 0;
      if (!specs.frameType) specs.frameType = "internal";
      if (!specs.hipBelt) specs.hipBelt = false;
    } else if (rainCover) {
      specs.rainCover = true;
    }

    // Set defaults for required fields
    if (category === "tent") {
      if (!specs.capacity) specs.capacity = 2;
      if (!specs.seasonRating) specs.seasonRating = "3-season";
    }

    const scenarios = scenariosStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    products.push({
      id: String(id).trim(),
      brand,
      name,
      category,
      image: "",
      specs,
      scenarios,
      price,
    });
  }

  console.log(`读取到 ${products.length} 条产品`);

  // Group by category
  const grouped = {};
  products.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  console.log("\n各品类数量:");
  Object.entries(grouped)
    .sort()
    .forEach(([cat, prods]) => {
      console.log(`  ${cat}: ${prods.length}`);
    });

  // Generate TypeScript
  const lines = [];
  lines.push('import { Product, ProductCategory } from "@/types/product";');
  lines.push("");
  lines.push("// 品类定义");
  lines.push(
    "export const productCategories: { id: ProductCategory; name: string; icon: string }[] = ["
  );
  lines.push('  { id: "footwear", name: "鞋类", icon: "🥾" },');
  lines.push('  { id: "base-layer", name: "基础层", icon: "👕" },');
  lines.push('  { id: "mid-layer", name: "保暖层", icon: "🧥" },');
  lines.push('  { id: "outer-layer", name: "防护层", icon: "🧥" },');
  lines.push('  { id: "rain-gear", name: "雨具", icon: "🌧️" },');
  lines.push('  { id: "sun-protection", name: "防晒", icon: "☀️" },');
  lines.push('  { id: "backpack", name: "背包", icon: "🎒" },');
  lines.push('  { id: "tent", name: "帐篷", icon: "⛺" },');
  lines.push('  { id: "sleeping", name: "睡眠", icon: "🛏️" },');
  lines.push('  { id: "trekking-poles", name: "登山杖", icon: "🏔️" },');
  lines.push('  { id: "cooking", name: "炊具", icon: "🍳" },');
  lines.push('  { id: "navigation", name: "导航", icon: "🧭" },');
  lines.push('  { id: "safety", name: "安全", icon: "🏥" },');
  lines.push("];");
  lines.push("");

  for (const [cat, prods] of Object.entries(grouped)) {
    const varName = cat.replace(/-/g, "") + "Products";
    lines.push(`// ${cat} 产品 (${prods.length}条)`);
    lines.push(`const ${varName}: Product[] = [`);

    for (const p of prods) {
      lines.push("  {");
      lines.push(`    id: "${p.id}",`);
      lines.push(`    name: "${p.name}",`);
      lines.push(`    brand: "${p.brand}",`);
      lines.push(`    category: "${p.category}",`);
      lines.push('    image: "",');
      lines.push("    specs: {");

      for (const [key, val] of Object.entries(p.specs)) {
        if (key === "terrain" && Array.isArray(val)) {
          lines.push(
            `      ${key}: [${val.map((v) => `"${v}"`).join(", ")}],`
          );
        } else if (key === "temperatureRange" && typeof val === "object") {
          lines.push(`      ${key}: ${JSON.stringify(val)},`);
        } else if (typeof val === "string") {
          lines.push(`      ${key}: "${val}",`);
        } else {
          lines.push(`      ${key}: ${val},`);
        }
      }

      lines.push("    },");
      lines.push(
        `    scenarios: [${p.scenarios.map((s) => `"${s}"`).join(", ")}],`
      );
      lines.push(`    price: ${p.price},`);
      lines.push("  },");
    }

    lines.push("];");
    lines.push("");
  }

  lines.push("// 导出所有产品");
  lines.push("export const products: Product[] = [");
  for (const cat of Object.keys(grouped)) {
    const varName = cat.replace(/-/g, "") + "Products";
    lines.push(`  ...${varName},`);
  }
  lines.push("];");

  fs.writeFileSync("src/data/products.ts", lines.join("\n"), "utf-8");
  console.log("\n已生成 src/data/products.ts");
}

main().catch(console.error);
