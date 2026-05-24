import ExcelJS from "exceljs";
import fs from "fs";

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile("D:/户外鞋类产品_图片链接完整版.xlsx");
  const ws = wb.worksheets[0];

  const imageMap = {};

  for (let i = 2; i <= ws.rowCount; i++) {
    const row = ws.getRow(i);
    const id = row.getCell(1).value;
    const imageCell = row.getCell(7).value;

    if (id && imageCell) {
      const imageUrl = typeof imageCell === "object" ? imageCell.text : imageCell;
      if (imageUrl && imageUrl.startsWith("http")) {
        imageMap[String(id).trim()] = imageUrl.trim();
      }
    }
  }

  console.log(`读取到 ${Object.keys(imageMap).length} 条鞋类产品图片`);

  // 读取 products.ts
  let content = fs.readFileSync("src/data/products.ts", "utf-8");

  let updated = 0;
  let notFound = 0;

  for (const [productId, imageUrl] of Object.entries(imageMap)) {
    // 匹配 id: "xxx", 后面的 image: "xxx"
    const escapedId = productId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(id:\\s*"${escapedId}"[\\s\\S]*?image:\\s*")([^"]*")`
    );

    if (content.match(regex)) {
      content = content.replace(regex, `$1${imageUrl}"`);
      updated++;
      console.log(`  更新: ${productId}`);
    } else {
      notFound++;
      console.log(`  未找到: ${productId}`);
    }
  }

  fs.writeFileSync("src/data/products.ts", content, "utf-8");

  console.log(`\n完成: 更新 ${updated} 条, 未找到 ${notFound} 条`);
}

main().catch(console.error);
