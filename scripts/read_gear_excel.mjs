import ExcelJS from "exceljs";

async function readExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("D:\\户外装备数据_扩充完整版.xlsx");

  const sheet = workbook.worksheets[0];

  // 统计品类分布
  const categories = {};
  const items = [];

  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const item = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = sheet.getRow(1).getCell(colNumber).value;
      if (header) item[header] = cell.value;
    });

    if (item["品类"]) {
      categories[item["品类"]] = (categories[item["品类"]] || 0) + 1;
      items.push(item);
    }
  }

  console.log("=== 品类统计 ===");
  for (const [cat, count] of Object.entries(categories)) {
    console.log(`${cat}: ${count} 条`);
  }
  console.log(`\n总计: ${items.length} 条装备数据`);

  // 打印所有子品类
  console.log("\n=== 子品类列表 ===");
  const subcategories = {};
  for (const item of items) {
    const key = `${item["品类"]}/${item["子品类"]}`;
    if (!subcategories[key]) subcategories[key] = 0;
    subcategories[key]++;
  }
  for (const [key, count] of Object.entries(subcategories)) {
    console.log(`${key}: ${count} 条`);
  }
}

readExcel().catch(console.error);
