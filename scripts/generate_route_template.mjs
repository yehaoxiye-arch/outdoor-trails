import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "径迹";
  workbook.created = new Date();

  // ========== 读取线路数据 ==========
  const routesPath = path.join(__dirname, "..", "src", "data", "routes.ts");
  const routesContent = fs.readFileSync(routesPath, "utf-8");

  // 简单解析线路数据
  const routes = [];
  const routeRegex = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*province:\s*"([^"]+)",\s*location:\s*"([^"]+)",\s*mountainRange:\s*"([^"]*)",/g;
  let match;
  while ((match = routeRegex.exec(routesContent)) !== null) {
    routes.push({
      id: match[1],
      name: match[2],
      province: match[3],
      location: match[4],
      mountainRange: match[5],
    });
  }

  // ========== 线路数据更新模板 ==========
  const routeSheet = workbook.addWorksheet("线路数据更新", {
    properties: { tabColor: { argb: "22C55E" } },
  });

  const columns = [
    { header: "线路ID", key: "id", width: 30 },
    { header: "线路名称", key: "name", width: 30 },
    { header: "所属山脉", key: "mountainRange", width: 15 },
    { header: "累计爬升(m)", key: "ascent", width: 14 },
    { header: "累计下降(m)", key: "descent", width: 14 },
    { header: "地形类型", key: "terrain", width: 30 },
    { header: "偏远程度", key: "remoteLevel", width: 14 },
    { header: "水源情况", key: "waterAvailability", width: 14 },
    { header: "补给条件", key: "resupplyAvailability", width: 14 },
    { header: "信号覆盖", key: "signalCoverage", width: 14 },
    { header: "最佳季节", key: "bestSeason", width: 20 },
    { header: "数据状态", key: "status", width: 12 },
    { header: "备注", key: "notes", width: 30 },
  ];

  routeSheet.columns = columns;

  // 表头样式
  routeSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "22C55E" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  routeSheet.getRow(1).height = 32;

  // 写入线路数据
  routes.forEach((route, i) => {
    const row = routeSheet.getRow(i + 2);
    row.values = {
      id: route.id,
      name: route.name,
      mountainRange: route.mountainRange,
      ascent: "",
      descent: "",
      terrain: "",
      remoteLevel: "",
      waterAvailability: "",
      resupplyAvailability: "",
      signalCoverage: "",
      bestSeason: "",
      status: "",
      notes: "",
    };
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F0FDF4" } };
      });
    }
  });

  routeSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 字段说明 Sheet ==========
  const docSheet = workbook.addWorksheet("字段说明", {
    properties: { tabColor: { argb: "3B82F6" } },
  });

  docSheet.columns = [
    { header: "字段名", key: "field", width: 18 },
    { header: "说明", key: "desc", width: 50 },
    { header: "填写规范", key: "format", width: 40 },
    { header: "示例", key: "example", width: 30 },
  ];

  docSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  docSheet.getRow(1).height = 32;

  const docs = [
    { field: "累计爬升(m)", desc: "路线全程的累计海拔上升高度", format: "纯数字，单位米", example: "1200" },
    { field: "累计下降(m)", desc: "路线全程的累计海拔下降高度", format: "纯数字，单位米", example: "1500" },
    { field: "地形类型", desc: "路线涉及的主要地形，可多选", format: "用逗号分隔，可选值见下方", example: "forest,rocky,scree" },
    { field: "偏远程度", desc: "路线的偏远程度，决定应急装备需求", format: "单选：urban/scenic/backcountry/expedition", example: "backcountry" },
    { field: "水源情况", desc: "路线沿途水源分布情况", format: "单选：frequent/limited/none", example: "limited" },
    { field: "补给条件", desc: "路线沿途补给点（山屋/客栈/商店）情况", format: "单选：easy/limited/none", example: "none" },
    { field: "信号覆盖", desc: "手机信号覆盖情况", format: "单选：full/partial/none", example: "partial" },
    { field: "最佳季节", desc: "适合徒步的最佳月份或季节", format: "自由填写", example: "4-5月、9-11月" },
  ];

  docs.forEach((doc, i) => {
    const row = docSheet.getRow(i + 2);
    row.values = doc;
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "EFF6FF" } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  // 添加地形类型说明
  const terrainRow = docSheet.getRow(docs.length + 4);
  terrainRow.values = { field: "地形类型可选值", desc: "", format: "", example: "" };
  terrainRow.getCell(1).font = { bold: true };

  const terrainTypes = [
    { value: "forest", desc: "林道/森林小径" },
    { value: "rocky", desc: "岩石路段" },
    { value: "scree", desc: "碎石坡" },
    { value: "snow", desc: "雪地/冰川" },
    { value: "mud", desc: "泥泞路段" },
    { value: "water_crossing", desc: "涉水/溪流穿越" },
    { value: "ridge", desc: "山脊线" },
    { value: "desert", desc: "沙漠/戈壁" },
  ];

  terrainTypes.forEach((type, i) => {
    const row = docSheet.getRow(docs.length + 5 + i);
    row.values = { field: type.value, desc: type.desc };
  });

  docSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 偏远程度参考 Sheet ==========
  const remoteSheet = workbook.addWorksheet("偏远程度参考", {
    properties: { tabColor: { argb: "F59E0B" } },
  });

  remoteSheet.columns = [
    { header: "等级", key: "level", width: 15 },
    { header: "说明", key: "desc", width: 40 },
    { header: "典型场景", key: "scenario", width: 50 },
    { header: "装备影响", key: "impact", width: 50 },
  ];

  remoteSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F59E0B" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  remoteSheet.getRow(1).height = 32;

  const remoteLevels = [
    {
      level: "urban",
      desc: "城市周边",
      scenario: "城市公园、近郊步道、景区硬化路面",
      impact: "基础装备即可，手机信号全覆盖，救援快速",
    },
    {
      level: "scenic",
      desc: "景区成熟",
      scenario: "成熟景区、有工作人员、有商店/卫生间",
      impact: "标准装备，有基本补给，信号较好",
    },
    {
      level: "backcountry",
      desc: "野外无人区",
      scenario: "非景区山野、无商店、可能无信号",
      impact: "需要完整导航、应急装备、净水系统、充足食物",
    },
    {
      level: "expedition",
      desc: "探险级",
      scenario: "高海拔无人区、极端天气、多日无补给",
      impact: "需要卫星通讯、完整应急系统、专业装备",
    },
  ];

  remoteLevels.forEach((level, i) => {
    const row = remoteSheet.getRow(i + 2);
    row.values = level;
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFBEB" } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  remoteSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 使用说明 Sheet ==========
  const usageSheet = workbook.addWorksheet("使用说明", {
    properties: { tabColor: { argb: "8B5CF6" } },
  });

  usageSheet.columns = [
    { header: "项目", key: "item", width: 20 },
    { header: "说明", key: "desc", width: 60 },
  ];

  usageSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8B5CF6" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  usageSheet.getRow(1).height = 32;

  const usage = [
    { item: "数据来源", desc: "累计爬升/下降可从两步路、六只脚等户外APP获取" },
    { item: "地形类型", desc: "根据实际路线地形勾选，可多选，用逗号分隔" },
    { item: "偏远程度", desc: "参考\"偏远程度参考\"表，根据实际情况选择" },
    { item: "水源情况", desc: "frequent=每隔1-2km有水, limited=偶尔有水, none=无水源" },
    { item: "补给条件", desc: "easy=有山屋/客栈, limited=偶尔有小卖部, none=无补给" },
    { item: "信号覆盖", desc: "full=全程有信号, partial=部分有信号, none=无信号" },
    { item: "完成标记", desc: "在\"数据状态\"列填写\"已完成\"标记已更新的线路" },
    { item: "优先级", desc: "建议先更新热门线路和难度较大的线路" },
  ];

  usage.forEach((item, i) => {
    const row = usageSheet.getRow(i + 2);
    row.values = item;
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F5F3FF" } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  usageSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 保存 ==========
  const outputPath = path.join(__dirname, "..", "线路数据更新模板.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  console.log(`模板已生成: ${outputPath}`);
  console.log(`线路数量: ${routes.length}`);
}

generateTemplate().catch(console.error);
