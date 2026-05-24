import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "径迹";
  workbook.created = new Date();

  // ========== 缺失数据线路 ==========
  const routes = [
    {
      id: "yichun-sanzhaolun-stream",
      name: "三爪仑溯溪线",
      location: "宜春·靖安",
      ascent: "",
      descent: "",
      terrain: "water_crossing,forest",
      remoteLevel: "backcountry",
      waterAvailability: "frequent",
      resupplyAvailability: "none",
      signalCoverage: "partial",
    },
    {
      id: "yichun-wugong-mingyueshan",
      name: "武功山沈明线明月山段",
      location: "宜春·萍乡/吉安",
      ascent: "",
      descent: "",
      terrain: "ridge,rocky,scree,forest",
      remoteLevel: "backcountry",
      waterAvailability: "limited",
      resupplyAvailability: "none",
      signalCoverage: "partial",
    },
    {
      id: "yichun-mingyueshan-waterfall",
      name: "明月山云谷飞瀑溯溪线",
      location: "宜春·明月山",
      ascent: "",
      descent: "",
      terrain: "water_crossing,rocky,forest",
      remoteLevel: "scenic",
      waterAvailability: "frequent",
      resupplyAvailability: "limited",
      signalCoverage: "partial",
    },
    {
      id: "fuzhou-lingufeng-loop",
      name: "灵谷峰后山环线",
      location: "抚州",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "fuzhou-yiqian-ancient-road",
      name: "驿前古镇明清古驿道",
      location: "抚州·广昌",
      ascent: "",
      descent: "",
      terrain: "forest",
      remoteLevel: "urban",
      waterAvailability: "limited",
      resupplyAvailability: "easy",
      signalCoverage: "full",
    },
    {
      id: "fuzhou-yaoxi-lotus-road",
      name: "广昌姚西莲花池古驿道",
      location: "抚州·广昌",
      ascent: "",
      descent: "",
      terrain: "forest",
      remoteLevel: "urban",
      waterAvailability: "frequent",
      resupplyAvailability: "easy",
      signalCoverage: "full",
    },
    {
      id: "nanchang-meiling-208-loop",
      name: "梅岭208高地环线",
      location: "南昌·湾里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "nanchang-meiling-anfengjian-loop",
      name: "梅岭安峰尖环线",
      location: "南昌·湾里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "nanchang-meiling-hutou-loop",
      name: "梅岭虎头图案环线",
      location: "南昌·湾里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "nanchang-meiling-jiangxi-map",
      name: "梅岭江西地图图案环线",
      location: "南昌·湾里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "nanchang-meiling-ancient-road",
      name: "梅岭千年古驿道环线",
      location: "南昌·湾里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "full",
    },
    {
      id: "jiujiang-lushan-hanyangfeng",
      name: "庐山长垅涧登汉阳峰线",
      location: "九江·庐山",
      ascent: "",
      descent: "",
      terrain: "rocky,scree,ridge",
      remoteLevel: "backcountry",
      waterAvailability: "limited",
      resupplyAvailability: "none",
      signalCoverage: "partial",
    },
    {
      id: "jiujiang-lushan-shoumalin",
      name: "庐山瘦马岭小路",
      location: "九江·庐山",
      ascent: "",
      descent: "",
      terrain: "rocky,forest,scree",
      remoteLevel: "backcountry",
      waterAvailability: "limited",
      resupplyAvailability: "none",
      signalCoverage: "partial",
    },
    {
      id: "jiujiang-lushan-glacier-stone",
      name: "庐山冰川石小路",
      location: "九江·庐山",
      ascent: "",
      descent: "",
      terrain: "rocky,scree",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "partial",
    },
    {
      id: "yingtan-longhushan-trekking",
      name: "龙虎山非景区重装线",
      location: "鹰潭·龙虎山",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "backcountry",
      waterAvailability: "limited",
      resupplyAvailability: "none",
      signalCoverage: "partial",
    },
    {
      id: "jingdezhen-yaoli-ancient-road",
      name: "瑶里古驿道徒步线",
      location: "景德镇·瑶里",
      ascent: "",
      descent: "",
      terrain: "forest,rocky",
      remoteLevel: "scenic",
      waterAvailability: "limited",
      resupplyAvailability: "limited",
      signalCoverage: "partial",
    },
  ];

  // ========== 数据填写 Sheet ==========
  const dataSheet = workbook.addWorksheet("线路数据补齐", {
    properties: { tabColor: { argb: "22C55E" } },
  });

  const columns = [
    { header: "线路ID", key: "id", width: 35 },
    { header: "线路名称", key: "name", width: 28 },
    { header: "所属区域", key: "location", width: 16 },
    { header: "累计爬升(m)", key: "ascent", width: 14 },
    { header: "累计下降(m)", key: "descent", width: 14 },
    { header: "地形类型", key: "terrain", width: 28 },
    { header: "偏远程度", key: "remoteLevel", width: 14 },
    { header: "水源情况", key: "waterAvailability", width: 14 },
    { header: "补给条件", key: "resupplyAvailability", width: 14 },
    { header: "信号覆盖", key: "signalCoverage", width: 14 },
    { header: "备注", key: "notes", width: 30 },
  ];

  dataSheet.columns = columns;

  // 表头样式 - 橙色
  dataSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F97316" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  });
  dataSheet.getRow(1).height = 32;

  // 待填写列样式（爬升、下降）- 黄色高亮
  const pendingFill = { type: "pattern", pattern: "solid", fgColor: { argb: "FEF9C3" } };

  // 写入数据
  routes.forEach((route, i) => {
    const row = dataSheet.getRow(i + 2);
    row.values = {
      id: route.id,
      name: route.name,
      location: route.location,
      ascent: route.ascent,
      descent: route.descent,
      terrain: route.terrain,
      remoteLevel: route.remoteLevel,
      waterAvailability: route.waterAvailability,
      resupplyAvailability: route.resupplyAvailability,
      signalCoverage: route.signalCoverage,
      notes: "",
    };

    // 交替行底色
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7ED" } };
      });
    }

    // 爬升/下降列黄色高亮
    row.getCell("ascent").fill = pendingFill;
    row.getCell("descent").fill = pendingFill;

    // 对齐方式
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });
  });

  dataSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 字段说明 Sheet ==========
  const docSheet = workbook.addWorksheet("字段说明", {
    properties: { tabColor: { argb: "3B82F6" } },
  });

  docSheet.columns = [
    { header: "字段名", key: "field", width: 18 },
    { header: "说明", key: "desc", width: 50 },
    { header: "填写规范", key: "format", width: 40 },
    { header: "示例", key: "example", width: 25 },
  ];

  docSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  docSheet.getRow(1).height = 32;

  const docs = [
    { field: "累计爬升(m)", desc: "GPS轨迹记录的全程累计海拔上升", format: "纯数字，单位米", example: "1200" },
    { field: "累计下降(m)", desc: "GPS轨迹记录的全程累计海拔下降", format: "纯数字，单位米", example: "1500" },
    { field: "地形类型", desc: "路线涉及的主要地形", format: "逗号分隔，可多选", example: "forest,rocky,scree" },
    { field: "偏远程度", desc: "出事后多久能获救", format: "单选：urban/scenic/backcountry/expedition", example: "backcountry" },
    { field: "水源情况", desc: "沿途水源分布", format: "单选：frequent/limited/none", example: "limited" },
    { field: "补给条件", desc: "沿途补给点情况", format: "单选：easy/limited/none", example: "none" },
    { field: "信号覆盖", desc: "手机信号情况", format: "单选：full/partial/none", example: "partial" },
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

  // 地形类型说明
  const terrainTitleRow = docSheet.getRow(docs.length + 4);
  terrainTitleRow.values = { field: "地形类型可选值", desc: "", format: "", example: "" };
  terrainTitleRow.getCell(1).font = { bold: true };

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
    { header: "说明", key: "desc", width: 25 },
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
    { level: "urban", desc: "城市周边", scenario: "城市公园、近郊步道、景区硬化路面", impact: "基础装备即可，手机信号全覆盖，救援快速" },
    { level: "scenic", desc: "景区成熟", scenario: "成熟景区、有工作人员、有商店/卫生间", impact: "标准装备，有基本补给，信号较好" },
    { level: "backcountry", desc: "野外无人区", scenario: "非景区山野、无商店、可能无信号", impact: "需要完整导航、应急装备、净水系统、充足食物" },
    { level: "expedition", desc: "探险级", scenario: "高海拔无人区、极端天气、多日无补给", impact: "需要卫星通讯、完整应急系统、专业装备" },
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

  // ========== 保存 ==========
  const outputPath = path.join(__dirname, "..", "线路数据补齐模板.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  console.log(`模板已生成: ${outputPath}`);
  console.log(`待补齐线路: ${routes.length}条`);
}

generateTemplate().catch(console.error);
