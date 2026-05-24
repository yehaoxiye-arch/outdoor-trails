import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "径迹";
  workbook.created = new Date();

  // ========== 读取产品数据 ==========
  const productsPath = path.join(__dirname, "..", "src", "data", "products.ts");
  const productsContent = fs.readFileSync(productsPath, "utf-8");

  // 提取所有产品信息
  const productRegex = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
  const products = [];
  let match;
  while ((match = productRegex.exec(productsContent)) !== null) {
    products.push({
      id: match[1],
      name: match[2],
      brand: match[3],
      category: match[4],
    });
  }

  // ========== 品牌Logo Sheet ==========
  const brandSheet = workbook.addWorksheet("品牌Logo", {
    properties: { tabColor: { argb: "22C55E" } },
  });

  const brandColumns = [
    { header: "品牌名称", key: "brand", width: 20 },
    { header: "Logo文件名", key: "filename", width: 25 },
    { header: "存放路径", key: "path", width: 35 },
    { header: "图片状态", key: "status", width: 12 },
    { header: "备注", key: "notes", width: 25 },
  ];

  brandSheet.columns = brandColumns;

  // 表头样式
  brandSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "22C55E" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  brandSheet.getRow(1).height = 32;

  // 获取所有品牌
  const brands = [...new Set(products.map((p) => p.brand))].sort();

  // 写入品牌数据
  brands.forEach((brand, i) => {
    const filename = brand.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/\s+/g, "") + ".png";
    const row = brandSheet.getRow(i + 2);
    row.values = {
      brand,
      filename,
      path: `public/images/brands/${filename}`,
      status: "",
      notes: "",
    };
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F0FDF4" } };
      });
    }
  });

  brandSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 产品图片 Sheet ==========
  const productSheet = workbook.addWorksheet("产品图片", {
    properties: { tabColor: { argb: "3B82F6" } },
  });

  const productColumns = [
    { header: "品类", key: "category", width: 12 },
    { header: "品牌", key: "brand", width: 16 },
    { header: "产品名称", key: "name", width: 30 },
    { header: "产品ID", key: "id", width: 35 },
    { header: "图片文件名", key: "filename", width: 40 },
    { header: "存放路径", key: "path", width: 50 },
    { header: "图片状态", key: "status", width: 12 },
    { header: "备注", key: "notes", width: 25 },
  ];

  productSheet.columns = productColumns;

  // 表头样式
  productSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  productSheet.getRow(1).height = 32;

  // 品类中文映射
  const categoryNames = {
    "footwear": "鞋类",
    "base-layer": "基础层",
    "mid-layer": "保暖层",
    "outer-layer": "防护层",
    "rain-gear": "雨具",
    "sun-protection": "防晒",
    "backpack": "背包",
    "tent": "帐篷",
    "sleeping": "睡眠",
    "trekking-poles": "登山杖",
    "cooking": "炊具",
    "navigation": "导航",
    "safety": "安全",
  };

  // 写入产品数据
  products.forEach((product, i) => {
    const filename = `${product.id}.jpg`;
    const row = productSheet.getRow(i + 2);
    row.values = {
      category: categoryNames[product.category] || product.category,
      brand: product.brand,
      name: product.name,
      id: product.id,
      filename,
      path: `public/images/products/${filename}`,
      status: "",
      notes: "",
    };
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "EFF6FF" } };
      });
    }
  });

  productSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 统计 Sheet ==========
  const statsSheet = workbook.addWorksheet("统计", {
    properties: { tabColor: { argb: "F59E0B" } },
  });

  statsSheet.columns = [
    { header: "品类", key: "category", width: 15 },
    { header: "产品数量", key: "count", width: 12 },
    { header: "涉及品牌数", key: "brands", width: 12 },
  ];

  statsSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F59E0B" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  statsSheet.getRow(1).height = 32;

  // 统计各品类
  const categoryStats = {};
  for (const product of products) {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = { count: 0, brands: new Set() };
    }
    categoryStats[product.category].count++;
    categoryStats[product.category].brands.add(product.brand);
  }

  let rowIndex = 2;
  for (const [category, stats] of Object.entries(categoryStats)) {
    const row = statsSheet.getRow(rowIndex);
    row.values = {
      category: categoryNames[category] || category,
      count: stats.count,
      brands: stats.brands.size,
    };
    if (rowIndex % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFBEB" } };
      });
    }
    rowIndex++;
  }

  // 添加汇总行
  const totalRow = statsSheet.getRow(rowIndex + 1);
  totalRow.values = {
    category: "总计",
    count: products.length,
    brands: brands.length,
  };
  totalRow.eachCell((cell) => {
    cell.font = { bold: true };
  });

  statsSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 使用说明 Sheet ==========
  const docSheet = workbook.addWorksheet("使用说明", {
    properties: { tabColor: { argb: "8B5CF6" } },
  });

  docSheet.columns = [
    { header: "项目", key: "item", width: 20 },
    { header: "说明", key: "desc", width: 60 },
  ];

  docSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8B5CF6" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  docSheet.getRow(1).height = 32;

  const docs = [
    { item: "图片要求", desc: "白色背景、简约商品图、产品主体清晰可见" },
    { item: "品牌Logo格式", desc: "PNG格式，透明背景或白色背景，建议尺寸200x200px" },
    { item: "产品图片格式", desc: "JPG格式，白色背景，建议尺寸800x800px" },
    { item: "品牌Logo存放", desc: "放入 public/images/brands/ 目录" },
    { item: "产品图片存放", desc: "放入 public/images/products/ 目录" },
    { item: "图片命名", desc: "严格按照模板中的文件名命名，不要修改" },
    { item: "完成标记", desc: "在\"图片状态\"列填写\"已完成\"标记已收集的图片" },
    { item: "优先级", desc: "建议先收集品牌Logo，再按品类收集产品图片" },
  ];

  docs.forEach((doc, i) => {
    const row = docSheet.getRow(i + 2);
    row.values = doc;
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F5F3FF" } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  docSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 保存 ==========
  const outputPath = path.join(__dirname, "..", "装备图片收集模板.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  console.log(`模板已生成: ${outputPath}`);
  console.log(`品牌数量: ${brands.length}`);
  console.log(`产品数量: ${products.length}`);
}

generateTemplate().catch(console.error);
