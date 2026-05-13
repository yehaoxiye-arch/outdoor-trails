# 径迹户外线路网站 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成径迹户外线路网站的 MVP 版本，包含完整的线路浏览、搜索、天气查询和装备推荐功能

**Architecture:** 基于 Next.js 16 + Tailwind CSS 4 的静态站点，使用 App Router，数据存储在本地 JSON 文件中，后续可迁移到数据库

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript

---

## 文件结构

```
src/
├── app/
│   ├── layout.tsx                 # 根布局
│   ├── page.tsx                   # 首页
│   ├── globals.css                # 全局样式
│   ├── province/
│   │   └── [provinceId]/
│   │       └── page.tsx           # 省份列表页
│   └── route/
│       └── [routeId]/
│           └── page.tsx           # 线路详情页
├── components/
│   ├── Carousel.tsx               # 首页轮播组件
│   ├── Header.tsx                 # 公共头部组件
│   ├── SearchBar.tsx              # 搜索栏组件
│   ├── RouteCard.tsx              # 线路卡片组件
│   ├── WeatherWidget.tsx          # 天气组件
│   └── EquipmentList.tsx          # 装备列表组件
└── data/
    ├── routes.ts                  # 线路数据
    ├── equipment.ts               # 装备数据
    └── weather.ts                 # 天气数据（模拟）
```

---

## Task 1: 重构组件结构

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/RouteCard.tsx`
- Modify: `src/components/Carousel.tsx`
- Modify: `src/app/province/[provinceId]/page.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 创建 Header 组件**

```tsx
// src/components/Header.tsx
import Link from "next/link";

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export default function Header({
  showBackButton = false,
  backUrl = "/",
  backText = "返回",
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-green-800 hover:text-green-900 transition-colors"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-xl font-bold tracking-tight">径迹</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            探索线路
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-full text-sm font-medium transition-colors">
            登录
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 创建 SearchBar 组件**

```tsx
// src/components/SearchBar.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Route, getProvinces } from "@/data/routes";

interface SearchBarProps {
  routes: Route[];
  variant?: "light" | "dark";
}

export default function SearchBar({ routes, variant = "light" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return { provinces: [], routes: [] };

    const q = query.toLowerCase().trim();
    const provinces = getProvinces().filter((p) => p.toLowerCase().includes(q));
    const matchedRoutes = routes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
    );

    return { provinces, routes: matchedRoutes };
  }, [query, routes]);

  const hasResults = results.provinces.length > 0 || results.routes.length > 0;
  const showResults = isFocused && query.trim().length > 0;

  const handleProvinceClick = (province: string) => {
    router.push(`/province/${encodeURIComponent(province)}`);
    setQuery("");
    setIsFocused(false);
  };

  const handleRouteClick = (routeId: string) => {
    router.push(`/route/${routeId}`);
    setQuery("");
    setIsFocused(false);
  };

  const isDark = variant === "dark";

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索省份、线路名称或地区..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full px-6 py-4 pr-14 rounded-full text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
            isDark
              ? "bg-white text-gray-900 placeholder-gray-500"
              : "bg-white text-gray-900 placeholder-gray-500"
          }`}
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
            {hasResults ? (
              <div className="py-2">
                {results.provinces.length > 0 && (
                  <div>
                    <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                      省份
                    </div>
                    {results.provinces.map((province) => (
                      <button
                        key={province}
                        onClick={() => handleProvinceClick(province)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="text-gray-900 font-medium">{province}</div>
                        <div className="text-gray-500 text-sm">查看该省份所有线路</div>
                      </button>
                    ))}
                  </div>
                )}
                {results.routes.length > 0 && (
                  <div>
                    {results.provinces.length > 0 && <div className="border-t border-gray-100 my-1" />}
                    <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                      线路
                    </div>
                    {results.routes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => handleRouteClick(route.id)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="text-gray-900 font-medium">{route.name}</div>
                        <div className="text-gray-500 text-sm">{route.province} · {route.location}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-5 py-4 text-gray-500 text-sm">没有找到匹配的结果</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 RouteCard 组件**

```tsx
// src/components/RouteCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Route } from "@/data/routes";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <Link
      href={`/route/${route.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={route.image}
          alt={route.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              route.difficulty === "简单"
                ? "bg-green-100 text-green-800"
                : route.difficulty === "中等"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {route.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
          {route.name}
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          {route.province} · {route.location}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{route.altitude}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{route.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{route.distance}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: 重构省份页面使用新组件**

```tsx
// src/app/province/[provinceId]/page.tsx
import Link from "next/link";
import { getRoutesByProvince, getProvinces } from "@/data/routes";
import Header from "@/components/Header";
import RouteCard from "@/components/RouteCard";

interface ProvincePageProps {
  params: Promise<{ provinceId: string }>;
}

export async function generateStaticParams() {
  const provinces = getProvinces();
  return provinces.map((province) => ({ provinceId: province }));
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const { provinceId } = await params;
  const province = decodeURIComponent(provinceId);
  const routes = getRoutesByProvince(province);

  if (routes.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">未找到该省份的线路</h1>
          <Link href="/" className="text-green-700 hover:text-green-800 font-medium transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700 transition-colors">首页</Link>
            <span>/</span>
            <span className="text-gray-900">{province}</span>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{province}徒步线路</h1>
          <p className="text-gray-600">发现 {province} 地区 {routes.length} 条精彩徒步路线</p>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: 测试组件重构**

运行: `npm run dev`
访问: http://localhost:3000
搜索"西藏"，点击进入省份页面，验证页面正常显示

- [ ] **Step 6: 提交代码**

```bash
git add src/components/Header.tsx src/components/SearchBar.tsx src/components/RouteCard.tsx src/app/province/[provinceId]/page.tsx
git commit -m "refactor: extract reusable components"
```

---

## Task 2: 添加装备数据和组件

**Files:**
- Create: `src/data/equipment.ts`
- Create: `src/components/EquipmentList.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 创建装备数据文件**

```tsx
// src/data/equipment.ts
export interface Equipment {
  id: string;
  name: string;
  category: "基础" | "进阶" | "专业";
  description: string;
  essential: boolean;
}

export const equipmentCategories = [
  { id: "footwear", name: "鞋靴", icon: "👢" },
  { id: "clothing", name: "服装", icon: "👕" },
  { id: "backpack", name: "背包", icon: "🎒" },
  { id: "navigation", name: "导航", icon: "🧭" },
  { id: "safety", name: "安全", icon: "🏥" },
  { id: "camping", name: "露营", icon: "⛺" },
];

export const equipment: Equipment[] = [
  { id: "hiking-boots", name: "徒步鞋", category: "基础", description: "防水、支撑性好的中高帮徒步鞋", essential: true },
  { id: "trekking-poles", name: "登山杖", category: "基础", description: "减轻膝盖压力，保持平衡", essential: true },
  { id: "backpack", name: "登山背包", category: "基础", description: "30-50L，带腰带和胸带", essential: true },
  { id: "rain-jacket", name: "冲锋衣", category: "基础", description: "防风防水透气", essential: true },
  { id: "headlamp", name: "头灯", category: "基础", description: "解放双手，必备照明工具", essential: true },
  { id: "water-bottle", name: "水壶/水袋", category: "基础", description: "至少2L容量", essential: true },
  { id: "first-aid", name: "急救包", category: "基础", description: "创可贴、绷带、消毒用品", essential: true },
  { id: "sunscreen", name: "防晒用品", category: "基础", description: "防晒霜、太阳镜、遮阳帽", essential: true },
  { id: "sleeping-bag", name: "睡袋", category: "进阶", description: "根据季节选择温标", essential: false },
  { id: "tent", name: "帐篷", category: "进阶", description: "轻量化、防风防雨", essential: false },
  { id: "stove", name: "炉具", category: "进阶", description: "用于加热食物和水", essential: false },
  { id: "gps", name: "GPS设备", category: "专业", description: "专业导航设备", essential: false },
  { id: "satellite-phone", name: "卫星电话", category: "专业", description: "紧急通讯设备", essential: false },
];

export function getEquipmentByDifficulty(difficulty: string): Equipment[] {
  switch (difficulty) {
    case "简单":
      return equipment.filter((e) => e.category === "基础" && e.essential);
    case "中等":
      return equipment.filter((e) => e.category === "基础" || e.category === "进阶");
    case "困难":
      return equipment;
    default:
      return equipment.filter((e) => e.essential);
  }
}
```

- [ ] **Step 2: 创建 EquipmentList 组件**

```tsx
// src/components/EquipmentList.tsx
import { Equipment } from "@/data/equipment";

interface EquipmentListProps {
  equipment: Equipment[];
}

export default function EquipmentList({ equipment }: EquipmentListProps) {
  const essential = equipment.filter((e) => e.essential);
  const optional = equipment.filter((e) => !e.essential);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">装备建议</h3>
      {essential.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">必备装备</h4>
          <ul className="space-y-2">
            {essential.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="text-gray-900 font-medium">{item.name}</span>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">可选装备</h4>
          <ul className="space-y-2">
            {optional.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <span className="text-gray-900">{item.name}</span>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 更新线路详情页使用装备组件**

```tsx
// 在 src/app/route/[routeId]/page.tsx 中添加导入
import { getEquipmentByDifficulty } from "@/data/equipment";
import EquipmentList from "@/components/EquipmentList";

// 在页面中使用
const equipment = getEquipmentByDifficulty(route.difficulty);

// 替换原来的装备建议部分
<EquipmentList equipment={equipment} />
```

- [ ] **Step 4: 测试装备功能**

运行: `npm run dev`
访问任意线路详情页，验证装备建议正确显示

- [ ] **Step 5: 提交代码**

```bash
git add src/data/equipment.ts src/components/EquipmentList.tsx src/app/route/[routeId]/page.tsx
git commit -m "feat: add equipment recommendations"
```

---

## Task 3: 添加天气组件（模拟数据）

**Files:**
- Create: `src/data/weather.ts`
- Create: `src/components/WeatherWidget.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 创建天气数据文件**

```tsx
// src/data/weather.ts
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

// 模拟天气数据
const weatherDatabase: Record<string, WeatherData> = {
  西藏: { temperature: 5, condition: "晴朗", humidity: 30, windSpeed: 15, icon: "☀️" },
  四川: { temperature: 12, condition: "多云", humidity: 60, windSpeed: 8, icon: "⛅" },
  云南: { temperature: 18, condition: "晴朗", humidity: 45, windSpeed: 5, icon: "☀️" },
  江西: { temperature: 22, condition: "小雨", humidity: 80, windSpeed: 10, icon: "🌧️" },
  陕西: { temperature: 15, condition: "阴天", humidity: 55, windSpeed: 12, icon: "☁️" },
  香港: { temperature: 28, condition: "炎热", humidity: 75, windSpeed: 15, icon: "🌡️" },
};

export function getWeatherByProvince(province: string): WeatherData {
  return weatherDatabase[province] || { temperature: 20, condition: "未知", humidity: 50, windSpeed: 10, icon: "❓" };
}

export function getWeatherForecast(province: string): WeatherForecast[] {
  const base = getWeatherByProvince(province);
  const days = ["今天", "明天", "后天"];
  return days.map((date, i) => ({
    date,
    high: base.temperature + Math.floor(Math.random() * 5) - 2 + i,
    low: base.temperature - Math.floor(Math.random() * 5) - 2 + i,
    condition: base.condition,
    icon: base.icon,
  }));
}
```

- [ ] **Step 2: 创建 WeatherWidget 组件**

```tsx
// src/components/WeatherWidget.tsx
import { getWeatherByProvince, getWeatherForecast } from "@/data/weather";

interface WeatherWidgetProps {
  province: string;
}

export default function WeatherWidget({ province }: WeatherWidgetProps) {
  const weather = getWeatherByProvince(province);
  const forecast = getWeatherForecast(province);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">天气信息</h3>
      <div className="text-center mb-4">
        <span className="text-5xl">{weather.icon}</span>
        <p className="text-3xl font-bold mt-2">{weather.temperature}°C</p>
        <p className="text-gray-600">{weather.condition}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm">湿度</p>
          <p className="font-medium">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">风速</p>
          <p className="font-medium">{weather.windSpeed} km/h</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">未来天气</h4>
        <div className="space-y-2">
          {forecast.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <span className="text-gray-600">{day.date}</span>
              <span>{day.icon}</span>
              <span className="text-gray-900">
                {day.high}° / {day.low}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 更新线路详情页使用天气组件**

```tsx
// 在 src/app/route/[routeId]/page.tsx 中添加导入
import WeatherWidget from "@/components/WeatherWidget";

// 替换原来的天气信息部分
<WeatherWidget province={route.province} />
```

- [ ] **Step 4: 测试天气功能**

运行: `npm run dev`
访问任意线路详情页，验证天气信息正确显示

- [ ] **Step 5: 提交代码**

```bash
git add src/data/weather.ts src/components/WeatherWidget.tsx src/app/route/[routeId]/page.tsx
git commit -m "feat: add weather widget with mock data"
```

---

## Task 4: 添加更多线路数据

**Files:**
- Modify: `src/data/routes.ts`

- [ ] **Step 1: 添加更多线路数据**

```tsx
// 在 src/data/routes.ts 的 routes 数组中添加新线路
{
  id: "huangshan",
  name: "黄山",
  province: "安徽",
  location: "黄山市",
  altitude: "1864m",
  duration: "2天",
  distance: "30km",
  difficulty: "中等",
  description: "黄山以奇松、怪石、云海、温泉、冬雪"五绝"著称于世，拥有"天下第一奇山"之称。",
  image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1920&q=80",
  bgColor: "#1a2810",
  textColor: "#d8f0d8",
},
{
  id: "zhangjiajie",
  name: "张家界",
  province: "湖南",
  location: "张家界市",
  altitude: "1262m",
  duration: "3天",
  distance: "40km",
  difficulty: "中等",
  description: "张家界国家森林公园以独特的石英砂岩峰林地貌闻名，电影《阿凡达》的取景地。",
  image: "https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=1920&q=80",
  bgColor: "#1a2810",
  textColor: "#d8f0d8",
},
{
  id: "emei",
  name: "峨眉山",
  province: "四川",
  location: "乐山市",
  altitude: "3099m",
  duration: "2天",
  distance: "50km",
  difficulty: "中等",
  description: "峨眉山是中国四大佛教名山之一，以雄秀奇险的自然风光和深厚的佛教文化著称。",
  image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=80",
  bgColor: "#0a1f0a",
  textColor: "#d8f0d8",
},
```

- [ ] **Step 2: 测试新线路数据**

运行: `npm run dev`
访问首页，验证新线路显示在轮播中

- [ ] **Step 3: 提交代码**

```bash
git add src/data/routes.ts
git commit -m "data: add more hiking routes"
```

---

## Task 5: 响应式设计优化

**Files:**
- Modify: `src/components/Carousel.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`
- Modify: `src/app/province/[provinceId]/page.tsx`

- [ ] **Step 1: 优化首页响应式布局**

```tsx
// 在 Carousel.tsx 中优化移动端布局
// 搜索栏在移动端全宽
<div className="w-full max-w-2xl px-4 md:px-0">
  {/* ... */}
</div>

// 标题字号响应式
<h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-4 drop-shadow-lg">
  发现你的下一次冒险
</h1>
```

- [ ] **Step 2: 优化详情页响应式布局**

```tsx
// 在 route/[routeId]/page.tsx 中
// 移动端单栏，桌面端三栏
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {/* 左侧内容 - 移动端全宽 */}
  <div className="lg:col-span-2">
    {/* ... */}
  </div>
  {/* 右侧边栏 - 移动端全宽 */}
  <div className="lg:col-span-1">
    {/* ... */}
  </div>
</div>

// 统计卡片移动端2列
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  {/* ... */}
</div>
```

- [ ] **Step 3: 测试响应式设计**

运行: `npm run dev`
使用浏览器开发者工具测试不同屏幕尺寸（375px, 768px, 1024px, 1440px）

- [ ] **Step 4: 提交代码**

```bash
git add src/components/Carousel.tsx src/app/route/[routeId]/page.tsx src/app/province/[provinceId]/page.tsx
git commit -m "fix: improve responsive design"
```

---

## Task 6: 添加页面元数据和 SEO

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/province/[provinceId]/page.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 为省份页面添加元数据**

```tsx
// src/app/province/[provinceId]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const { provinceId } = await params;
  const province = decodeURIComponent(provinceId);
  return {
    title: `${province}徒步线路 - 径迹`,
    description: `探索${province}地区最精彩的户外徒步路线，获取专业装备推荐和天气信息`,
  };
}
```

- [ ] **Step 2: 为线路详情页添加元数据**

```tsx
// src/app/route/[routeId]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = getRouteById(routeId);
  if (!route) return { title: "线路未找到 - 径迹" };
  return {
    title: `${route.name} - 径迹`,
    description: route.description,
  };
}
```

- [ ] **Step 3: 测试元数据**

运行: `npm run build`
检查构建输出，验证元数据正确生成

- [ ] **Step 4: 提交代码**

```bash
git add src/app/province/[provinceId]/page.tsx src/app/route/[routeId]/page.tsx
git commit -m "seo: add dynamic metadata for pages"
```

---

## 完成检查清单

- [ ] 所有页面正常加载
- [ ] 搜索功能正常工作
- [ ] 天气信息正确显示
- [ ] 装备建议正确显示
- [ ] 响应式设计在各尺寸正常
- [ ] 无 TypeScript 错误
- [ ] 无控制台错误
- [ ] 构建成功

---

## 后续功能（下一阶段）

1. 用户系统（注册、登录、收藏）
2. 真实天气 API 集成
3. 地图集成
4. 用户评论系统
5. 更多线路数据
6. 性能优化（图片懒加载、代码分割）
