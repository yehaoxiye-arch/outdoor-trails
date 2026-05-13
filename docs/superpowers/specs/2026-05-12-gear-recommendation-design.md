# 装备智能推荐系统设计文档

## 概述

为径迹网站构建一个基于线路条件和天气预报的智能装备推荐系统。核心逻辑是两层决策：先根据线路固有属性生成基础装备清单，再根据用户选择的出发日期的天气预报（覆盖全程每天）进行动态调整。

**目标用户：** 有一定户外经验但不确定特定线路该带什么装备的徒步者。

**核心价值：** 不是简单的「难度→装备清单」映射，而是结合线路条件、产品性能参数、天气预报的多维度智能推荐，并解释每个推荐决策的理由。

## 架构

### 两层决策引擎

```
用户输入：选择线路 + 出发日期
         ↓
第一层：线路基础规则（固定）
  - 根据海拔、距离、天数、地形等线路属性
  - 生成基础装备清单（推荐 + 不推荐）
         ↓
第二层：天气动态调整
  - 模拟用户出发日期起、覆盖全程每天的天气预报
  - 根据天气条件对基础清单做增减
         ↓
输出：最终推荐清单
  - 推荐项：具体产品（图、参数、理由）
  - 不推荐项：仅品类 + 一句话理由
```

### 技术栈

- Next.js 16 App Router（已有）
- TypeScript（已有）
- Tailwind CSS 4（已有）
- 产品数据：本地 TypeScript 文件，人工策划
- 天气数据：本地模拟数据，按线路位置 + 日期生成

## 数据模型

### 产品（Product）

```typescript
interface Product {
  id: string;
  name: string;           // "凯乐石 MT5 重装徒步鞋"
  brand: string;          // "凯乐石"
  category: ProductCategory;
  image: string;          // 产品图片 URL
  specs: ProductSpecs;    // 性能参数（按品类不同）
  scenarios: string[];    // 适用场景标签
  price?: number;         // 参考价格（可选）
}

type ProductCategory = "footwear" | "base-layer" | "mid-layer" | "outer-layer" | "rain-gear" | "sun-protection";

// 鞋类性能参数
interface FootwearSpecs {
  waterproof: boolean;      // 是否防水
  waterproofRating?: string; // "GORE-TEX" / "防水涂层"
  weight: number;           // 单只重量(g)
  ankleSupport: "low" | "mid" | "high";
  soleType: string;         // "Vibram Megagrip"
  terrain: string[];        // 适用地形标签
  temperatureRange: { min: number; max: number };
}

// 服装性能参数
interface ClothingSpecs {
  material: string;         // "美利奴羊毛" / "抓绒"
  warmthLevel: 1 | 2 | 3 | 4 | 5;  // 保暖等级
  breathability: "low" | "medium" | "high";
  weight: number;           // 重量(g)
  windproof: boolean;
  waterproof: boolean;
  temperatureRange: { min: number; max: number };
}

// 防护装备性能参数
interface ProtectionSpecs {
  type: "rain-jacket" | "rain-pants" | "sun-hat" | "sunscreen" | "gaiters";
  waterproof?: boolean;
  waterproofRating?: string;
  uvProtection?: boolean;
  weight: number;
}
```

### 线路规则（TrailRule）

每条线路根据其属性自动映射出基础推荐规则：

```typescript
interface TrailRule {
  routeId: string;
  baseRecommendations: Recommendation[];
}

interface Recommendation {
  category: ProductCategory;
  recommended: boolean;       // true=推荐, false=不推荐
  product?: Product;          // 推荐时填具体产品
  reason: string;             // 推荐理由
  priority: "required" | "recommended" | "optional";  // 必备/推荐/可选
}
```

### 天气模拟（WeatherForecast）

```typescript
interface DayForecast {
  date: string;              // "2026-05-15"
  tempHigh: number;          // 最高温°C
  tempLow: number;           // 最低温°C
  precipitation: number;     // 降水概率 0-100
  precipitationType: "none" | "rain" | "snow" | "sleet";
  windSpeed: number;         // 风速 km/h
  windLevel: string;         // "微风" / "大风" / "狂风"
  condition: string;         // "晴" / "多云" / "小雨" / "大雪"
  icon: string;              // 天气图标
}
```

## 推荐逻辑

### 第一层：线路基础规则

根据线路属性生成固定规则。规则由以下条件驱动：

| 线路属性 | 条件 | 推荐动作 |
|---------|------|---------|
| 天数 | ≥ 2天 | 推荐重装徒步鞋（高帮/防水） |
| 天数 | 1天 + 距离 < 25km | 推荐轻量徒步鞋/越野跑鞋 |
| 海拔 | > 3500m | 推荐高海拔保暖装备（羽绒服/抓绒） |
| 海拔 | > 4500m | 推荐防风防护层 |
| 地形 | 含碎石/技术路段 | 推荐高帮鞋、登山杖 |
| 难度 | 困难 | 推荐护踝、登山杖 |

### 第二层：天气动态调整

查询出发日期起覆盖全程的天气预报，对基础清单做调整：

| 天气条件 | 条件 | 调整动作 |
|---------|------|---------|
| 降水 | 任意一天降水概率 > 60% | 加入雨衣（如三峰出） |
| 降雪 | 任意一天有雪 | 加入冰爪、雪套 |
| 低温 | 最低温 < 0°C | 升级保暖层（加厚羽绒） |
| 低温 | 最低温 < -10°C | 加入专业防寒装备 |
| 高温 | 最高温 > 30°C | 加入防晒装备、增加饮水建议 |
| 大风 | 风速 > 40km/h | 加入防风层 |

**关键规则：检查全程每一天**，只要有一天触发条件就加入相应装备。

## 用户界面

### 入口

线路详情页新增「智能装备规划」模块，位于线路描述和侧边栏之间。

### 交互流程

1. 用户浏览线路详情页
2. 看到「装备规划」模块，默认显示基于线路属性的基础推荐
3. 选择出发日期后，系统加载天气预报并生成动态调整后的最终清单
4. 清单分两个区域展示：

### 推荐装备区域

按品类分组展示：
- **鞋类** → **服装**（基础层 → 保暖层 → 防护层）→ **雨具/防晒**

每件推荐装备显示：
- 产品图片
- 品牌型号
- 核心性能参数（防水/保暖/重量等）
- 推荐理由（结合线路条件和天气）
- 优先级标签：必备 / 推荐 / 可选

### 不推荐装备区域

简洁列表，每项仅显示：
- 品类名称（如「重装防水徒步鞋」）
- 一句话理由（如「单日轻装路线，无需全防水重装鞋」）

### 天气概况卡片

显示行程期间每天的天气概况：
- 日期
- 天气图标 + 状况
- 温度范围
- 降水概率
- 如果某天有特殊天气（雪、暴雨），高亮提示

## MVP 范围

### 包含

- 鞋类：3-5 款产品（轻量徒步鞋、越野跑鞋、重装徒步鞋）
- 服装分层：每层 2-3 款产品
- 防护装备：雨衣 2-3 款、防晒 1-2 款
- 覆盖现有 11 条线路的装备规则
- 模拟天气数据
- 线路详情页集成

### 不包含（后续迭代）

- 真实天气 API 接入
- 用户个性化（已有装备、体能水平）
- 用户评价/社区数据
- 装备购买链接
- 更多产品品类（背包、睡眠系统、炊具等）

## 文件结构

```
src/
├── data/
│   ├── routes.ts          # 已有
│   ├── equipment.ts       # 重构为产品数据库
│   ├── weather.ts         # 重构为天气模拟
│   └── gear-rules.ts      # 新增：装备推荐规则引擎
├── components/
│   ├── GearPlanner.tsx    # 新增：装备规划主模块
│   ├── ProductCard.tsx    # 新增：推荐产品卡片
│   ├── NotRecommended.tsx # 新增：不推荐品类条目
│   └── WeatherForecast.tsx # 新增：行程天气概况
├── lib/
│   └── recommend.ts       # 新增：推荐引擎核心逻辑
└── app/
    └── route/[routeId]/
        └── page.tsx        # 修改：集成装备规划模块
```
