import ExcelJS from "exceljs";
import fs from "fs";

const EXCEL_PATH = "C:/Users/Simon/outdoor-trails/线路图片收集模板.xlsx";
const ROUTES_TS = "C:/Users/Simon/outdoor-trails/src/data/routes.ts";
const ROUTES_JSON = "C:/Users/Simon/outdoor-trails/scripts/route_images.json";

async function main() {
  // 1. 读取Excel
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(EXCEL_PATH);
  const ws = wb.getWorksheet("线路图片收集");

  const imageMap = {};
  let filled = 0;
  let skipped = 0;

  // 从第2行开始读取数据
  for (let i = 2; i <= ws.rowCount; i++) {
    const row = ws.getRow(i);
    const routeId = row.getCell(1).value;
    const imageUrl = row.getCell(5).value;

    if (!routeId) continue;

    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      imageMap[routeId.trim()] = imageUrl.trim();
      filled++;
    } else {
      skipped++;
    }
  }

  console.log(`读取完成: ${filled}条有图片, ${skipped}条未填写`);

  if (filled === 0) {
    console.log("没有找到任何图片URL，请检查Excel文件");
    return;
  }

  // 2. 保存到JSON文件
  fs.writeFileSync(ROUTES_JSON, JSON.stringify(imageMap, null, 2), "utf-8");
  console.log(`已保存到 ${ROUTES_JSON}`);

  // 3. 更新routes.ts
  let content = fs.readFileSync(ROUTES_TS, "utf-8");

  for (const [routeId, imageUrl] of Object.entries(imageMap)) {
    const escapedId = routeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(
      `(id:\\s*"${escapedId}"[\\s\\S]*?image:\\s*")[^"]+(")`,
      "g"
    );
    const match = content.match(regex);
    if (match) {
      content = content.replace(regex, `$1${imageUrl}$2`);
      console.log(`  更新: ${routeId}`);
    } else {
      console.log(`  未找到: ${routeId}`);
    }
  }

  fs.writeFileSync(ROUTES_TS, content, "utf-8");
  console.log(`\nroutes.ts 已更新`);

  // 4. 验证
  const updatedContent = fs.readFileSync(ROUTES_TS, "utf-8");
  const urls = updatedContent.match(/image:\s*"([^"]+)"/g).map((m) =>
    m.match(/"([^"]+)"/)[1]
  );
  const unique = new Set(urls);
  console.log(`\n验证结果:`);
  console.log(`  总线路数: ${urls.length}`);
  console.log(`  唯一图片数: ${unique.size}`);
  console.log(`  本次更新: ${filled}条`);
}

main().catch(console.error);
