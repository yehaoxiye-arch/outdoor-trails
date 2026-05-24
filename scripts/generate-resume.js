const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } = require("docx");
const fs = require("fs");

const PRIMARY = "2563EB";
const DARK = "1F2937";
const GRAY = "6B7280";
const LIGHT_BG = "F8FAFC";

function heading(text, level = HeadingLevel.HEADING_1) {
  const sizes = { 1: 36, 2: 28, 3: 24 };
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 280, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: level === HeadingLevel.HEADING_1 ? PRIMARY : DARK,
        size: sizes[level === HeadingLevel.HEADING_1 ? 1 : level === HeadingLevel.HEADING_2 ? 2 : 3],
        font: "Microsoft YaHei",
      }),
    ],
  });
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    ...options,
    children: [
      new TextRun({
        text,
        size: 21,
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
      new TextRun({ text: label, bold: true, size: 21, color: DARK, font: "Microsoft YaHei" }),
      new TextRun({ text: value, size: 21, color: DARK, font: "Microsoft YaHei" }),
    ],
  });
}

function bullet(text, indent = 360) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    indent: { left: indent },
    children: [
      new TextRun({ text: "•  ", size: 21, color: PRIMARY, font: "Microsoft YaHei" }),
      new TextRun({ text, size: 21, color: DARK, font: "Microsoft YaHei" }),
    ],
  });
}

function subBullet(text) {
  return bullet(text, 720);
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
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
    creator: "Simon",
    title: "径迹项目经历 — AI Agent 实习岗位简历素材",
    styles: {
      default: {
        document: {
          run: { font: "Microsoft YaHei", size: 21, color: DARK },
        },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
        },
        children: [
          // ===== 标题 =====
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "径迹（Jingji）", size: 40, bold: true, color: PRIMARY, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "AI 驱动的智能户外装备推荐系统", size: 28, bold: true, color: DARK, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "独立开发者 ｜ 项目经历（STAR 法则）", size: 21, color: GRAY, font: "Microsoft YaHei" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: "技术栈：Next.js 16 / React 19 / TypeScript / Tailwind CSS 4", size: 20, color: GRAY, font: "Microsoft YaHei" }),
            ],
          }),
          divider(),

          // ===== S =====
          heading("Situation（背景）"),
          para("户外徒步装备选购存在典型的信息过载问题：17 个装备品类、数百款产品，新手不知道「带什么」和「买什么」，且不同线路（高海拔/低海拔、单日/多日）和天气条件（晴天/雨天、高温/低温）对装备需求差异巨大。市场上缺乏将「线路场景 + 实时天气 + 装备推荐」三者联动的工具型产品。"),

          // ===== T =====
          heading("Task（任务）"),
          para("独立设计并开发一款智能装备推荐系统，核心目标："),
          bullet("根据线路特征 + 实时天气预报，自动生成个性化装备清单"),
          bullet("构建可扩展的规则引擎，支持多维度条件组合决策"),
          bullet("建立结构化的装备数据库和数据采集 Pipeline"),

          // ===== A =====
          heading("Action（行动）"),

          // A1
          heading("一、AI Agent 协作开发（核心能力）", HeadingLevel.HEADING_2),
          bullet("使用 Claude Code（AI 编程 Agent）作为开发搭档，通过精准的 Prompt Engineering 引导 Agent 完成需求分析、架构设计、代码实现、Bug 修复全流程"),
          bullet("设计 Agent 编排策略：将复杂任务拆解为子任务，分派多个 Agent 并行执行（如同时创建 3 个独立组件），显著提升开发效率"),
          bullet("理解 Agent 能力边界：在 Agent 输出不准确时（如推荐规则阈值不合理、天气数据解析错误），能快速定位问题并给出修正指令"),
          bullet("利用 Agent 的记忆系统（Memory）和技能系统（Skills）实现跨会话的上下文保持和可复用工作流"),

          // A2
          heading("二、多 AI 工具协作与成本优化", HeadingLevel.HEADING_2),
          para("建立「AI 工具矩阵」工作流，根据任务特性分配不同 AI 工具："),
          subBullet("Claude Code：核心开发任务（代码生成、架构设计、Bug 修复）— 需要深度推理和长上下文"),
          subBullet("Codex（免费额度）：数据采集脚本执行、批量数据处理 — 轻量级代码执行任务"),
          subBullet("豆包：中文翻译、数据清洗、文本处理 — 中文理解能力强，适合 NLP 类任务"),
          bullet("将数据密集型的采集和处理工作分流到免费/低成本工具，将高价值的推理能力留给核心开发环节"),
          bullet("实践「AI Agent 编排思维」：判断任务特征 → 选择最合适的 AI 工具 → 整合各工具输出结果"),

          // A3
          heading("三、规则引擎设计与实现（AI/决策系统）", HeadingLevel.HEADING_2),
          bullet("设计两层决策架构：第一层决定「带哪些品类」，第二层决定「推荐哪款产品」"),
          bullet("实现五级优先级体系（critical > required > recommended > optional），基于 6 个维度（海拔、温度、降水概率、风速、持续时间、难度）进行条件组合决策"),
          bullet("引入失温风险评估模型，根据温度 + 风速 + 降水概率综合判断风险等级"),
          bullet("实现天气联动机制：出行日期选择 → 自动获取该日期天气预报 → 动态调整装备推荐（如降水 >45% 雨具标记为「必备」）"),

          // A4
          heading("四、数据采集与处理 Pipeline", HeadingLevel.HEADING_2),
          bullet("从 OutdoorsMagic.com（英国权威户外媒体）抓取 3 篇年度榜单文章，提取 42 款产品数据"),
          bullet("实现 HTML 解析 → 获奖产品识别 → 产品型号提取 → 编辑评价提取的完整流程"),
          bullet("解决防盗链图片获取问题：使用 Puppeteer 浏览器自动化截图，绕过 Referer 检查机制"),
          bullet("构建翻译 Pipeline：产品型号（英文 + 中文括号）、奖项头衔、编辑评价全部中文本地化"),
          bullet("建立 382 款产品的结构化数据库（17 个品类），含规格参数、适用场景、价格"),

          // A5
          heading("五、全栈工程实现", HeadingLevel.HEADING_2),
          bullet("前端：Next.js 16 App Router + React 19 + Tailwind CSS 4，实现响应式设计"),
          bullet("后端：集成 Open-Meteo 天气 API，实现经纬度精确查询 + 省份 fallback 兜底"),
          bullet("数据：52 条江西省徒步线路（含坐标、海拔、难度等结构化数据）"),
          bullet("工具链：TypeScript 类型安全、ESLint 代码规范、Git 版本管理"),

          // ===== R =====
          heading("Result（成果）"),
          makeTable(
            ["指标", "数据"],
            [
              ["装备数据库", "382 款产品，17 个品类"],
              ["线路数据", "52 条江西省线路"],
              ["推荐引擎", "6 维度条件组合，5 级优先级"],
              ["榜单数据", "42 款国际产品，16 个获奖者"],
              ["开发效率", "AI Agent 协作下，核心功能 3 天完成"],
              ["产品形态", "可演示的 Web 应用，移动端自适应"],
            ]
          ),

          divider(),

          // ===== 匹配度 =====
          heading("与 AI Agent 岗位的匹配度"),
          makeTable(
            ["岗位要求", "项目对应"],
            [
              ["Agent 使用与编排", "使用 Claude Code 协作开发，多 Agent 并行调度"],
              ["多 AI 工具协作", "Claude Code + Codex + 豆包工具矩阵，按任务特性分配"],
              ["Prompt Engineering", "精准描述需求，引导 Agent 输出高质量代码"],
              ["决策系统设计", "两层规则引擎，多维度条件组合"],
              ["数据处理能力", "网页抓取 → 解析 → 清洗 → 翻译 Pipeline"],
              ["工程落地能力", "全栈开发，独立交付可演示产品"],
              ["成本优化意识", "通过工具分流降低高价值 Token 消耗"],
            ]
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "C:/Users/Simon/outdoor-trails/径迹项目经历_AI Agent实习简历.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("文档已生成：" + outputPath);
}

main().catch(console.error);
