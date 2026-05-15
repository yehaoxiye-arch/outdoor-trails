# 装备推荐规则系统 V3 — 设计文档

> 以资深户外玩家视角，综合 V1（规则细化）与 V2（风险决策）两份草案，产出可落地的最终方案。

---

## 一、设计哲学

### 核心理念：从"条件匹配"到"风险决策"

装备推荐的本质不是"线路参数 → 装备清单"的查表，而是回答一个核心问题：

> **这条线路，在这个天气窗口，以这种方式走，最可能出什么状况？需要什么装备来兜底？**

三条设计原则：

1. **风险驱动** — 装备决策基于"出事概率 × 出事后果"，而非简单条件判断
2. **系统联动** — 装备之间相互影响（羽绒受潮失效 → 化纤优先；轻量化策略 → 减少冗余但提高天气窗口要求）
3. **安全兜底** — critical 级装备永远不可被"不推荐"覆盖（越野跑不推荐帐篷，但暴风雪仍需应急保温毯）

### 与现有实现的关系

当前系统已有的能力：14个品类、361条产品、28条规则、两层决策引擎（线路规则 + 天气调整）。

本次升级保留现有架构，重点补齐：
- 缺失的字段（ascent、terrain、remoteLevel）
- 缺失的品类规则（base-layer、cooking、sun-protection、rain-gear）
- 缺失的品类（lighting、emergency、hydration）
- 优先级体系（新增 critical 级）
- 装备联动逻辑

---

## 二、字段体系

### 2.1 当前可用字段

| 字段 | 来源 | 说明 |
|------|------|------|
| distance | RouteStyleData | 距离(km)，string类型需解析 |
| duration | RouteStyleData | 时长("1天"/"2天")，string类型需解析 |
| altitude | RouteStyleData | 海拔(m)，string类型需解析 |
| difficulty | RouteStyleData | 难度(简单/中等/困难/极难) |
| style | RouteStyleData | 风格(轻装速穿/重装露营/越野跑) |
| tempLow/tempHigh | DayForecast | 温度范围(°C) |
| precipitation | DayForecast | 降水概率(0-100%) |
| precipitationType | DayForecast | 降水类型(rain/snow/sleet) |
| windSpeed | DayForecast | 风速(km/h) |
| mountainRange | Route | 山脉名称（非地形，仅作参考） |

### 2.2 需新增的字段

**优先级 P0（立即需要）：**

```typescript
// Route 新增
terrain: TerrainType[]       // 地形类型数组
ascent: number               // 累计爬升(m)
descent: number              // 累计下降(m)

type TerrainType =
  | "forest"         // 林道
  | "rocky"          // 岩石路段
  | "scree"          // 碎石坡
  | "snow_field"     // 雪地/冰面
  | "mud"            // 泥地
  | "water_crossing" // 涉水
  | "ridge"          // 山脊
  | "steps"          // 石阶
  | "trail"          // 成熟步道
```

**优先级 P1（近期需要）：**

```typescript
// Route 新增
remoteLevel: RemoteLevel     // 偏远程度

type RemoteLevel =
  | "urban"          // 城市周边，手机信号好，救援 < 1小时
  | "scenic"         // 成熟景区，有标识，有游客
  | "backcountry"    // 野外无人区，可能无信号
  | "expedition"     // 探险级，多日无补给无信号
```

**优先级 P2（后续迭代）：**

```typescript
// Route 新增
waterAvailability: "frequent" | "limited" | "none"
resupplyAvailability: "easy" | "limited" | "none"
```

### 2.3 当前 terrain 字段的问题

当前实现中 `terrain` 条件映射到 `route.mountainRange`，这是错误的。"武功山"是山名，不是地形。需要在 Route 类型中新增真正的 `terrain` 字段，并在 `recommend.ts` 中将条件评估从 `mountainRange` 改为 `terrain`。

---

## 三、优先级体系

### 3.1 五级优先级

```typescript
type Priority = "critical" | "required" | "recommended" | "optional" | "unnecessary";
```

| 级别 | 含义 | 用户展示 | 可被覆盖？ |
|------|------|---------|-----------|
| critical | 生命安全相关，缺少可能致命 | 🔴 必备 | 永远不可 |
| required | 线路条件必须，缺少会有严重不适 | 🟠 必带 | 仅被 critical 覆盖 |
| recommended | 强烈建议，缺少可能影响体验 | 🟡 建议 | 被 required 以上覆盖 |
| optional | 个人偏好，可带可不带 | 🟢 可选 | 被任何级别覆盖 |
| unnecessary | 明确不需要，带了是负担 | ⚪ 不推荐 | — |

### 3.2 critical 触发条件

以下任一条件满足，对应装备升级为 critical：

- `remoteLevel >= "backcountry"` → 应急保温毯、求生哨、头灯
- `altitude > 3500` → 保暖层、应急装备
- 失温三要素同时存在（`tempLow < 5` + `windSpeed > 30` + `precipitation > 50`）→ 防水层、保暖层、应急保温毯
- `difficulty >= "困难"` + `remoteLevel >= "backcountry"` → 急救包、导航设备

### 3.3 规则冲突处理

1. 同一品类多条规则匹配 → 取最高优先级
2. `unnecessary` 与 `critical` 同时匹配 → `critical` 胜出（安全优先）
3. `unnecessary` 与 `required` 同时匹配 → 降级为 `optional`（保守策略）

---

## 四、装备推荐规则（完整）

### 4.1 鞋类（footwear）

**产品筛选逻辑：**
1. 温度范围覆盖 → 2. 难度决定帮高 → 3. 降水决定防水 → 4. 地形决定鞋底

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | duration ≥ 2天 | 多日行程需要防水支撑性好的徒步鞋 |
| required | difficulty = 困难/极难 | 困难线路需要高帮护踝徒步鞋 |
| required | precipitation > 60% | 降水概率高，需要防水鞋 |
| required | terrain 含 scree/rocky | 碎石/岩石路段需要高帮硬底徒步鞋 |
| recommended | distance > 25 | 长距离需要缓震好的徒步鞋 |
| recommended | altitude > 3000 | 高海拔地形复杂，需要专业徒步鞋 |
| recommended | distance > 15 且 duration ≥ 2天 | 多日中距离建议徒步鞋 |
| optional | distance ≤ 15 且 difficulty = 简单 且 precipitation < 30% | 短距离简单天气好，越野跑鞋即可 |
| unnecessary | style = 越野跑 且 distance ≤ 15 且 difficulty = 简单 | 越野跑鞋即可 |

**产品选择优先级：**
```
困难/极难 → ankleSupport = "high"
降水 > 60% → waterproof = true
terrain 含 scree/rocky → ankleSupport = "high", soleType 含 Vibram
其余 → 按温度范围匹配，优先轻量
```

### 4.2 基础层（base-layer）

**核心认知：** 基础层是所有户外活动的底层需求，速干排汗是刚需。当前系统无规则覆盖此品类。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | 所有户外活动 | 速干排汗基础层是户外必备，棉质衣物是失温元凶 |
| recommended | tempHigh > 30 | 高温需要超薄透气速干基础层 |
| recommended | tempLow < 10 | 低温需要保暖基础层（美利奴羊毛） |

**产品选择逻辑：**
```
tempHigh > 30 → 超薄透气，breathability = "high"
tempLow < 5 → 美利奴羊毛，warmthLevel ≥ 2
其余 → 标准速干，breathability = "medium"
```

### 4.3 保暖层（mid-layer）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | tempLow < 0 | 低温环境必须保暖层，失温风险高 |
| required | altitude > 3500 | 高海拔气温骤降，必须保暖层 |
| required | tempLow < 5 且 windSpeed > 30 | 低温+大风，失温三要素之一 |
| recommended | tempLow < 10 | 夜间温度低，建议保暖层 |
| recommended | altitude > 2500 且 duration ≥ 2天 | 高海拔多日温差大 |
| optional | tempLow ≥ 10 且 tempHigh ≤ 30 | 温度适中，可选 |

**产品选择逻辑：**
```
tempLow < -10 → 厚羽绒（fillType = "down", warmthLevel ≥ 4）
tempLow < 0 且 precipitation > 60% → 化纤棉服（fillType = "synthetic"），羽绒受潮失效
tempLow < 0 → 羽绒服（轻量高效）
tempLow < 10 → 抓绒或薄棉服（warmthLevel 2-3）
其余 → 薄抓绒（warmthLevel 1）
```

**联动规则：** 降水 > 60% 时，降低羽绒优先级，提高化纤优先级（羽绒受潮保暖衰减严重）。

### 4.4 防护层/冲锋衣（outer-layer）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | precipitation > 60% | 高降水必须防水透气冲锋衣 |
| required | windSpeed > 40 | 大风需要防风防水层 |
| required | altitude > 4500 | 高海拔天气瞬息万变 |
| required | tempLow < -10 | 极寒需要专业防寒外层 |
| recommended | precipitation > 30% | 有降水风险建议携带 |
| recommended | altitude > 2500 且 duration ≥ 2天 | 高海拔多日天气多变 |
| recommended | windSpeed > 25 且 tempLow < 5 | 低温大风组合 |
| optional | tempHigh > 25 且 precipitation < 20% 且 windSpeed < 15 | 晴热微风可不带 |

### 4.5 雨具（rain-gear）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | precipitation > 60% | 高降水必须雨衣 |
| required | precipitationType = snow | 降雪需要防水外层 |
| recommended | precipitation > 40% | 中等降水风险建议携带 |
| recommended | duration ≥ 2天 | 多日行程天气变化大 |
| optional | precipitation < 30% 且 duration = 1天 | 低风险单日可不带 |

### 4.6 防晒（sun-protection）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| recommended | tempHigh > 20 且 天气含"晴" | 气温高且晴天，建议防晒 |

### 4.7 背包（backpack）

**产品选择逻辑（按容量）：**
```
duration = 1天 → 15-25L
duration = 2-3天 且 style = 轻装速穿 → 30-40L
duration = 2-3天 且 style = 重装露营 → 50-65L
duration ≥ 4天 → 65L+
style = 越野跑 → 水袋背心 5-15L
```

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | style = 重装露营 | 重装需要大容量背包(50-70L) |
| required | style = 轻装速穿 且 duration ≥ 2天 | 多日轻装需要中容量(30-40L) |
| recommended | style = 轻装速穿 且 duration = 1天 | 单日轻装需要小容量(15-25L) |
| recommended | style = 越野跑 | 越野跑需要水袋背心 |

### 4.8 帐篷（tent）

**核心认知：** 轻装穿越如果有山屋/客栈补给，不需要帐篷。当前规则未考虑补给条件。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | style = 重装露营 | 露营必须帐篷 |
| recommended | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 困难 | 困难线路多日穿越可能无补给 |
| optional | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 中等 | 中等线路可选带 |
| unnecessary | style = 越野跑 | 越野跑不需要帐篷 |
| unnecessary | style = 轻装速穿 且 duration = 1天 | 单日轻装不需要 |

**产品选择逻辑：**
```
tempLow < 0 或 altitude > 3500 → seasonRating = "4-season"
其余 → seasonRating = "3-season"，优先轻量
```

### 4.9 睡眠系统（sleeping）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | style = 重装露营 | 露营必须睡袋+睡垫 |
| recommended | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 困难 | 困难线路可能无补给 |
| optional | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 中等 | 中等线路可选 |
| unnecessary | style = 越野跑 | 越野跑不需要 |
| unnecessary | style = 轻装速穿 且 duration = 1天 | 单日不需要 |

**产品选择逻辑：**
```
温标：sleeping.temperatureRating ≤ minTemp - 5（留5°C安全余量）
降水 > 60% → fillType = "synthetic"（化纤耐潮）
其余 → fillType = "down"（羽绒轻量）
```

### 4.10 炊具（cooking）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | style = 重装露营 | 露营需要炊具做饭 |
| recommended | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 困难 | 困难线路可能无法获得补给 |
| optional | style = 轻装速穿 且 duration ≥ 2天 且 difficulty = 中等 | 可选带简易炉头 |
| unnecessary | style = 越野跑 | 越野跑不需要 |
| unnecessary | style = 轻装速穿 且 duration = 1天 | 单日不需要 |

### 4.11 登山杖（trekking-poles）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | duration ≥ 2天 | 两日以上行程，登山杖必备 |
| recommended | 所有路线 | 登山杖可减轻膝盖负担，节省体力 |

**产品选择逻辑：**
```
altitude > 3000 或 difficulty = 困难 → 碳纤维（轻量）
其余 → 铝合金（耐用性价比）
```

### 4.12 导航（navigation）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | 所有路线 | 导航设备是户外安全的基本保障 |

### 4.13 安全装备（safety）

包含急救包、应急保温毯、求生哨等。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| critical | remoteLevel >= backcountry | 偏远地区缺少急救可能致命 |
| required | duration ≥ 2天 | 多日行程必须急救包 |
| required | difficulty = 困难/极难 | 困难线路必须急救包 |
| required | altitude > 3500 | 高海拔必须急救包 |
| recommended | distance > 20 | 长距离建议携带 |
| recommended | style = 越野跑 且 distance > 15 | 长距离越野跑建议基础急救 |

### 4.14 雪地装备（snow-gear）

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | precipitationType = snow | 有降雪需要冰爪和雪套 |
| required | terrain 含 snow_field | 雪地路段需要防滑装备 |
| recommended | tempLow < 0 且 altitude > 3000 | 高海拔低温可能有暗冰 |

### 4.15 水系统（hydration）— 新增品类

**核心认知：** 脱水是户外最常见的体力下降原因。高温 + 高海拔 + 长距离都加速水分流失。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | tempHigh > 30 | 高温必须增加携水量(2L+) |
| required | altitude > 3500 | 高海拔脱水风险高 |
| recommended | distance > 20 | 长距离需要充足饮水 |
| recommended | style = 越野跑 | 越野跑推荐软水壶 |
| recommended | duration ≥ 2天 | 多日行程需要水系统规划 |

### 4.16 照明系统（lighting）— 新增品类

包含头灯、备用电池。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | distance > 10km | 10km以上线路，头灯是安全保障 |
| recommended | 所有路线 | 建议携带头灯以备不时之需 |

### 4.17 应急系统（emergency）— 新增品类

包含应急保温毯、求生哨、打火工具、修补工具。

| 优先级 | 条件 | 推荐理由 |
|--------|------|----------|
| required | 所有路线 | 应急装备是户外安全的生命线 |

---

## 五、装备联动逻辑

### 5.1 羽绒 vs 化纤

```
if precipitation > 60%:
  保暖层：降低羽绒优先级，提高化纤优先级
  睡袋：优先化纤填充
原因：羽绒受潮后保暖性衰减50%以上，化纤受潮仍保留70%保暖
```

### 5.2 轻量化联动

```
if style = 越野跑:
  - 背包容量降至 5-15L 水袋背心
  - 不推荐帐篷、睡眠系统、炊具
  - 强调水系统和补给效率
  - 安全装备降级为基础急救
```

### 5.3 失温风险评估

```
失温风险 = f(tempLow, windSpeed, precipitation, altitude)

触发条件（满足任二即高风险）：
- tempLow < 5°C
- windSpeed > 30 km/h
- precipitation > 50%
- altitude > 3500m

高失温风险 →
  - 保暖层升级为 critical
  - 防水层升级为 critical
  - 应急保温毯升级为 critical
  - 基础层必须（非棉质）
```

---

## 六、产品智能筛选

### 6.1 通用筛选流程

```
1. 按品类过滤产品列表
2. 按温度范围筛选（产品适用温度覆盖当前温度）
3. 按场景特定条件筛选（防水、帮高、容量等）
4. 按重量排序（轻量化优先，同重量按价格）
5. 取第一个作为主推荐，后续3个作为替代
```

### 6.2 各品类筛选要点

| 品类 | 关键筛选维度 | 说明 |
|------|-------------|------|
| footwear | 温度→帮高→防水→鞋底 | 难度决定帮高，降水决定防水 |
| base-layer | 温度→材质→透气性 | 高温选超薄，低温选美利奴 |
| mid-layer | 温度→保暖等级→填充物 | 降水高选化纤，否则羽绒 |
| outer-layer | 防水→防风→透气 | 高海拔选硬壳，低海拔可软壳 |
| backpack | 容量→背负系统→防雨罩 | 容量由行程时长+风格决定 |
| tent | 季节→重量→容量 | 低温/高海拔选四季帐 |
| sleeping | 温标→填充物→重量 | 温标需低于最低温5°C |
| trekking-poles | 材质→重量→折叠 | 高海拔/困难选碳纤维 |

---

## 七、不推荐品类理由模板

| 品类 | 越野跑 | 轻装速穿(1天) | 轻装速穿(多日) |
|------|--------|-------------|--------------|
| tent | 越野跑不需要帐篷 | 单日轻装不需要帐篷 | 多日轻装如有山屋可不带 |
| sleeping | 越野跑不需要露营装备 | 单日轻装不需要 | 如有山屋可不带 |
| cooking | 越野跑不需要炊具 | 单日轻装不需要 | 如有补给可不带 |
| backpack | 越野跑使用水袋背心 | — | — |
| snow-gear | 当前无降雪，不需要雪地装备 | 同左 | 同左 |
| navigation | 越野跑手机导航即可 | 简单线路手机导航即可 | — |

---

## 八、实现分阶段

### Phase 1：规则补齐（立即可做，无需新增字段）

1. 新增 base-layer 规则（所有户外活动 required）
2. 新增 cooking 规则（重装露营 required，多日困难 recommended）
3. 完善 sun-protection 规则（增加海拔条件）
4. 完善 rain-gear 规则（增加多日 recommended）
5. 新增 lighting 规则（多日 required，困难 recommended）
6. 新增 emergency 规则（偏远 critical，高海拔 required）
7. 新增 hydration 规则（高温 required，长距离 recommended）
8. 修复越野跑风格的专属规则
9. 删除重复的 GearRule 接口声明
10. 优先级从四级升级为五级（新增 critical）

### Phase 2：字段扩展（需要更新 Route 类型和数据）

1. Route 类型新增 terrain、ascent、descent 字段
2. 为现有36条线路补充 terrain 和 ascent/descent 数据
3. 更新 recommend.ts 中 terrain 条件评估逻辑
4. 实现基于 ascent/descent 的登山杖和鞋类规则
5. 新增 CookingSpecs 接口

### Phase 3：风险模型（中期）

1. Route 类型新增 remoteLevel 字段
2. 为线路标注偏远程度
3. 实现失温风险计算
4. 实现装备联动逻辑（羽绒vs化纤）
5. 实现 critical 优先级的不可覆盖机制

### Phase 4：架构升级（长期）

1. 三层架构：环境分析 → 行进策略 → 装备推荐
2. EnvironmentProfile 和 StrategyProfile 类型
3. 用户经验等级影响推荐
4. 水源/补给条件影响推荐

---

## 九、测试场景

### 场景1：单日简单线路（梅岭老四坡）
- 线路：8km，1天，海拔500m，简单，ascent 300m
- 天气：25°C，降水10%，微风
- 预期：越野跑鞋(or轻量徒步鞋)、速干基础层、小背包(15-25L)、防晒(optional)
- 不推荐：帐篷、睡眠系统、炊具、雪地装备

### 场景2：单日困难线路
- 线路：25km，1天，海拔1500m，困难，ascent 1200m
- 天气：20°C，降水50%，风速20km/h
- 预期：高帮徒步鞋(required)、速干基础层、冲锋衣(recommended)、登山杖(required)、急救包(required)、头灯(recommended)、25L+背包
- 不推荐：帐篷、炊具

### 场景3：多日重装露营
- 线路：40km，3天，海拔2500m，中等，ascent 2000m
- 天气：5-15°C，降水30%
- 预期：防水徒步鞋、基础层、保暖层(recommended)、冲锋衣(recommended)、雨具(recommended)、大背包(50-65L)、帐篷(required)、睡袋(required)、炊具(required)、登山杖(recommended)、头灯(required)、急救包(required)、导航(recommended)

### 场景4：高海拔技术线路
- 线路：20km，2天，海拔4200m，困难，ascent 1800m
- 天气：-5-10°C，降水60%，风速45km/h，有雪
- 预期：高帮防水徒步鞋(critical)、保暖基础层、羽绒服(or化纤，降水高时优先化纤)、冲锋衣(critical)、雨具(required)、四季帐(required)、低温睡袋(required)、炊具(required)、碳纤维登山杖(critical)、头灯(critical)、急救包(critical)、导航(required)、冰爪(required)、防晒(required)、应急装备(critical)、水系统(required)

### 场景5：越野跑
- 线路：15km，1天，海拔800m，中等，ascent 600m
- 天气：22°C，降水5%
- 预期：越野跑鞋、速干基础层、水袋背心(5-15L)、防晒(optional)
- 不推荐：帐篷、睡眠系统、炊具、冲锋衣(optional)、登山杖(optional)
