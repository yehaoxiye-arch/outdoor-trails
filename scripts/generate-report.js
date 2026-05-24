const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, PageBreak } = require("docx");
const fs = require("fs");

// 颜色定义
const PRIMARY = "2563EB";
const DARK = "1F2937";
const GRAY = "6B7280";
const LIGHT_BG = "F8FAFC";

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 400, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: level === HeadingLevel.HEADING_1 ? PRIMARY : DARK,
        size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24,
        font: "Microsoft YaHei",
      }),
    ],
  });
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    ...options,
    children: [
      new TextRun({
        text,
        size: 22,
        color: options.color || DARK,
        font: "Microsoft YaHei",
        ...options.run,
      }),
    ],
  });
}

function boldPara(label, value) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, color: DARK, font: "Microsoft YaHei" }),
      new TextRun({ text: value, size: 22, color: DARK, font: "Microsoft YaHei" }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "•  ", size: 22, color: PRIMARY, font: "Microsoft YaHei" }),
      new TextRun({ text, size: 22, color: DARK, font: "Microsoft YaHei" }),
    ],
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E5E7EB" } },
    children: [],
  });
}

function makeTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              shading: { type: ShadingType.SOLID, color: PRIMARY },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Microsoft YaHei" })],
                }),
              ],
            })
        ),
      }),
      ...rows.map(
        (row, i) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  shading: i % 2 === 0 ? { type: ShadingType.SOLID, color: LIGHT_BG } : undefined,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, size: 20, color: DARK, font: "Microsoft YaHei" })],
                    }),
                  ],
                })
            ),
          })
      ),
    ],
  });
}

async function main() {
  const doc = new Document({
    creator: "径迹产品团队",
    title: "径迹（Jingji）产品分析报告",
    description: "户外徒步装备推荐网站产品拆解报告",
    styles: {
      default: {
        document: {
          run: { font: "Microsoft YaHei", size: 22, color: DARK },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          // ===== 封面 =====
          new Paragraph({ spacing: { before: 3000 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "径迹", size: 72, bold: true, color: PRIMARY, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: "JINGJI", size: 28, color: GRAY, font: "Microsoft YaHei", characterSpacing: 200 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
            children: [
              new TextRun({ text: "产品分析报告", size: 40, bold: true, color: DARK, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({ text: "智能装备推荐 · 让每一次出发都从容", size: 24, color: GRAY, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1200 },
            children: [
              new TextRun({ text: "2026年5月", size: 22, color: GRAY, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 },
            children: [
              new TextRun({ text: "版本：V1.0  |  文档密级：内部", size: 20, color: GRAY, font: "Microsoft YaHei" }),
            ],
          }),

          // ===== 分页：目录 =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("目录"),
          para("一、项目概述与市场定位"),
          para("二、目标用户画像"),
          para("三、核心功能拆解"),
          para("四、产品架构与数据模型"),
          para("五、推荐引擎设计"),
          para("六、用户体验设计"),
          para("七、竞品分析"),
          para("八、商业模式与变现路径"),
          para("九、风险与挑战"),
          para("十、迭代规划（Roadmap）"),
          para("十一、总结"),

          // ===== 一、项目概述 =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("一、项目概述与市场定位"),

          heading("1.1 产品定义", HeadingLevel.HEADING_2),
          para("径迹（Jingji）是一款面向中国户外徒步爱好者的智能装备推荐网站。其核心价值主张是：根据用户选择的徒步线路特征（海拔、距离、难度、持续时间）结合实时天气预报，自动生成个性化的装备清单，并推荐具体产品。"),

          heading("1.2 解决的核心痛点", HeadingLevel.HEADING_2),
          bullet("信息不对称：新手不知道该带什么装备，容易遗漏关键物品或过度携带"),
          bullet("决策成本高：17个装备品类、数百款产品，逐一研究耗时费力"),
          bullet("场景适配难：不同线路（高海拔/低海拔、单日/多日、晴天/雨天）需要不同装备组合"),
          bullet("天气变化风险：出行前天气变化需要动态调整装备，人工判断容易出错"),

          heading("1.3 市场定位", HeadingLevel.HEADING_2),
          makeTable(
            ["维度", "定位"],
            [
              ["目标市场", "中国户外徒步装备市场（预估规模 500亿+/年）"],
              ["产品形态", "Web端优先，移动端自适应"],
              ["核心差异化", "线路+天气双驱动的智能推荐引擎"],
              ["竞争策略", "工具型产品切入，建立装备决策信任后拓展电商"],
              ["阶段定位", "MVP验证期（已完成核心功能开发）"],
            ]
          ),

          // ===== 二、用户画像 =====
          divider(),
          heading("二、目标用户画像"),

          heading("2.1 核心用户群", HeadingLevel.HEADING_2),
          makeTable(
            ["用户类型", "特征", "核心需求", "占比预估"],
            [
              ["入门新手", "18-30岁，徒步经验<1年", "不知道买什么、带什么，需要完整清单", "50%"],
              ["进阶玩家", "25-40岁，1-3年经验", "针对特定线路优化装备，追求轻量化", "35%"],
              ["资深驴友", "30-50岁，3年+经验", "快速查阅天气联动建议，验证已有装备", "15%"],
            ]
          ),

          heading("2.2 用户旅程", HeadingLevel.HEADING_2),
          bullet("发现线路 → 查看线路详情 → 获取天气预报 → 查看装备推荐 → 生成装备清单 → 出行"),
          bullet("关键转化节点：线路详情页 → 装备推荐的查看率"),
          bullet("核心留存指标：装备推荐的采纳率和准确度"),

          // ===== 三、核心功能拆解 =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("三、核心功能拆解"),

          heading("3.1 功能全景图", HeadingLevel.HEADING_2),
          makeTable(
            ["功能模块", "子功能", "完成度", "优先级"],
            [
              ["首页", "Hero轮播、搜索、榜单卡片", "100%", "P0"],
              ["线路浏览", "线路列表、筛选、搜索", "100%", "P0"],
              ["线路详情", "Hero、统计条、双栏布局", "100%", "P0"],
              ["天气系统", "实时天气API、5日预报、fallback", "100%", "P0"],
              ["装备推荐引擎", "规则引擎、产品匹配、优先级排序", "100%", "P0"],
              ["装备清单", "品类展示、产品卡片、推荐理由", "100%", "P0"],
              ["榜单功能", "OutdoorsMagic数据、产品弹窗", "100%", "P1"],
              ["用户系统", "注册、登录、收藏", "0%", "P2"],
              ["社区功能", "路线分享、装备评价", "0%", "P3"],
            ]
          ),

          heading("3.2 核心功能详解", HeadingLevel.HEADING_2),

          boldPara("装备推荐引擎（核心竞争力）：", ""),
          bullet("输入：线路特征（海拔、距离、难度、持续时间）+ 实时天气（温度、降水概率、风速）"),
          bullet("处理：两层决策引擎 — 第一层决定「带什么品类」，第二层决定「推荐哪款产品」"),
          bullet("输出：按优先级排序的装备清单（critical > required > recommended > optional）"),
          bullet("特色：失温风险评估、品牌多样性控制、天气联动动态调整"),

          boldPara("天气集成：", ""),
          bullet("数据源：Open-Meteo API（免费、无需Key）"),
          bullet("能力：经纬度精确查询、5日逐日预报、省份fallback兜底"),
          bullet("联动：天气数据直接影响装备推荐（降水>45%必备雨具、温度<15°C触发保暖层）"),

          boldPara("榜单功能：", ""),
          bullet("数据源：OutdoorsMagic.com（英国权威户外媒体）"),
          bullet("品类：背包(11款)、登山靴(14款)、防水夹克(17款)"),
          bullet("展示：获奖产品显示奖项头衔，非获奖产品显示编辑评价"),
          bullet("翻译：全部内容中文本地化（型号、奖项、评价）"),

          // ===== 四、产品架构 =====
          divider(),
          heading("四、产品架构与数据模型"),

          heading("4.1 技术架构", HeadingLevel.HEADING_2),
          makeTable(
            ["层级", "技术选型", "说明"],
            [
              ["前端框架", "Next.js 16 App Router", "React 19 + Turbopack，SSR/SSG混合渲染"],
              ["UI框架", "Tailwind CSS 4", "原子化CSS，快速迭代"],
              ["语言", "TypeScript", "类型安全，减少运行时错误"],
              ["天气API", "Open-Meteo", "免费、无需Key、全球覆盖"],
              ["数据存储", "静态JSON/TS文件", "MVP阶段无需数据库"],
              ["图片方案", "远程CDN + 本地截图", "防盗链图片使用Puppeteer截图"],
            ]
          ),

          heading("4.2 数据模型", HeadingLevel.HEADING_2),
          boldPara("线路数据（routes.ts）：", "52条江西省线路，每条包含：名称、位置、山脉、图片、坐标、路线风格（距离/海拔/难度/耗时/描述）"),
          boldPara("产品数据（products.ts）：", "382条产品，17个品类，每条包含：品牌、名称、图片、规格参数、适用场景、价格"),
          boldPara("推荐规则（gear-rules.ts）：", "条件-动作规则集，基于海拔/温度/降水/持续时间/难度等维度触发"),
          boldPara("榜单数据（outdoormagic-rankings.json）：", "42款产品，来自OutdoorsMagic的3篇年度榜单文章"),

          heading("4.3 品类覆盖", HeadingLevel.HEADING_2),
          makeTable(
            ["品类", "产品数", "说明"],
            [
              ["鞋类(footwear)", "62", "徒步鞋、越野跑鞋、登山靴、凉鞋"],
              ["基础层(base-layer)", "35", "速干衣、保暖内衣、裤类"],
              ["保暖层(mid-layer)", "28", "抓绒、软壳、羽绒服"],
              ["防护层(outer-layer)", "25", "冲锋衣、硬壳"],
              ["雨具(rain-gear)", "18", "雨衣、雨裤、防水配件"],
              ["背包(backpack)", "22", "日用包、重装包、水袋包"],
              ["帐篷(tent)", "15", "单人帐、双人帐、帐篷配件"],
              ["睡眠(sleeping)", "18", "睡袋、睡垫、枕头"],
              ["其他(9个品类)", "159", "登山杖/炊具/导航/安全/雪地/照明/应急/水系统/防晒"],
            ]
          ),

          // ===== 五、推荐引擎 =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("五、推荐引擎设计"),

          heading("5.1 决策模型", HeadingLevel.HEADING_2),
          para("推荐引擎采用两层决策架构："),
          boldPara("第一层 — 品类决策：", "根据线路特征和天气条件，决定推荐哪些装备品类"),
          bullet("海拔 > 1500m → 触发保暖层、防护层"),
          bullet("持续时间 > 1天 → 触发帐篷、睡袋、炊具等露营装备"),
          bullet("降水概率 > 45% → 雨具标记为「必备」"),
          bullet("降水概率 5%-45% → 雨具标记为「推荐」"),

          boldPara("第二层 — 产品匹配：", "从品类数据库中选择最合适的具体产品"),
          bullet("按重量排序（轻量化优先）"),
          bullet("天气良好时优先推荐非防水鞋"),
          bullet("品牌多样性控制（避免同品牌过度集中）"),
          bullet("防水性能与天气条件匹配"),

          heading("5.2 优先级体系", HeadingLevel.HEADING_2),
          makeTable(
            ["优先级", "含义", "示例"],
            [
              ["critical", "生命安全相关，必须携带", "急救包、哨子、头灯"],
              ["required", "线路条件强制要求", "高海拔的保暖层、雨天的雨具"],
              ["recommended", "强烈建议携带", "登山杖、防晒霜"],
              ["optional", "锦上添花", "相机、折叠椅"],
            ]
          ),

          heading("5.3 规则参数", HeadingLevel.HEADING_2),
          makeTable(
            ["参数", "阈值", "触发动作"],
            [
              ["海拔", "> 1500m", "保暖层/防护层 priority 升级"],
              ["持续时间", "> 1天", "触发露营装备品类"],
              ["降水概率", "> 45%", "雨具 → required"],
              ["降水概率", "5% - 45%", "雨具 → recommended"],
              ["温度", "< 15°C", "保暖层 → required"],
              ["风速", "> 30km/h", "防护层 → required"],
            ]
          ),

          // ===== 六、用户体验 =====
          divider(),
          heading("六、用户体验设计"),

          heading("6.1 设计原则", HeadingLevel.HEADING_2),
          bullet("AllTrails 风格：借鉴国际成熟户外产品的视觉语言"),
          bullet("信息层级清晰：Hero → 概览 → 详情的渐进式信息披露"),
          bullet("移动优先：响应式设计，核心功能在手机端完整可用"),
          bullet("数据可视化：天气卡片、装备清单、统计条等组件化展示"),

          heading("6.2 核心页面", HeadingLevel.HEADING_2),
          makeTable(
            ["页面", "核心组件", "用户行为"],
            [
              ["首页", "Hero轮播、搜索栏、榜单卡片", "搜索线路、浏览榜单"],
              ["线路详情", "Hero图、统计条、天气卡片、装备推荐", "了解线路、查看天气、获取装备建议"],
              ["装备清单", "品类分组、产品卡片、优先级标签", "查看推荐、了解理由"],
            ]
          ),

          heading("6.3 交互设计亮点", HeadingLevel.HEADING_2),
          bullet("出行日期选择 → 自动获取该日期的天气预报 → 动态调整装备推荐"),
          bullet("装备推荐附带「推荐理由」，解释为什么推荐这款产品"),
          bullet("天气卡片展示5日预报，支持实时数据和fallback切换"),
          bullet("榜单产品弹窗区分获奖产品和普通产品，信息层次分明"),

          // ===== 七、竞品分析 =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("七、竞品分析"),

          heading("7.1 竞品格局", HeadingLevel.HEADING_2),
          makeTable(
            ["竞品", "类型", "优势", "劣势", "径迹差异化"],
            [
              ["AllTrails", "线路平台", "线路数据丰富、社区活跃", "无装备推荐、英文为主", "装备推荐引擎"],
              ["两步路", "户外工具", "轨迹记录、国内用户多", "无装备推荐、商业化重", "天气联动推荐"],
              ["小红书/知乎", "内容平台", "UGC内容丰富", "信息碎片化、无结构化推荐", "系统化决策引擎"],
              ["迪卡侬官网", "电商平台", "产品齐全、价格透明", "无场景化推荐", "线路+天气驱动"],
              ["OutdoorsMagic", "媒体", "专业评测、权威榜单", "英文、无本地化", "中文本地化+智能匹配"],
            ]
          ),

          heading("7.2 竞争壁垒", HeadingLevel.HEADING_2),
          bullet("规则引擎壁垒：17品类×多维度条件的规则组合，竞品难以快速复制"),
          bullet("数据壁垒：382条结构化产品数据 + 52条线路数据，需要持续积累"),
          bullet("天气联动：实时天气驱动装备推荐，是独特的差异化能力"),
          bullet("中文本地化：海外专业内容的中文翻译和适配"),

          // ===== 八、商业模式 =====
          divider(),
          heading("八、商业模式与变现路径"),

          heading("8.1 变现路径规划", HeadingLevel.HEADING_2),
          makeTable(
            ["阶段", "变现方式", "说明", "预估时间"],
            [
              ["Phase 1", "流量变现", "接入淘宝/京东客CPS联盟", "即刻"],
              ["Phase 2", "品牌合作", "装备品牌赞助推荐位", "6个月后"],
              ["Phase 3", "电商闭环", "自有商城或小程序内购买", "12个月后"],
              ["Phase 4", "会员服务", "高级推荐、个性化定制", "18个月后"],
            ]
          ),

          heading("8.2 核心指标", HeadingLevel.HEADING_2),
          bullet("DAU/MAU：日活/月活用户数"),
          bullet("推荐采纳率：用户查看装备推荐后实际购买的比例"),
          bullet("CPS转化率：通过推荐链接产生的购买转化"),
          bullet("用户留存率：7日/30日留存"),
          bullet("NPS：用户净推荐值"),

          // ===== 九、风险 =====
          divider(),
          heading("九、风险与挑战"),

          makeTable(
            ["风险类型", "具体风险", "影响", "应对策略"],
            [
              ["数据风险", "产品数据过时或不准确", "推荐可信度下降", "建立数据更新机制，接入品牌API"],
              ["技术风险", "天气API不稳定或收费", "核心功能受损", "多源fallback，缓存机制"],
              ["竞争风险", "大厂入局做类似功能", "用户流失", "深耕规则引擎壁垒，快速迭代"],
              ["法律风险", "图片版权、数据抓取合规", "法律纠纷", "使用授权图片，遵守robots.txt"],
              ["商业风险", "变现模型不成立", "无法持续运营", "先验证流量再探索变现"],
            ]
          ),

          // ===== 十、Roadmap =====
          new Paragraph({ children: [new PageBreak()] }),
          heading("十、迭代规划（Roadmap）"),

          heading("10.1 短期（1-3个月）", HeadingLevel.HEADING_2),
          bullet("扩充线路数据：从江西省扩展到全国热门线路（武功山、四姑娘山、虎跳峡等）"),
          bullet("扩充产品数据：增加更多品牌和品类覆盖，目标500+产品"),
          bullet("用户反馈收集：上线反馈入口，收集推荐准确度数据"),
          bullet("SEO优化：线路详情页和装备推荐页的搜索引擎优化"),

          heading("10.2 中期（3-6个月）", HeadingLevel.HEADING_2),
          bullet("用户系统：注册/登录、收藏线路、保存装备清单"),
          bullet("CPS变现：接入淘宝客/京东客，装备推荐附带购买链接"),
          bullet("品牌合作：与2-3个户外品牌建立推荐合作关系"),
          bullet("移动端优化：PWA支持，离线缓存装备清单"),

          heading("10.3 长期（6-12个月）", HeadingLevel.HEADING_2),
          bullet("社区功能：用户路线分享、装备评价、问答"),
          bullet("AI推荐升级：基于用户历史行为的个性化推荐"),
          bullet("电商闭环：小程序商城或H5商城"),
          bullet("国际化：英文版本，拓展海外市场"),

          // ===== 十一、总结 =====
          divider(),
          heading("十一、总结"),

          para("径迹是一个以「线路+天气」双驱动的智能装备推荐产品，在户外徒步这个垂直领域找到了独特的切入点。其核心竞争力在于："),
          new Paragraph({ spacing: { before: 60 }, children: [] }),
          boldPara("1. 场景化推荐引擎：", "不是简单的「最好的装备」推荐，而是「最适合这条线路、这个天气的装备」推荐。"),
          boldPara("2. 天气联动能力：", "实时天气数据直接影响装备决策，这是竞品不具备的能力。"),
          boldPara("3. 专业数据积累：", "382条结构化产品数据、52条线路数据、42款国际榜单产品，构成了竞争壁垒。"),
          new Paragraph({ spacing: { before: 200 }, children: [] }),
          para("当前产品已完成MVP阶段的核心功能开发，具备了验证市场假设的基础条件。下一步的关键是：扩充数据覆盖、收集用户反馈、验证变现模型。", { run: { bold: true } }),
          new Paragraph({ spacing: { before: 400 }, children: [] }),
          para("— 报告完 —", { alignment: AlignmentType.CENTER, color: GRAY }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "C:/Users/Simon/outdoor-trails/径迹产品分析报告.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("报告已生成：" + outputPath);
}

main().catch(console.error);
