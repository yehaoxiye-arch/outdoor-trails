const ExcelJS = require("exceljs");

async function readData() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile("D:/江西省徒步路线信息采集_完整版_补充数据.xlsx");

  console.log("=== Sheets ===");
  wb.eachSheet((sheet, id) => {
    console.log(`${id}: ${sheet.name} (${sheet.rowCount} rows)`);
  });

  // Read first sheet
  const ws = wb.worksheets[0];
  console.log(`\n=== Sheet: ${ws.name} ===\n`);

  // Print all rows
  ws.eachRow((row, rowNumber) => {
    const values = [];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      values.push(cell.value);
    });
    console.log(`Row ${rowNumber}: ${JSON.stringify(values)}`);
  });
}

readData().catch(console.error);
