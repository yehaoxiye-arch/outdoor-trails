# 装备推荐系统 Bug 修复计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复装备推荐系统中发现的 18 个 bug（7个严重、5个中等、6个低优先级）

**Architecture:** 保留现有两层决策引擎架构，修复类型定义、产品数据、规则逻辑中的问题

**Tech Stack:** TypeScript, ExcelJS, Next.js 16 App Router

---

## 发现的问题汇总

| 严重程度 | 问题数 | 关键问题 |
|---------|--------|---------|
| 严重 | 7 | WeatherForecast 类型重复、ClothingSpecs 不匹配、SafetySpecs 不匹配、重复产品ID、帐篷容量错误、空产品数组(3个)、fillReasonTemplate 缺 windSpeed |
| 中等 | 5 | waterproofRating="undefined"字符串、ID格式异常、鞋类温度范围单一、selectBestProduct 缺 case、背包选择忽略 style |
| 低 | 6 | eq 死代码、carryingTips 重复、未排序推荐、不推荐理由死代码、TypeScript 断言、processedCategories 顺序依赖 |

---

### Task 1: 修复 fillReasonTemplate 缺少 windSpeed 替换

**Files:**
- Modify: `src/lib/recommend.ts:215-227`

- [ ] **Step 1: 添加 windSpeed 替换**

在 `fillReasonTemplate` 函数中添加 windSpeed 替换：

```typescript
function fillReasonTemplate(template: string, context: RecommendationContext): string {
  const { style, forecasts } = context;

  return template
    .replace("{duration}", style.duration)
    .replace("{distance}", parseDistance(style.distance).toString())
    .replace("{altitude}", parseAltitude(style.altitude).toString())
    .replace("{difficulty}", style.difficulty)
    .replace("{tempLow}", getMinTemp(forecasts).toString())
    .replace("{tempHigh}", getMaxTemp(forecasts).toString())
    .replace("{precipitation}", getMaxPrecipitation(forecasts).toString())
    .replace("{windSpeed}", getMaxWindSpeed(forecasts).toString())
    .replace("{style}", style.name);
}
```

- [ ] **Step 2: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 提交**

```bash
git add src/lib/recommend.ts
git commit -m "fix: fillReasonTemplate 添加 windSpeed 变量替换"
```

---

### Task 2: 修复重复产品 ID

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 查找重复 ID**

Run: `node -e "const fs=require('fs'); const c=fs.readFileSync('src/data/products.ts','utf-8'); const ids=[]; const re=/id:\s*['\"]([^'\"]+)['\"]/g; let m; while(m=re.exec(c)){ids.push(m[1])} const dup=ids.filter((v,i,a)=>a.indexOf(v)!==i); console.log([...new Set(dup)])"`

- [ ] **Step 2: 修改重复 ID**

找到 `the-north-face-summit-futurelight` 出现两次的位置，将第二个（硬壳冲锋衣）改为 `the-north-face-summit-futurelight-jacket`。

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 修复重复产品 ID the-north-face-summit-futurelight"
```

---

### Task 3: 修复空产品数组（sun-protection, snow-gear, emergency）

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 检查空数组**

确认以下品类的产品数组是否为空：
- `sunprotectionProducts`
- `snowgearProducts`
- `emergencyProducts`

- [ ] **Step 2: 从 Excel 补充产品数据**

检查是否有相关的 Excel 文件可以导入这些品类的产品。如果没有，添加最少 2-3 个产品到每个空数组。

示例产品（如果需要手动添加）：

```typescript
// sun-protection
const sunprotectionProducts: Product[] = [
  {
    id: "outdoor-research-sun-runner",
    name: "Sun Runner Cap",
    brand: "Outdoor Research",
    category: "sun-protection",
    image: "",
    specs: { type: "hat", upf: 50, weight: 85, material: "尼龙" } as ProtectionSpecs,
    scenarios: ["徒步", "越野跑"],
  },
  {
    id: "buff-coolnet-uv",
    name: "CoolNet UV+ 头巾",
    brand: "Buff",
    category: "sun-protection",
    image: "",
    specs: { type: "buff", upf: 50, weight: 30, material: "聚酯纤维" } as ProtectionSpecs,
    scenarios: ["徒步", "越野跑"],
  },
];

// snow-gear
const snowgearProducts: Product[] = [
  {
    id: "grivel-g12-crampons",
    name: "G12 冰爪",
    brand: "Grivel",
    category: "snow-gear",
    image: "",
    specs: { type: "crampons", weight: 880, material: "钢", binding: "自动" } as SnowGearSpecs,
    scenarios: ["冰川", "雪山"],
  },
  {
    id: "black-diamond-camalot",
    name: "Camalot C4 攀岩塞",
    brand: "Black Diamond",
    category: "snow-gear",
    image: "",
    specs: { type: "crampons", weight: 210, material: "铝合金" } as SnowGearSpecs,
    scenarios: ["攀岩", "雪山"],
  },
];

// emergency
const emergencyProducts: Product[] = [
  {
    id: "sol-emergency-blanket",
    name: "应急保温毯",
    brand: "SOL",
    category: "emergency",
    image: "",
    specs: { type: "blanket", weight: 60 } as EmergencySpecs,
    scenarios: ["应急", "失温防护"],
  },
  {
    id: "sos-rescue-whistle",
    name: "求生哨",
    brand: "SOS",
    category: "emergency",
    image: "",
    specs: { type: "whistle", weight: 15 } as EmergencySpecs,
    scenarios: ["应急", "求救"],
  },
];
```

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 补充空品类产品数据（sun-protection, snow-gear, emergency）"
```

---

### Task 4: 修复 waterproofRating="undefined" 字符串

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 查找 waterproofRating 为 "undefined" 的产品**

Run: `grep -n 'waterproofRating: "undefined"' src/data/products.ts`

- [ ] **Step 2: 修改为 undefined 或删除字段**

将 `waterproofRating: "undefined"` 改为删除该行或改为 `waterproofRating: undefined`。

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 修复 waterproofRating 为字符串 undefined 的产品"
```

---

### Task 5: 修复帐篷容量数据错误

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 检查帐篷容量数据**

Run: `node -e "const fs=require('fs'); const c=fs.readFileSync('src/data/products.ts','utf-8'); const tents=c.match(/capacity:\s*\d+/g); console.log(tents)"`

- [ ] **Step 2: 根据产品名称修正容量**

找到容量为 1 但名称暗示多人的帐篷，修正 capacity：
- 冷山2air → capacity: 2
- 冷山3air → capacity: 3
- 世家4 → capacity: 4
- 假日山居5.9 → capacity: 6
- 其他根据名称推断

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 修正帐篷容量数据（根据产品名称）"
```

---

### Task 6: 修复 backpack 选择逻辑忽略 style

**Files:**
- Modify: `src/lib/recommend.ts:105-119`

- [ ] **Step 1: 修改背包容量选择逻辑**

将背包容量选择从仅考虑 duration 改为同时考虑 style：

```typescript
case "backpack": {
  // 按行程风格和时长选择容量
  let targetVolume: number;
  if (style.name === "重装露营") {
    targetVolume = 60;
  } else if (style.name === "越野跑") {
    targetVolume = 10;
  } else {
    // 轻装速穿
    targetVolume = duration <= 1 ? 20 : duration <= 3 ? 35 : 50;
  }
  
  const suitable = categoryProducts.filter((p) => {
    const specs = p.specs as BackpackSpecs;
    return Math.abs(specs.volume - targetVolume) < 15;
  });
  // 按容量接近度排序，再按重量排序
  suitable.sort((a, b) => {
    const da = Math.abs((a.specs as BackpackSpecs).volume - targetVolume);
    const db = Math.abs((b.specs as BackpackSpecs).volume - targetVolume);
    if (da !== db) return da - db;
    return ((a.specs as any).weight || 0) - ((b.specs as any).weight || 0);
  });
  return suitable[0] || sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 2: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 提交**

```bash
git add src/lib/recommend.ts
git commit -m "fix: 背包选择逻辑考虑 style（重装/轻装/越野跑）"
```

---

### Task 7: 修复 WeatherForecast 类型重复定义

**Files:**
- Modify: `src/types/product.ts:184-194`
- Modify: `src/lib/recommend.ts:1`

- [ ] **Step 1: 检查 GearRecommendation 中的 weatherForecast 类型**

确认 `GearRecommendation` 接口中 `weatherForecast` 字段使用的类型。

- [ ] **Step 2: 删除 product.ts 中的 WeatherForecast 定义**

如果 `WeatherForecast` 在 `product.ts` 中定义且与 `weather.ts` 中的 `DayForecast` 重复，删除 `product.ts` 中的定义。

- [ ] **Step 3: 更新 GearRecommendation 的 weatherForecast 类型**

将 `weatherForecast: WeatherForecast[]` 改为 `weatherForecast: DayForecast[]`。

- [ ] **Step 4: 更新 recommend.ts 的导入**

确保从 `weather.ts` 导入 `DayForecast`，而非从 `product.ts` 导入 `WeatherForecast`。

- [ ] **Step 5: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 6: 提交**

```bash
git add src/types/product.ts src/lib/recommend.ts
git commit -m "fix: 删除重复的 WeatherForecast 类型定义，统一使用 DayForecast"
```

---

### Task 8: 为缺失的品类添加 selectBestProduct case

**Files:**
- Modify: `src/lib/recommend.ts:70-186`

- [ ] **Step 1: 添加 rain-gear case**

```typescript
case "rain-gear": {
  // 优先轻量防水
  return sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 2: 添加 sun-protection case**

```typescript
case "sun-protection": {
  // 优先高 UPF
  const highUpf = categoryProducts.filter((p) => (p.specs as ProtectionSpecs).upf >= 50);
  return highUpf[0] || sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 3: 添加 navigation case**

```typescript
case "navigation": {
  // 按重量排序
  return sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 4: 添加 safety case**

```typescript
case "safety": {
  // 优先急救包类型
  const firstAid = categoryProducts.filter((p) => (p.specs as SafetySpecs).type === "first-aid");
  return firstAid[0] || sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 5: 添加 snow-gear case**

```typescript
case "snow-gear": {
  // 按重量排序
  return sortByWeight(categoryProducts)[0];
}
```

- [ ] **Step 6: 添加缺失的 import**

在文件顶部添加缺失的 Specs 类型导入：

```typescript
import { 
  Product, Recommendation, ReasonTag, GearRecommendation, ProductCategory,
  FootwearSpecs, ClothingSpecs, BackpackSpecs, SleepingSpecs, TentSpecs,
  TrekkingPoleSpecs, CookingSpecs, LightingSpecs, HydrationSpecs,
  ProtectionSpecs, SafetySpecs, SnowGearSpecs, NavigationSpecs 
} from "@/types/product";
```

- [ ] **Step 7: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 8: 提交**

```bash
git add src/lib/recommend.ts
git commit -m "fix: 为 rain-gear/sun-protection/navigation/safety/snow-gear 添加 selectBestProduct case"
```

---

### Task 9: 修复鞋类温度范围千篇一律

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 分析当前鞋类温度范围**

确认所有 51 款鞋的 temperatureRange 是否都是 `{ min: -10, max: 30 }`。

- [ ] **Step 2: 根据产品特性设定差异化温度范围**

按以下规则修改：
- 越野跑鞋：`{ min: 5, max: 35 }`（轻薄透气）
- 低帮徒步鞋：`{ min: 0, max: 30 }`（通用）
- 中帮徒步鞋：`{ min: -5, max: 25 }`（稍保暖）
- 高帮徒步鞋：`{ min: -10, max: 20 }`（保暖）
- 防水鞋：`{ min: -5, max: 25 }`
- 非防水鞋：`{ min: 5, max: 35 }`

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 鞋类温度范围差异化（根据帮高和防水性）"
```

---

### Task 10: 修复产品 ID 格式异常（缺少品牌前缀）

**Files:**
- Modify: `src/data/products.ts`

- [ ] **Step 1: 查找以 `-` 开头的 ID**

Run: `grep -n "id: '-" src/data/products.ts | head -20`

- [ ] **Step 2: 为 ID 添加品牌前缀**

根据产品的 brand 字段，为每个以 `-` 开头的 ID 添加品牌前缀：
- 凯乐石产品：`-xxx` → `kailas-xxx`
- 探路者产品：`-xxx` → `toread-xxx`
- 奥索卡产品：`-xxx` → `ozark-xxx`
- 骆驼产品：`-xxx` → `camel-xxx`
- 伯希和产品：`-xxx` → `pelliot-xxx`
- 始祖鸟产品：`-xxx` → `arcteryx-xxx`
- 迪卡侬产品：`-xxx` → `decathlon-xxx`

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 4: 提交**

```bash
git add src/data/products.ts
git commit -m "fix: 产品 ID 添加品牌前缀（去除异常的 - 开头）"
```

---

### Task 11: 添加推荐结果按优先级排序

**Files:**
- Modify: `src/lib/recommend.ts`

- [ ] **Step 1: 添加优先级排序函数**

在 `generateRecommendations` 函数中，返回前对 recommendations 排序：

```typescript
// 按优先级排序
const priorityOrder: Record<string, number> = {
  critical: 0,
  required: 1,
  recommended: 2,
  optional: 3,
};

recommendations.sort((a, b) => {
  const pa = priorityOrder[a.priority] ?? 99;
  const pb = priorityOrder[b.priority] ?? 99;
  return pa - pb;
});
```

- [ ] **Step 2: 验证编译**

Run: `npx tsc --noEmit`

- [ ] **Step 3: 提交**

```bash
git add src/lib/recommend.ts
git commit -m "fix: 推荐结果按优先级排序（critical > required > recommended > optional）"
```

---

## 执行顺序建议

按依赖关系和风险排序：

1. **Task 1** (fillReasonTemplate) — 简单修复，无依赖
2. **Task 2** (重复ID) — 数据修复，无依赖
3. **Task 3** (空产品数组) — 数据补充，无依赖
4. **Task 4** (waterproofRating) — 数据修复，无依赖
5. **Task 5** (帐篷容量) — 数据修复，无依赖
6. **Task 6** (背包选择) — 逻辑修复，无依赖
7. **Task 7** (WeatherForecast 类型) — 类型修复，可能影响其他文件
8. **Task 8** (selectBestProduct case) — 逻辑扩展，依赖 Task 3
9. **Task 9** (鞋类温度) — 数据修复，无依赖
10. **Task 10** (ID格式) — 数据修复，无依赖
11. **Task 11** (优先级排序) — 逻辑优化，无依赖
