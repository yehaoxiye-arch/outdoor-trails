import ExcelJS from "exceljs";

async function readExcel() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("D:\\线路数据更新_完整版.xlsx");

  const sheet = workbook.worksheets[0];

  // 读取表头
  const headers = [];
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.value;
  });

  // 读取所有数据
  const routes = [];
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const item = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (header) item[header] = cell.value;
    });
    if (item["线路ID"]) {
      routes.push(item);
    }
  }

  // 找出缺失数据的线路
  const missingRoutes = routes.filter(r =>
    !r["累计爬升(m)"] || r["累计爬升(m)"] === "" ||
    !r["地形类型"] || r["地形类型"] === ""
  );

  console.log("=== 缺失数据的线路 ===");
  missingRoutes.forEach(r => {
    console.log(`\n${r["线路名称"]} (${r["线路ID"]})`);
    console.log(`  山脉: ${r["所属山脉"]}`);
    console.log(`  爬升: ${r["累计爬升(m)"] || "缺失"}`);
    console.log(`  下降: ${r["累计下降(m)"] || "缺失"}`);
    console.log(`  地形: ${r["地形类型"] || "缺失"}`);
    console.log(`  偏远: ${r["偏远程度"] || "缺失"}`);
    console.log(`  水源: ${r["水源情况"] || "缺失"}`);
    console.log(`  补给: ${r["补给条件"] || "缺失"}`);
    console.log(`  信号: ${r["信号覆盖"] || "缺失"}`);
  });
}

readExcel().catch(console.error);
