# 移动端适配实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让径迹网站在手机端（320px-768px）可正常使用，所有页面和组件适配移动端布局。

**Architecture:** 采用 Tailwind CSS 响应式前缀（`md:` 断点 768px）实现移动优先布局。默认样式面向移动端，`md:` 以上恢复桌面端布局。不引入新依赖，不改变组件结构，仅修改 className。

**Tech Stack:** Next.js 16 + Tailwind CSS 4（默认断点：sm:640px, md:768px, lg:1024px）

---

## 需要修改的文件

| 文件 | 职责 | 改动范围 |
|------|------|----------|
| `src/app/route/[routeId]/page.tsx` | 线路详情页主布局 | 双栏→单栏 |
| `src/components/trail/RouteDetailContent.tsx` | 天气+装备双栏 | 双栏→单栏 |
| `src/components/trail/TrailMainContent.tsx` | 内容区+条件Tab | 侧边栏折叠 |
| `src/components/layout/Header.tsx` | 顶部导航栏 | 搜索栏适配 |
| `src/components/trail/WeatherSection.tsx` | 天气预报卡片 | padding调整 |
| `src/components/trail/TrailHero.tsx` | 顶部大图 | 已有响应式，微调 |
| `src/components/trail/StatsBar.tsx` | 统计条 | 已有响应式，微调 |
| `src/app/page.tsx` | 首页 | 已有响应式，微调 |
| `src/app/province/[provinceId]/page.tsx` | 省份线路列表页 | 筛选栏适配 |

---

### Task 1: 线路详情页双栏布局适配

**文件:** `src/app/route/[routeId]/page.tsx`

**问题:** 主内容区使用 `flex gap-6` + `flex-[65]` / `flex-[35]`，在手机端两个列会挤压到无法阅读。

**改动:** 默认纵向堆叠，`md:` 以上恢复双栏。

- [ ] **Step 1: 修改双栏容器**

找到第 85 行的双栏 flex 容器：
```tsx
// 当前
<div className="flex gap-6">

// 改为
<div className="flex flex-col gap-6 md:flex-row">
```

- [ ] **Step 2: 修改左右列宽度**

找到 `flex-[65]` 和 `flex-[35]` 的列：
```tsx
// 当前
<div className="flex-[65]">

// 改为
<div className="w-full md:flex-[65]">
```

```tsx
// 当前
<div className="flex-[35]">

// 改为
<div className="w-full md:flex-[35]">
```

- [ ] **Step 3: 调整页面 padding**

找到主内容区容器：
```tsx
// 当前
<div className="max-w-[1280px] mx-auto px-6 py-6">

// 改为
<div className="max-w-[1280px] mx-auto px-4 py-4 md:px-6 md:py-6">
```

同样修改标题区域：
```tsx
// 当前
<div className="max-w-[1280px] mx-auto px-6 pt-6 pb-4">

// 改为
<div className="max-w-[1280px] mx-auto px-4 pt-4 pb-3 md:px-6 md:pt-6 md:pb-4">
```

- [ ] **Step 4: 验证**

运行 `npm run dev`，在浏览器中用 DevTools 模拟 iPhone SE (375px) 查看布局是否正确堆叠。

---

### Task 2: 天气+装备双栏布局适配

**文件:** `src/components/trail/RouteDetailContent.tsx`

**问题:** 天气和装备推荐并排显示，手机端宽度不足。

**改动:** 默认纵向堆叠，`md:` 以上并排。

- [ ] **Step 1: 修改容器 flex 方向**

找到第 24 行：
```tsx
// 当前
<div className="flex gap-6 mt-8 pt-8 border-t border-gray-200">

// 改为
<div className="flex flex-col gap-6 mt-6 pt-6 border-t border-gray-200 md:flex-row md:mt-8 md:pt-8">
```

- [ ] **Step 2: 验证**

手机端天气和装备卡片应纵向排列。

---

### Task 3: 内容区 Tab 和条件面板适配

**文件:** `src/components/trail/TrailMainContent.tsx`

**问题:** Tab 栏在窄屏可能溢出；条件面板的 `w-64` 侧边栏在手机端占用过多空间。

**改动:** Tab 栏可滚动；条件面板纵向堆叠。

- [ ] **Step 1: Tab 栏横向滚动**

找到第 27 行的 tab 容器：
```tsx
// 当前
<div className="flex gap-6 mb-6 border-b border-gray-200">

// 改为
<div className="flex gap-4 mb-4 overflow-x-auto md:gap-6 md:mb-6 border-b border-gray-200">
```

同时修改每个 tab 按钮，防止换行：
```tsx
// 找到 tab 按钮的 className，在末尾添加 whitespace-nowrap
// 当前类似：
className={`py-3 text-sm font-medium ...`}

// 改为：
className={`py-3 text-sm font-medium whitespace-nowrap ...`}
```

- [ ] **Step 2: 数据行适配**

找到第 78 行的数据行：
```tsx
// 当前
<div className="flex gap-4 mb-6">

// 改为
<div className="grid grid-cols-3 gap-2 mb-4 md:flex md:gap-6 md:mb-6">
```

- [ ] **Step 3: 条件面板纵向堆叠**

找到第 156 行的 ConditionsTab 外层 flex：
```tsx
// 当前
<div className="flex gap-6">

// 改为
<div className="flex flex-col gap-4 md:flex-row md:gap-6">
```

找到第 204 行的侧边栏：
```tsx
// 当前
<div className="w-64 flex-shrink-0">

// 改为
<div className="w-full md:w-64 flex-shrink-0">
```

- [ ] **Step 4: 验证**

Tab 栏在手机端应可横向滚动，条件面板应纵向堆叠。

---

### Task 4: 顶部导航栏移动端适配

**文件:** `src/components/layout/Header.tsx`

**问题:** Logo + 搜索栏 + 返回按钮在窄屏会挤压。

**改动:** 手机端隐藏搜索栏，仅显示 Logo 和返回按钮。

- [ ] **Step 1: 搜索栏手机端隐藏**

找到搜索栏的容器（在 Header.tsx 中搜索 `SearchBar`），给它添加响应式类：
```tsx
// 找到搜索栏的容器 div，添加 hidden md:block
// 例如：
<div className="hidden md:block flex-1 max-w-md mx-4">
  <SearchBar />
</div>
```

- [ ] **Step 2: 验证**

手机端 Header 应只显示 Logo 和返回按钮，不显示搜索栏。

---

### Task 5: 天气预报组件 padding 适配

**文件:** `src/components/trail/WeatherSection.tsx`

**问题:** `p-6` 的 padding 在手机端偏大。

**改动:** 手机端减小 padding。

- [ ] **Step 1: 外层容器 padding**

找到第 140 行：
```tsx
// 当前
<div className="bg-white rounded-alltrails shadow-alltrails p-6">

// 改为
<div className="bg-white rounded-alltrails shadow-alltrails p-4 md:p-6">
```

- [ ] **Step 2: 验证**

天气卡片在手机端 padding 应更紧凑。

---

### Task 6: 首页移动端微调

**文件:** `src/app/page.tsx`

**现状:** 已有 `grid-cols-1 md:grid-cols-3` 和响应式文字大小，基本可用。

**改动:** 减小手机端 padding。

- [ ] **Step 1: 查看并调整容器 padding**

如果首页有 `px-6` 的容器，改为 `px-4 md:px-6`。

- [ ] **Step 2: 验证**

首页在手机端应正常显示，hero 区域和特性卡片纵向排列。

---

### Task 7: 省份列表页筛选栏适配

**文件:** `src/app/province/[provinceId]/page.tsx`

**问题:** 筛选栏和路线卡片网格在手机端可能需要调整。

**改动:** 减小 padding，调整网格。

- [ ] **Step 1: 减小页面 padding**

```tsx
// 找到主容器的 px-6，改为 px-4 md:px-6
```

- [ ] **Step 2: 验证**

路线卡片在手机端应单列显示（已有 `grid-cols-1`）。

---

### Task 8: 装备推荐组件适配

**文件:** `src/components/gear/GearPlanner.tsx`, `src/components/gear/CategoryCard.tsx`

**问题:** padding 和间距在手机端偏大。

**改动:** 减小手机端间距。

- [ ] **Step 1: GearPlanner padding**

```tsx
// 当前
<div className="bg-white rounded-alltrails shadow-alltrails p-4">

// 改为（已足够紧凑，保持不变或微调）
<div className="bg-white rounded-alltrails shadow-alltrails p-3 md:p-4">
```

- [ ] **Step 2: CategoryCard 品牌卡片 padding**

```tsx
// 当前
<div className="p-4 rounded-alltrails ...">

// 改为
<div className="p-3 rounded-alltrails md:p-4 ...">
```

- [ ] **Step 3: 验证**

装备推荐卡片在手机端应紧凑显示，不溢出。

---

## 验证清单

所有任务完成后，在以下视口宽度下验证每个页面：

| 视口 | 设备 | 关键检查点 |
|------|------|-----------|
| 375px | iPhone SE | 所有内容可读，无水平溢出 |
| 390px | iPhone 14 | 同上 |
| 414px | iPhone 14 Plus | 同上 |
| 768px | iPad | 过渡到桌面布局 |

**测试页面：**
1. `/` — 首页
2. `/province/jiangxi` — 省份列表
3. `/route/wugong-reverse-longshan` — 线路详情（最复杂）

**测试操作：**
- 左右滑动无水平滚动条
- 文字可读（不被截断）
- 按钮可点击（触摸目标 ≥ 44px）
- 图片不溢出容器
- 装备推荐卡片正常展开/收起
