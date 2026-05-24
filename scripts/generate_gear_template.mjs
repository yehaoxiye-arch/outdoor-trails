import ExcelJS from "exceljs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "径迹";
  workbook.created = new Date();

  // ========== 字段定义 ==========
  const columns = [
    { header: "品类", key: "category", width: 12 },
    { header: "子品类", key: "subcategory", width: 14 },
    { header: "品牌", key: "brand", width: 14 },
    { header: "产品名称", key: "name", width: 28 },
    { header: "重量(g)", key: "weight", width: 10 },
    { header: "材质", key: "material", width: 18 },
    { header: "尺寸/容量", key: "size", width: 14 },
    { header: "适用季节", key: "season", width: 14 },
    { header: "温度评级(℃)", key: "tempRating", width: 14 },
    { header: "防水等级", key: "waterproof", width: 14 },
    { header: "透气性", key: "breathability", width: 12 },
    { header: "建议零售价(元)", key: "priceRetail", width: 16 },
    { header: "实际售价(元)", key: "priceActual", width: 16 },
    { header: "适用场景", key: "useCase", width: 18 },
    { header: "适用难度", key: "difficulty", width: 12 },
    { header: "产品链接", key: "url", width: 30 },
    { header: "图片链接", key: "imageUrl", width: 30 },
    { header: "备注", key: "notes", width: 24 },
  ];

  // ========== 分类与示例数据 ==========
  const categories = [
    {
      name: "鞋类",
      items: [
        { subcategory: "登山鞋", brand: "Salomon", name: "X Ultra 4 GTX", weight: "385", material: "合成纤维+Gore-Tex", size: "42", season: "四季", tempRating: "-10~30", waterproof: "Gore-Tex防水", breathability: "中", priceRetail: "1299", priceActual: "", useCase: "技术地形徒步", difficulty: "中等~困难", url: "", imageUrl: "", notes: "中帮，Contagrip大底" },
        { subcategory: "徒步鞋", brand: "Merrell", name: "Moab 3 Ventilator", weight: "340", material: "网布+合成革", size: "42", season: "春夏秋", tempRating: "5~35", waterproof: "无", breathability: "高", priceRetail: "699", priceActual: "", useCase: "轻装日间徒步", difficulty: "简单~中等", url: "", imageUrl: "", notes: "低帮，Vibram大底" },
        { subcategory: "越野跑鞋", brand: "HOKA", name: "Speedgoat 5", weight: "291", material: "工程网布", size: "42", season: "四季", tempRating: "-5~35", waterproof: "无(可选防水版)", breathability: "高", priceRetail: "1199", priceActual: "", useCase: "越野跑/快节奏徒步", difficulty: "简单~中等", url: "", imageUrl: "", notes: "Vibram Megagrip大底" },
        { subcategory: "溯溪鞋", brand: "KEEN", name: "Newport H2", weight: "340", material: "涤纶带+橡胶底", size: "42", season: "夏季", tempRating: "15~40", waterproof: "速干", breathability: "高", priceRetail: "599", priceActual: "", useCase: "溪谷/涉水路线", difficulty: "简单~中等", url: "", imageUrl: "", notes: "护趾设计" },
      ],
    },
    {
      name: "上装",
      items: [
        { subcategory: "冲锋衣", brand: "Arc'teryx", name: "Beta LT Jacket", weight: "350", material: "Gore-Tex Pro", size: "M", season: "四季", tempRating: "-20~15", waterproof: "28000mm", breathability: "高", priceRetail: "4998", priceActual: "", useCase: "恶劣天气/技术登山", difficulty: "困难~极难", url: "", imageUrl: "", notes: "N80p-X面料，头盔兼容" },
        { subcategory: "软壳衣", brand: "The North Face", name: "Apex Flex GTX", weight: "480", material: "Gore-Tex Infinium", size: "M", season: "秋冬春", tempRating: "-15~10", waterproof: "防风防泼水", breathability: "高", priceRetail: "1599", priceActual: "", useCase: "中等强度徒步", difficulty: "简单~中等", url: "", imageUrl: "", notes: "弹性面料，适合动态活动" },
        { subcategory: "抓绒衣", brand: "Patagonia", name: "R1 Air Full-Zip", weight: "280", material: "再生聚酯抓绒", size: "M", season: "秋冬春", tempRating: "-10~15", waterproof: "无", breathability: "高", priceRetail: "1099", priceActual: "", useCase: "中间保暖层", difficulty: "简单~困难", url: "", imageUrl: "", notes: "轻量透气，可压缩" },
        { subcategory: "羽绒服", brand: "Montbell", name: "Plasma 1000 Alpine", weight: "148", material: "1000蓬鹅绒+7D尼龙", size: "M", season: "冬季", tempRating: "-25~5", waterproof: "防泼水", breathability: "低", priceRetail: "2999", priceActual: "", useCase: "极寒环境/营地保暖", difficulty: "中等~极难", url: "", imageUrl: "", notes: "收纳仅拳头大小" },
        { subcategory: "速干衣", brand: "Columbia", name: "PFG Zero Rules", weight: "120", material: "Omni-Wick速干面料", size: "M", season: "夏季", tempRating: "15~40", waterproof: "无", breathability: "极高", priceRetail: "299", priceActual: "", useCase: "夏季徒步/日常", difficulty: "简单", url: "", imageUrl: "", notes: "UPF 30防晒" },
        { subcategory: "皮肤衣", brand: "Decathlon", name: "MH500 超轻风衣", weight: "95", material: "抗撕裂尼龙", size: "M", season: "春夏秋", tempRating: "10~30", waterproof: "防泼水", breathability: "中", priceRetail: "149", priceActual: "", useCase: "防风防晒", difficulty: "简单", url: "", imageUrl: "", notes: "可收纳进口袋" },
      ],
    },
    {
      name: "下装",
      items: [
        { subcategory: "冲锋裤", brand: "Arc'teryx", name: "Beta Pant", weight: "310", material: "Gore-Tex", size: "M", season: "四季", tempRating: "-20~15", waterproof: "28000mm", breathability: "中", priceRetail: "2998", priceActual: "", useCase: "恶劣天气/暴雨", difficulty: "困难~极难", url: "", imageUrl: "", notes: "侧拉链设计" },
        { subcategory: "软壳裤", brand: "Fjällräven", name: "Keb Trouser", weight: "490", material: "G-1000+弹力面料", size: "48", season: "秋冬春", tempRating: "-10~20", waterproof: "防泼水(打蜡后)", breathability: "高", priceRetail: "1599", priceActual: "", useCase: "技术徒步/登山", difficulty: "中等~困难", url: "", imageUrl: "", notes: "膝盖加固，可打蜡" },
        { subcategory: "速干裤", brand: "Prana", name: "Stretch Zion II", weight: "310", material: "弹力尼龙", size: "32", season: "春夏秋", tempRating: "5~35", waterproof: "防泼水", breathability: "高", priceRetail: "599", priceActual: "", useCase: "日常徒步/旅行", difficulty: "简单~中等", url: "", imageUrl: "", notes: "可卷裤腿" },
        { subcategory: "压缩裤", brand: "2XU", name: "Light Speed Compression", weight: "180", material: "弹力涤纶", size: "M", season: "四季", tempRating: "0~30", waterproof: "无", breathability: "高", priceRetail: "699", priceActual: "", useCase: "长距离徒步/恢复", difficulty: "中等~困难", url: "", imageUrl: "", notes: "梯度压缩" },
      ],
    },
    {
      name: "背包",
      items: [
        { subcategory: "日用背包(15-25L)", brand: "Osprey", name: "Talon 22", weight: "680", material: "100D尼龙", size: "22L", season: "四季", tempRating: "", waterproof: "防泼水罩", breathability: "", priceRetail: "899", priceActual: "", useCase: "日间轻装徒步", difficulty: "简单~中等", url: "", imageUrl: "", notes: "AirSpeed背板，腰带口袋" },
        { subcategory: "多日背包(40-60L)", brand: "Gregory", name: "Baltoro 65", weight: "2130", material: "210D尼龙", size: "65L", season: "四季", tempRating: "", waterproof: "防水面料", breathability: "", priceRetail: "2199", priceActual: "", useCase: "3-7日重装穿越", difficulty: "中等~困难", url: "", imageUrl: "", notes: "Response A3背负系统" },
        { subcategory: "轻量化背包", brand: "Granite Gear", name: "Crown2 38", weight: "850", material: "100D Robic尼龙", size: "38L", season: "四季", tempRating: "", waterproof: "防泼水", breathability: "", priceRetail: "1199", priceActual: "", useCase: "轻量化多日徒步", difficulty: "中等", url: "", imageUrl: "", notes: "可拆卸顶包" },
        { subcategory: "冲顶包", brand: "Black Diamond", name: "Distance 15", weight: "260", material: "UHMWPE面料", size: "15L", season: "四季", tempRating: "", waterproof: "防泼水", breathability: "", priceRetail: "599", priceActual: "", useCase: "冲顶/快速突击", difficulty: "困难~极难", url: "", imageUrl: "", notes: "极轻，可折叠收纳" },
      ],
    },
    {
      name: "帐篷",
      items: [
        { subcategory: "单人帐", brand: "MSR", name: "Hubba Hubba NX 1P", weight: "910", material: "20D尼龙+DAC铝合金杆", size: "1人", season: "三季", tempRating: "", waterproof: "1200mm", breathability: "", priceRetail: "2999", priceActual: "", useCase: "solo轻量化露营", difficulty: "中等~困难", url: "", imageUrl: "", notes: "自立式，双门双厅" },
        { subcategory: "双人帐", brand: "Big Agnes", name: "Copper Spur HV UL2", weight: "1190", material: "Solution Dyed尼龙", size: "2人", season: "三季", tempRating: "", waterproof: "1200mm", breathability: "", priceRetail: "3699", priceActual: "", useCase: "双人轻量化露营", difficulty: "中等~困难", url: "", imageUrl: "", notes: "高容量设计" },
        { subcategory: "三人帐", brand: "Naturehike", name: "Cloud-Up 3", weight: "2100", material: "210T涤纶+玻璃纤维杆", size: "3人", season: "三季", tempRating: "", waterproof: "3000mm", breathability: "", priceRetail: "599", priceActual: "", useCase: "经济型多人露营", difficulty: "简单~中等", url: "", imageUrl: "", notes: "性价比高" },
        { subcategory: "四季帐", brand: "Hilleberg", name: "Soulo", weight: "1900", material: "Kerlon 1200面料", size: "1人", season: "四季", tempRating: "", waterproof: "防水", breathability: "", priceRetail: "6999", priceActual: "", useCase: "极地/冬季露营", difficulty: "困难~极难", url: "", imageUrl: "", notes: "极强抗风性" },
      ],
    },
    {
      name: "睡眠系统",
      items: [
        { subcategory: "羽绒睡袋", brand: "Western Mountaineering", name: "UltraLite 20", weight: "795", material: "850蓬鹅绒+12D尼龙", size: "183cm", season: "三季", tempRating: "-7(舒适)/-15(极限)", waterproof: "防泼水处理", breathability: "", priceRetail: "3299", priceActual: "", useCase: "三季露营", difficulty: "中等~困难", url: "", imageUrl: "", notes: "Mummy木乃伊型" },
        { subcategory: "化纤睡袋", brand: "Marmot", name: "Trestles Elite Eco 20", weight: "1190", material: "Eco合成纤维", size: "183cm", season: "三季", tempRating: "-7(舒适)/-15(极限)", waterproof: "防泼水", breathability: "", priceRetail: "999", priceActual: "", useCase: "潮湿环境露营", difficulty: "简单~中等", url: "", imageUrl: "", notes: "湿环境保暖性优于羽绒" },
        { subcategory: "充气睡垫", brand: "Therm-a-Rest", name: "NeoAir XTherm", weight: "430", material: "30D尼龙+铝膜", size: "51x183cm", season: "四季", tempRating: "R值6.9", waterproof: "", breathability: "", priceRetail: "1699", priceActual: "", useCase: "冬季/高海拔露营", difficulty: "中等~极难", url: "", imageUrl: "", notes: "R值6.9，极致保暖" },
        { subcategory: "泡沫睡垫", brand: "NEMO", name: "Switchback", weight: "415", material: "闭孔泡沫", size: "51x183cm", season: "三季", tempRating: "R值2.0", waterproof: "", breathability: "", priceRetail: "299", priceActual: "", useCase: "轻量化/备用垫", difficulty: "简单~中等", url: "", imageUrl: "", notes: "不会破损，可靠" },
      ],
    },
    {
      name: "炊具饮水",
      items: [
        { subcategory: "一体式炉头", brand: "Jetboil", name: "Flash", weight: "372", material: "铝合金+不锈钢", size: "1L", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "999", priceActual: "", useCase: "快速烧水/单人炊事", difficulty: "简单~中等", url: "", imageUrl: "", notes: "压电点火，煮沸1L=100秒" },
        { subcategory: "分体式炉头", brand: "SOTO", name: "WindMaster", weight: "67", material: "铝合金+不锈钢", size: "", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "699", priceActual: "", useCase: "大锅烹饪/高海拔", difficulty: "中等~困难", url: "", imageUrl: "", notes: "抗风性能优秀" },
        { subcategory: "套锅", brand: "Snow Peak", name: "Trek 900", weight: "200", material: "硬质氧化铝", size: "900ml", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "399", priceActual: "", useCase: "单人炊事", difficulty: "简单~中等", url: "", imageUrl: "", notes: "可收纳炉头和气罐" },
        { subcategory: "钛杯", brand: "TOAKS", name: "Titanium Cup 450ml", weight: "65", material: "钛合金", size: "450ml", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "199", priceActual: "", useCase: "饮水/冲泡", difficulty: "简单", url: "", imageUrl: "", notes: "带刻度，可直接加热" },
        { subcategory: "水袋", brand: "Platypus", name: "Big Zip EVO 3L", weight: "118", material: "BPA-free聚乙烯", size: "3L", season: "四季", tempRating: "", waterproof: "密封", breathability: "", priceRetail: "199", priceActual: "", useCase: "徒步途中饮水", difficulty: "简单", url: "", imageUrl: "", notes: "滑块封口，易清洁" },
        { subcategory: "净水器", brand: "Sawyer", name: "Squeeze", weight: "95", material: "中空纤维膜", size: "", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "299", priceActual: "", useCase: "长线/野外水源", difficulty: "中等~困难", url: "", imageUrl: "", notes: "过滤精度0.1微米" },
      ],
    },
    {
      name: "导航照明",
      items: [
        { subcategory: "头灯", brand: "Petzl", name: "Actik Core", weight: "82", material: "", size: "600流明", season: "四季", tempRating: "", waterproof: "IPX4", breathability: "", priceRetail: "399", priceActual: "", useCase: "夜间徒步/营地", difficulty: "简单~困难", url: "", imageUrl: "", notes: "可充电，红光模式" },
        { subcategory: "GPS手持机", brand: "Garmin", name: "inReach Mini 2", weight: "100", material: "", size: "", season: "四季", tempRating: "", waterproof: "IPX7", breathability: "", priceRetail: "2699", priceActual: "", useCase: "导航/紧急求救", difficulty: "中等~极难", url: "", imageUrl: "", notes: "双向卫星通讯" },
      ],
    },
    {
      name: "登山杖",
      items: [
        { subcategory: "伸缩杖", brand: "Black Diamond", name: "Trail Ergo Cork", weight: "490(一对)", material: "铝合金+软木", size: "63-130cm", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "599", priceActual: "", useCase: "通用徒步", difficulty: "简单~困难", url: "", imageUrl: "", notes: "Ergo人体工学握把" },
        { subcategory: "折叠杖", brand: "Leki", name: "Micro Trail Pro", weight: "230(一根)", material: "碳纤维+软木", size: "110-130cm", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "899", priceActual: "", useCase: "越野跑/快速徒步", difficulty: "中等~困难", url: "", imageUrl: "", notes: "折叠收纳37cm" },
      ],
    },
    {
      name: "安全急救",
      items: [
        { subcategory: "急救包", brand: "Adventure Medical Kits", name: "Ultralight/Watertight .7", weight: "255", material: "", size: "", season: "四季", tempRating: "", waterproof: "防水袋", breathability: "", priceRetail: "299", priceActual: "", useCase: "1-4人户外急救", difficulty: "简单~困难", url: "", imageUrl: "", notes: "含常用急救物品" },
        { subcategory: "求生哨", brand: "SOL", name: "Slim Rescue Howler", weight: "20", material: "塑料", size: "", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "39", priceActual: "", useCase: "紧急求救", difficulty: "简单", url: "", imageUrl: "", notes: "100分贝以上" },
        { subcategory: "救生毯", brand: "SOL", name: "Emergency Blanket", weight: "57", material: "金属化聚酯", size: "152x213cm", season: "四季", tempRating: "", waterproof: "防水", breathability: "", priceRetail: "29", priceActual: "", useCase: "失温急救/防风雨", difficulty: "简单", url: "", imageUrl: "", notes: "可重复使用" },
      ],
    },
    {
      name: "服装配件",
      items: [
        { subcategory: "徒步袜", brand: "Darn Tough", name: "Hiker Micro Crew", weight: "80", material: "美利奴羊毛", size: "M", season: "四季", tempRating: "", waterproof: "", breathability: "高", priceRetail: "199", priceActual: "", useCase: "长距离徒步", difficulty: "简单~困难", url: "", imageUrl: "", notes: "终身质保" },
        { subcategory: "遮阳帽", brand: "Sunday Afternoons", name: "Ultra Adventure Hat", weight: "76", material: "尼龙", size: "M/L", season: "春夏秋", tempRating: "", waterproof: "", breathability: "高", priceRetail: "249", priceActual: "", useCase: "防晒遮阳", difficulty: "简单", url: "", imageUrl: "", notes: "UPF 50+，可折叠" },
        { subcategory: "手套", brand: "Black Diamond", name: "Montana", weight: "120", material: "Gore-Tex+Primaloft", size: "M", season: "冬季", tempRating: "-15~5", waterproof: "Gore-Tex", breathability: "中", priceRetail: "499", priceActual: "", useCase: "冬季徒步/登山", difficulty: "中等~困难", url: "", imageUrl: "", notes: "触屏兼容" },
        { subcategory: "魔术头巾", brand: "Buff", name: "CoolNet UV+", weight: "30", material: "再生涤纶", size: "均码", season: "四季", tempRating: "", waterproof: "", breathability: "高", priceRetail: "149", priceActual: "", useCase: "防晒/保暖/擦汗", difficulty: "简单", url: "", imageUrl: "", notes: "UPF 50+，多功能" },
        { subcategory: "雪套", brand: "Outdoor Research", name: "Crocodile Gaiters", weight: "285", material: "Gore-Tex+防撕裂尼龙", size: "M", season: "冬雪季", tempRating: "", waterproof: "Gore-Tex", breathability: "中", priceRetail: "499", priceActual: "", useCase: "雪地/泥泞路段", difficulty: "中等~困难", url: "", imageUrl: "", notes: "前拉链设计" },
        { subcategory: "墨镜", brand: "Julbo", name: "Explorer 2.0", weight: "36", material: "聚碳酸酯镜片", size: "", season: "四季", tempRating: "", waterproof: "", breathability: "", priceRetail: "899", priceActual: "", useCase: "高海拔/雪地防紫外线", difficulty: "中等~极难", url: "", imageUrl: "", notes: "可变色镜片，侧翼防护" },
      ],
    },
  ];

  // ========== 示例数据 sheet ==========
  const exampleSheet = workbook.addWorksheet("示例数据", {
    properties: { tabColor: { argb: "22C55E" } },
  });

  exampleSheet.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  // 样式：表头
  const headerFill = { type: "pattern", pattern: "solid", fgColor: { argb: "22C55E" } };
  const headerFont = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
  const headerAlignment = { vertical: "middle", horizontal: "center", wrapText: true };

  exampleSheet.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = headerAlignment;
    cell.border = {
      bottom: { style: "thin", color: { argb: "16A34A" } },
    };
  });
  exampleSheet.getRow(1).height = 32;

  // 写入数据
  let rowIndex = 2;
  for (const cat of categories) {
    for (const item of cat.items) {
      exampleSheet.getRow(rowIndex).values = {
        category: cat.name,
        ...item,
      };
      // 交替行颜色
      if (rowIndex % 2 === 0) {
        exampleSheet.getRow(rowIndex).eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F0FDF4" } };
        });
      }
      exampleSheet.getRow(rowIndex).eachCell((cell) => {
        cell.alignment = { vertical: "middle" };
        cell.border = {
          bottom: { style: "hair", color: { argb: "E5E7EB" } },
        };
      });
      rowIndex++;
    }
  }

  // 自动筛选
  exampleSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rowIndex - 1, column: columns.length },
  };

  // 冻结首行
  exampleSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 空白模板 sheet ==========
  const templateSheet = workbook.addWorksheet("数据收集模板", {
    properties: { tabColor: { argb: "3B82F6" } },
  });

  templateSheet.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  templateSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "3B82F6" } };
    cell.font = headerFont;
    cell.alignment = headerAlignment;
    cell.border = {
      bottom: { style: "thin", color: { argb: "2563EB" } },
    };
  });
  templateSheet.getRow(1).height = 32;

  // 添加 50 个空白行（带交替色）
  for (let i = 2; i <= 200; i++) {
    if (i % 2 === 0) {
      templateSheet.getRow(i).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "EFF6FF" } };
      });
    }
  }

  // 冻结首行
  templateSheet.views = [{ state: "frozen", ySplit: 1 }];

  // 自动筛选
  templateSheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 200, column: columns.length },
  };

  // ========== 数据说明 sheet ==========
  const docSheet = workbook.addWorksheet("字段说明", {
    properties: { tabColor: { argb: "F59E0B" } },
  });

  docSheet.columns = [
    { header: "字段名", key: "field", width: 18 },
    { header: "说明", key: "desc", width: 50 },
    { header: "填写示例", key: "example", width: 30 },
  ];

  docSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F59E0B" } };
    cell.font = headerFont;
    cell.alignment = headerAlignment;
  });
  docSheet.getRow(1).height = 32;

  const docs = [
    { field: "品类", desc: "一级分类，如：鞋类、上装、下装、背包、帐篷等", example: "鞋类" },
    { field: "子品类", desc: "二级分类，如：登山鞋、冲锋衣、羽绒睡袋等", example: "登山鞋" },
    { field: "品牌", desc: "产品品牌名称", example: "Salomon" },
    { field: "产品名称", desc: "完整的产品型号/名称", example: "X Ultra 4 GTX" },
    { field: "重量(g)", desc: "单件重量，单位克。鞋类填写单只重量", example: "385" },
    { field: "材质", desc: "主要面料/填充物材质", example: "合成纤维+Gore-Tex" },
    { field: "尺寸/容量", desc: "鞋码/L数/长度等尺寸信息", example: "42 / 65L / 183cm" },
    { field: "适用季节", desc: "适合使用的季节，可多选", example: "四季 / 春夏秋 / 冬季" },
    { field: "温度评级(℃)", desc: "适用温度范围（服装/睡袋填写）", example: "-10~30 / -7(舒适)/-15(极限)" },
    { field: "防水等级", desc: "防水性能指标", example: "Gore-Tex / 28000mm / IPX4 / 无" },
    { field: "透气性", desc: "透气等级：极高/高/中/低", example: "高" },
    { field: "建议零售价(元)", desc: "官方建议零售价，单位人民币", example: "1299" },
    { field: "实际售价(元)", desc: "当前市场实际成交价", example: "899" },
    { field: "适用场景", desc: "适合的户外活动类型", example: "技术地形徒步 / 3-7日重装穿越" },
    { field: "适用难度", desc: "适合的线路难度等级", example: "简单 / 中等 / 困难 / 极难" },
    { field: "产品链接", desc: "产品官网或购买链接", example: "https://..." },
    { field: "图片链接", desc: "产品图片URL", example: "https://..." },
    { field: "备注", desc: "补充信息：特色功能、优缺点等", example: "中帮，Contagrip大底" },
  ];

  docs.forEach((doc, i) => {
    const row = docSheet.getRow(i + 2);
    row.values = doc;
    if (i % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFBEB" } };
      });
    }
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
    });
  });

  docSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 品类参考 sheet ==========
  const catSheet = workbook.addWorksheet("品类参考", {
    properties: { tabColor: { argb: "8B5CF6" } },
  });

  catSheet.columns = [
    { header: "品类", key: "cat", width: 16 },
    { header: "子品类", key: "sub", width: 24 },
    { header: "是否已有示例", key: "hasExample", width: 14 },
    { header: "建议品牌参考", key: "brands", width: 50 },
  ];

  catSheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "8B5CF6" } };
    cell.font = headerFont;
    cell.alignment = headerAlignment;
  });
  catSheet.getRow(1).height = 32;

  const allCategories = [
    { cat: "鞋类", sub: "登山鞋", hasExample: "✓", brands: "Salomon, La Sportiva, Scarpa, Merrell" },
    { cat: "鞋类", sub: "徒步鞋", hasExample: "✓", brands: "Merrell, KEEN, Columbia, Decathlon" },
    { cat: "鞋类", sub: "越野跑鞋", hasExample: "✓", brands: "HOKA, Salomon, Altra, Brooks" },
    { cat: "鞋类", sub: "溯溪鞋", hasExample: "✓", brands: "KEEN, Chaco, Merrell" },
    { cat: "鞋类", sub: "雪套/绑腿", hasExample: "", brands: "Outdoor Research, Black Diamond" },
    { cat: "上装", sub: "硬壳冲锋衣", hasExample: "✓", brands: "Arc'teryx, Patagonia, Marmot, TNF" },
    { cat: "上装", sub: "软壳衣", hasExample: "✓", brands: "TNF, Arc'teryx, Mammut" },
    { cat: "上装", sub: "抓绒衣", hasExample: "✓", brands: "Patagonia, Arc'teryx, RAB" },
    { cat: "上装", sub: "羽绒服", hasExample: "✓", brands: "Montbell, RAB, Western Mountaineering" },
    { cat: "上装", sub: "棉服", hasExample: "", brands: "Patagonia, Arc'teryx, TNF" },
    { cat: "上装", sub: "速干衣", hasExample: "✓", brands: "Columbia, Patagonia, Arc'teryx" },
    { cat: "上装", sub: "皮肤衣/风衣", hasExample: "✓", brands: "Decathlon, Patagonia, TNF" },
    { cat: "上装", sub: "保暖内衣", hasExample: "", brands: "Icebreaker, Smartwool, Patagonia" },
    { cat: "下装", sub: "冲锋裤", hasExample: "✓", brands: "Arc'teryx, Marmot, RAB" },
    { cat: "下装", sub: "软壳裤", hasExample: "✓", brands: "Fjällräven, Arc'teryx, Mammut" },
    { cat: "下装", sub: "速干裤", hasExample: "✓", brands: "Prana, Columbia, KUHL" },
    { cat: "下装", sub: "压缩裤/腿套", hasExample: "✓", brands: "2XU, CEP, Compressport" },
    { cat: "背包", sub: "日用背包(15-25L)", hasExample: "✓", brands: "Osprey, Deuter, Gregory" },
    { cat: "背包", sub: "多日背包(40-60L)", hasExample: "✓", brands: "Gregory, Osprey, Deuter" },
    { cat: "背包", sub: "轻量化背包", hasExample: "✓", brands: "Granite Gear, Gossamer Gear, ULA" },
    { cat: "背包", sub: "冲顶包", hasExample: "✓", brands: "Black Diamond, CAMP, Petzl" },
    { cat: "背包", sub: "驮包/防水袋", hasExample: "", brands: "Sea to Summit, Exped" },
    { cat: "帐篷", sub: "单人帐", hasExample: "✓", brands: "MSR, Big Agnes, NEMO" },
    { cat: "帐篷", sub: "双人帐", hasExample: "✓", brands: "Big Agnes, MSR, NEMO" },
    { cat: "帐篷", sub: "多人帐(3+)", hasExample: "✓", brands: "Naturehike, MSR, REI" },
    { cat: "帐篷", sub: "四季帐", hasExample: "✓", brands: "Hilleberg, MSR, The North Face" },
    { cat: "帐篷", sub: "天幕", hasExample: "", brands: "Sea to Summit, MSR, DD Hammocks" },
    { cat: "睡眠系统", sub: "羽绒睡袋", hasExample: "✓", brands: "Western Mountaineering, RAB, Marmot" },
    { cat: "睡眠系统", sub: "化纤睡袋", hasExample: "✓", brands: "Marmot, Kelty, REI" },
    { cat: "睡眠系统", sub: "充气睡垫", hasExample: "✓", brands: "Therm-a-Rest, NEMO, Sea to Summit" },
    { cat: "睡眠系统", sub: "泡沫睡垫", hasExample: "✓", brands: "NEMO, Therm-a-Rest, Gossamer Gear" },
    { cat: "睡眠系统", sub: "枕头", hasExample: "", brands: "NEMO, Sea to Summit, Exped" },
    { cat: "炊具饮水", sub: "一体式炉头", hasExample: "✓", brands: "Jetboil, MSR, BRS" },
    { cat: "炊具饮水", sub: "分体式炉头", hasExample: "✓", brands: "SOTO, MSR, Kovea" },
    { cat: "炊具饮水", sub: "套锅/餐具", hasExample: "✓", brands: "Snow Peak, TOAKS, GSI" },
    { cat: "炊具饮水", sub: "钛杯/水壶", hasExample: "✓", brands: "TOAKS, Snow Peak, Vargo" },
    { cat: "炊具饮水", sub: "水袋/水瓶", hasExample: "✓", brands: "Platypus, HydraPak, CamelBak" },
    { cat: "炊具饮水", sub: "净水器", hasExample: "✓", brands: "Sawyer, Katadyn, LifeStraw" },
    { cat: "炊具饮水", sub: "气罐", hasExample: "", brands: "Jetboil, MSR, Primus" },
    { cat: "导航照明", sub: "头灯", hasExample: "✓", brands: "Petzl, Black Diamond, Fenix" },
    { cat: "导航照明", sub: "手电", hasExample: "", brands: "Fenix, Nitecore, Olight" },
    { cat: "导航照明", sub: "GPS手持机", hasExample: "✓", brands: "Garmin, Suunto" },
    { cat: "导航照明", sub: "指南针", hasExample: "", brands: "Suunto, Silva" },
    { cat: "登山杖", sub: "伸缩登山杖", hasExample: "✓", brands: "Black Diamond, Leki, Komperdell" },
    { cat: "登山杖", sub: "折叠登山杖", hasExample: "✓", brands: "Leki, Black Diamond, Gabel" },
    { cat: "安全急救", sub: "急救包", hasExample: "✓", brands: "Adventure Medical Kits, MyMedic" },
    { cat: "安全急救", sub: "求生哨", hasExample: "✓", brands: "SOL, Fox 40" },
    { cat: "安全急救", sub: "救生毯", hasExample: "✓", brands: "SOL, Suisse Sport" },
    { cat: "安全急救", sub: "防熊喷雾", hasExample: "", brands: "Counter Assault, UDAP" },
    { cat: "服装配件", sub: "徒步袜", hasExample: "✓", brands: "Darn Tough, Smartwool, Icebreaker" },
    { cat: "服装配件", sub: "遮阳帽", hasExample: "✓", brands: "Sunday Afternoons, Outdoor Research" },
    { cat: "服装配件", sub: "保暖帽", hasExample: "", brands: "Buff, Smartwool, Patagonia" },
    { cat: "服装配件", sub: "手套", hasExample: "✓", brands: "Black Diamond, Outdoor Research, Arc'teryx" },
    { cat: "服装配件", sub: "魔术头巾", hasExample: "✓", brands: "Buff" },
    { cat: "服装配件", sub: "墨镜", hasExample: "✓", brands: "Julbo, Oakley, Smith" },
    { cat: "服装配件", sub: "护膝/护踝", hasExample: "", brands: "Bauerfeind, LP, Mueller" },
    { cat: "电子设备", sub: "充电宝", hasExample: "", brands: "Anker, Nitecore, Goal Zero" },
    { cat: "电子设备", sub: "运动相机", hasExample: "", brands: "GoPro, DJI, Insta360" },
    { cat: "电子设备", sub: "对讲机", hasExample: "", brands: "Motorola, Baofeng, Midland" },
    { cat: "电子设备", sub: "卫星通讯器", hasExample: "", brands: "Garmin inReach, SPOT, Zoleo" },
  ];

  allCategories.forEach((item, i) => {
    const row = catSheet.getRow(i + 2);
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

  catSheet.views = [{ state: "frozen", ySplit: 1 }];

  // ========== 保存 ==========
  const outputPath = path.join(__dirname, "..", "装备数据收集模板.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  console.log(`模板已生成: ${outputPath}`);
  console.log(`包含 ${categories.reduce((sum, c) => sum + c.items.length, 0)} 条示例数据`);
}

generateTemplate().catch(console.error);
