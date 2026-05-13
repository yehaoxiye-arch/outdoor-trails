# 径迹（Jingji）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建径迹户外徒步装备智能推荐网站，包含首页、线路详情页、装备推荐系统

**Architecture:** 基于 Next.js 16 App Router + React 19 + Tailwind CSS 4，采用两层决策引擎（线路规则 + 天气调整）实现装备推荐

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Open-Meteo API

---

## 文件结构

```
src/
├── app/
│   ├── page.tsx                    # 首页
│   ├── layout.tsx                  # 根布局
│   └── route/
│       └── [routeId]/
│           └── page.tsx            # 线路详情页
├── components/
│   ├── ui/                         # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── SearchInput.tsx
│   ├── layout/                     # 布局组件
│   │   ├── Header.tsx
│   │   └── Breadcrumb.tsx
│   ├── home/                       # 首页组件
│   │   ├── HeroCarousel.tsx
│   │   └── SearchBar.tsx
│   ├── trail/                      # 线路详情组件
│   │   ├── TrailHero.tsx
│   │   ├── TrailInfo.tsx
│   │   ├── RouteSelector.tsx
│   │   └── StatsBar.tsx
│   └── gear/                       # 装备推荐组件
│       ├── GearPlanner.tsx
│       ├── WeatherForecast.tsx
│       ├── CategoryCard.tsx
│       ├── ProductCard.tsx
│       └── NotRecommended.tsx
├── data/
│   ├── routes.ts                   # 线路数据
│   ├── products.ts                 # 产品数据
│   ├── gear-rules.ts              # 装备规则
│   └── weather.ts                 # 天气模拟
├── lib/
│   ├── recommend.ts               # 推荐引擎
│   └── weather.ts                 # 天气 API
└── types/
    ├── route.ts                   # 线路类型
    ├── product.ts                 # 产品类型
    └── weather.ts                 # 天气类型
```

---

## Task 1: 项目初始化和基础配置

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `tailwind.config.ts`

- [ ] **Step 1: 检查项目状态**

Run: `cd outdoor-trails && npm run dev`
Expected: 项目能正常启动，访问 http://localhost:3000

- [ ] **Step 2: 更新 layout.tsx 字体配置**

```typescript
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "径迹 - 户外徒步装备智能推荐",
  description: "根据线路条件和天气预报，为户外徒步者提供专业装备推荐",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#16A34A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable} h-full`}>
      <body className="min-h-full font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 更新 globals.css 色彩系统**

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-inter);
  --font-chinese: var(--font-noto-sans-sc);

  /* Primary Colors */
  --color-primary-500: #16A34A;
  --color-primary-600: #15803D;
  --color-primary-100: #DCFCE7;

  /* Background Colors */
  --color-background: #FFFFFF;
  --color-background-gray: #F8FAFC;

  /* Text Colors */
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;

  /* Border Colors */
  --color-border: #E5E7EB;

  /* Difficulty Colors */
  --color-difficulty-easy: #22C55E;
  --color-difficulty-easy-bg: #F0FDF4;
  --color-difficulty-medium: #EAB308;
  --color-difficulty-medium-bg: #FEFCE8;
  --color-difficulty-hard: #EF4444;
  --color-difficulty-hard-bg: #FEF2F2;
  --color-difficulty-expert: #7C3AED;
  --color-difficulty-expert-bg: #F5F3FF;

  /* Priority Colors */
  --color-priority-required: #DC2626;
  --color-priority-required-bg: #FEF2F2;
  --color-priority-recommended: #A16207;
  --color-priority-recommended-bg: #FEFCE8;
  --color-priority-optional: #15803D;
  --color-priority-optional-bg: #F0FDF4;

  /* Tag Colors */
  --color-tag-weather: #3B82F6;
  --color-tag-weather-bg: #EFF6FF;
  --color-tag-terrain: #22C55E;
  --color-tag-terrain-bg: #F0FDF4;
  --color-tag-route: #F59E0B;
  --color-tag-route-bg: #FFFBEB;
  --color-tag-style: #8B5CF6;
  --color-tag-style-bg: #F5F3FF;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: var(--font-inter), var(--font-noto-sans-sc), "PingFang SC", "Microsoft YaHei", sans-serif;
}

::selection {
  background: rgba(22, 163, 74, 0.3);
  color: #fff;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: 提交配置更改**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "chore: update font and color configuration"
```

---

## Task 2: 创建基础 UI 组件

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/SearchInput.tsx`

- [ ] **Step 1: 创建 Button 组件**

```typescript
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-colors";

    const variants = {
      primary: "bg-primary-500 text-white hover:bg-primary-600 rounded-full",
      secondary: "bg-white text-gray-700 border border-gray-300 hover:border-primary-500 hover:text-primary-500 rounded-lg",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
```

- [ ] **Step 2: 创建 Badge 组件**

```typescript
// src/components/ui/Badge.tsx
import { HTMLAttributes } from "react";

type Difficulty = "简单" | "中等" | "困难" | "极难";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "difficulty" | "priority";
  value?: string;
  difficulty?: Difficulty;
  priority?: "required" | "recommended" | "optional";
}

export default function Badge({
  variant = "difficulty",
  value,
  difficulty,
  priority,
  className = "",
  ...props
}: BadgeProps) {
  const difficultyColors: Record<Difficulty, string> = {
    简单: "bg-difficulty-easy-bg text-difficulty-easy",
    中等: "bg-difficulty-medium-bg text-difficulty-medium",
    困难: "bg-difficulty-hard-bg text-difficulty-hard",
    极难: "bg-difficulty-expert-bg text-difficulty-expert",
  };

  const priorityColors = {
    required: "bg-priority-required-bg text-priority-required",
    recommended: "bg-priority-recommended-bg text-priority-recommended",
    optional: "bg-priority-optional-bg text-priority-optional",
  };

  const priorityLabels = {
    required: "必备",
    recommended: "推荐",
    optional: "可选",
  };

  if (variant === "difficulty" && difficulty) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${difficultyColors[difficulty]} ${className}`}
        {...props}
      >
        {difficulty}
      </span>
    );
  }

  if (variant === "priority" && priority) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${priorityColors[priority]} ${className}`}
        {...props}
      >
        {priorityLabels[priority]}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 ${className}`}
      {...props}
    >
      {value}
    </span>
  );
}
```

- [ ] **Step 3: 创建 Card 组件**

```typescript
// src/components/ui/Card.tsx
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover";
}

export default function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-white rounded-xl border border-gray-200 shadow-sm",
    hover: "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: 创建 SearchInput 组件**

```typescript
// src/components/ui/SearchInput.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ icon = true, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
        )}
        <input
          ref={ref}
          type="text"
          className={`w-full ${
            icon ? "pl-12 pr-4" : "px-4"
          } py-4 text-base text-gray-900 placeholder-gray-500 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
```

- [ ] **Step 5: 提交 UI 组件**

```bash
git add src/components/ui/
git commit -m "feat: create base UI components (Button, Badge, Card, SearchInput)"
```

---

## Task 3: 创建布局组件

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Breadcrumb.tsx`

- [ ] **Step 1: 创建 Header 组件**

```typescript
// src/components/layout/Header.tsx
import Link from "next/link";

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        {showBack ? (
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回</span>
          </Link>
        ) : (
          <div />
        )}
        <Link href="/" className="text-primary-500 font-semibold">
          径迹
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 创建 Breadcrumb 组件**

```typescript
// src/components/layout/Breadcrumb.tsx
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: 提交布局组件**

```bash
git add src/components/layout/
git commit -m "feat: create layout components (Header, Breadcrumb)"
```

---

## Task 4: 创建首页组件

**Files:**
- Create: `src/components/home/HeroCarousel.tsx`
- Create: `src/components/home/SearchBar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 创建 HeroCarousel 组件**

```typescript
// src/components/home/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    alt: "山峰",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    alt: "峡谷",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
    alt: "雪山",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}
```

- [ ] **Step 2: 创建 SearchBar 组件**

```typescript
// src/components/home/SearchBar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchRoutes } from "@/data/routes";
import SearchInput from "@/components/ui/SearchInput";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchRoutes(query);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (routeId: string) => {
    router.push(`/route/${routeId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[560px] mx-auto">
      <SearchInput
        placeholder="搜索线路名称、地区..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-[320px] overflow-y-auto">
          {results.map((route) => (
            <button
              key={route.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              onClick={() => handleSelect(route.id)}
            >
              <div className="font-medium text-gray-900">{route.name}</div>
              <div className="text-sm text-gray-500">
                {route.province} · {route.location}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-4 text-center text-gray-500">
          未找到相关线路
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 更新首页**

```typescript
// src/app/page.tsx
import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";

export default function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden">
      <HeroCarousel />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          径迹
        </h1>
        <p className="text-lg text-white/80 mb-8 drop-shadow-md">
          发现你的下一次冒险
        </p>
        <SearchBar />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: 提交首页组件**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: create homepage with hero carousel and search bar"
```

---

## Task 5: 创建线路详情页组件

**Files:**
- Create: `src/components/trail/TrailHero.tsx`
- Create: `src/components/trail/TrailInfo.tsx`
- Create: `src/components/trail/RouteSelector.tsx`
- Create: `src/components/trail/StatsBar.tsx`
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 创建 TrailHero 组件**

```typescript
// src/components/trail/TrailHero.tsx
import Image from "next/image";

interface TrailHeroProps {
  image: string;
  alt: string;
}

export default function TrailHero({ image, alt }: TrailHeroProps) {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh]">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
```

- [ ] **Step 2: 创建 StatsBar 组件**

```typescript
// src/components/trail/StatsBar.tsx
interface StatsBarProps {
  distance: string;
  duration: string;
  altitude: string;
  difficulty: string;
}

export default function StatsBar({ distance, duration, altitude, difficulty }: StatsBarProps) {
  const difficultyColors: Record<string, string> = {
    简单: "bg-difficulty-easy-bg text-difficulty-easy",
    中等: "bg-difficulty-medium-bg text-difficulty-medium",
    困难: "bg-difficulty-hard-bg text-difficulty-hard",
    极难: "bg-difficulty-expert-bg text-difficulty-expert",
  };

  return (
    <div className="bg-background-gray rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{distance}</span>
          </div>
          <span className="text-xs text-gray-500">距离</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{duration}</span>
          </div>
          <span className="text-xs text-gray-500">时长</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{altitude}</span>
          </div>
          <span className="text-xs text-gray-500">海拔</span>
        </div>

        <div className="text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${difficultyColors[difficulty] || "bg-gray-100 text-gray-700"}`}>
            {difficulty}
          </span>
          <div className="mt-1 text-xs text-gray-500">难度</div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 RouteSelector 组件**

```typescript
// src/components/trail/RouteSelector.tsx
"use client";

import { RouteStyle } from "@/types/route";

interface RouteSelectorProps {
  styles: RouteStyle[];
  selectedStyle: RouteStyle;
  onStyleChange: (style: RouteStyle) => void;
}

export default function RouteSelector({ styles, selectedStyle, onStyleChange }: RouteSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => onStyleChange(style)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStyle === style
              ? "bg-primary-500 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-primary-500"
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 创建 TrailInfo 组件**

```typescript
// src/components/trail/TrailInfo.tsx
import Breadcrumb from "@/components/layout/Breadcrumb";
import StatsBar from "./StatsBar";
import RouteSelector from "./RouteSelector";
import { Route, RouteStyleData } from "@/types/route";

interface TrailInfoProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function TrailInfo({ route, selectedStyle }: TrailInfoProps) {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: route.province, href: `/province/${route.province}` },
    { label: route.name },
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {route.name}
      </h1>

      <p className="text-gray-500 mb-4">
        {route.location}
      </p>

      <div className="mb-6">
        <RouteSelector
          styles={route.styles.map((s) => s.name)}
          selectedStyle={selectedStyle.name}
          onStyleChange={() => {}}
        />
      </div>

      <StatsBar
        distance={selectedStyle.distance}
        duration={selectedStyle.duration}
        altitude={selectedStyle.altitude}
        difficulty={selectedStyle.difficulty}
      />

      <div className="mt-6">
        <p className="text-gray-700 leading-relaxed">
          {selectedStyle.description}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 更新线路详情页**

```typescript
// src/app/route/[routeId]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { getRouteById, routes } from "@/data/routes";
import Header from "@/components/layout/Header";
import TrailHero from "@/components/trail/TrailHero";
import TrailInfo from "@/components/trail/TrailInfo";

interface RoutePageProps {
  params: Promise<{
    routeId: string;
  }>;
}

export async function generateStaticParams() {
  return routes.map((route) => ({
    routeId: route.id,
  }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = getRouteById(routeId);
  if (!route) {
    return { title: "线路未找到 - 径迹" };
  }
  return {
    title: `${route.name} - 径迹`,
    description: route.styles[0]?.description || "",
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;
  const route = getRouteById(routeId);

  if (!route) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">未找到该线路</h1>
          <Link href="/" className="text-primary-500 hover:text-primary-600 font-medium">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const defaultStyle = route.styles[0];

  return (
    <div className="min-h-screen bg-white">
      <Header showBack />
      <TrailHero image={route.image} alt={route.name} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrailInfo route={route} selectedStyle={defaultStyle} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-background-gray rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">装备推荐</h3>
              <p className="text-gray-500 text-sm">
                选择出发日期后，系统将根据线路条件和天气预报为您生成个性化装备清单。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 6: 提交线路详情页组件**

```bash
git add src/components/trail/ src/app/route/[routeId]/page.tsx
git commit -m "feat: create trail detail page components"
```

---

## Task 6: 实现天气服务

**Files:**
- Create: `src/lib/weather.ts`
- Create: `src/data/weather.ts`

- [ ] **Step 1: 创建天气 API 服务**

```typescript
// src/lib/weather.ts
import { DayForecast, WeatherResult } from "@/types/weather";

const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";

const weatherCodeMap: Record<number, { condition: string; icon: string }> = {
  0: { condition: "晴", icon: "☀️" },
  1: { condition: "少云", icon: "⛅" },
  2: { condition: "多云", icon: "⛅" },
  3: { condition: "阴", icon: "☁️" },
  45: { condition: "雾", icon: "🌫️" },
  48: { condition: "雾凇", icon: "🌫️" },
  51: { condition: "毛毛雨", icon: "🌦️" },
  53: { condition: "毛毛雨", icon: "🌦️" },
  55: { condition: "毛毛雨", icon: "🌦️" },
  61: { condition: "小雨", icon: "🌧️" },
  63: { condition: "中雨", icon: "🌧️" },
  65: { condition: "大雨", icon: "🌧️" },
  71: { condition: "小雪", icon: "🌨️" },
  73: { condition: "中雪", icon: "🌨️" },
  75: { condition: "大雪", icon: "🌨️" },
  77: { condition: "雪粒", icon: "🌨️" },
  80: { condition: "阵雨", icon: "🌧️" },
  81: { condition: "阵雨", icon: "🌧️" },
  82: { condition: "暴雨", icon: "🌧️" },
  85: { condition: "阵雪", icon: "🌨️" },
  86: { condition: "阵雪", icon: "🌨️" },
  95: { condition: "雷暴", icon: "⛈️" },
  96: { condition: "雷暴", icon: "⛈️" },
  99: { condition: "雷暴", icon: "⛈️" },
};

function getWindLevel(speed: number): string {
  if (speed < 12) return "微风";
  if (speed < 39) return "和风";
  if (speed < 62) return "大风";
  return "狂风";
}

function getPrecipitationType(code: number): "none" | "rain" | "snow" | "sleet" {
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "rain";
  return "none";
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  days: number
): Promise<WeatherResult> {
  try {
    const url = new URL(WEATHER_API_BASE);
    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,windspeed_10m_max,weathercode");
    url.searchParams.set("timezone", "Asia/Shanghai");
    url.searchParams.set("forecast_days", Math.min(days, 14).toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const { daily } = data;

    const forecasts: DayForecast[] = daily.time.map((date: string, index: number) => {
      const weatherCode = daily.weathercode[index];
      const weatherInfo = weatherCodeMap[weatherCode] || { condition: "未知", icon: "❓" };

      return {
        date,
        tempHigh: Math.round(daily.temperature_2m_max[index]),
        tempLow: Math.round(daily.temperature_2m_min[index]),
        precipitation: daily.precipitation_probability_max[index],
        precipitationType: getPrecipitationType(weatherCode),
        windSpeed: Math.round(daily.windspeed_10m_max[index]),
        windLevel: getWindLevel(daily.windspeed_10m_max[index]),
        condition: weatherInfo.condition,
        icon: weatherInfo.icon,
      };
    });

    return { success: true, data: forecasts };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return {
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "无法获取天气数据",
        fallbackUsed: false,
      },
    };
  }
}
```

- [ ] **Step 2: 创建天气模拟数据**

```typescript
// src/data/weather.ts
import { DayForecast } from "@/types/weather";

export function getFallbackWeather(province: string, days: number): DayForecast[] {
  const baseWeather: Record<string, { tempHigh: number; tempLow: number; condition: string; icon: string }> = {
    江西: { tempHigh: 25, tempLow: 15, condition: "多云", icon: "⛅" },
    西藏: { tempHigh: 15, tempLow: 0, condition: "晴", icon: "☀️" },
    四川: { tempHigh: 20, tempLow: 10, condition: "多云", icon: "⛅" },
    云南: { tempHigh: 22, tempLow: 12, condition: "晴", icon: "☀️" },
    陕西: { tempHigh: 18, tempLow: 8, condition: "多云", icon: "⛅" },
    香港: { tempHigh: 28, tempLow: 22, condition: "晴", icon: "☀️" },
    安徽: { tempHigh: 22, tempLow: 12, condition: "多云", icon: "⛅" },
    湖南: { tempHigh: 24, tempLow: 14, condition: "多云", icon: "⛅" },
    山东: { tempHigh: 20, tempLow: 10, condition: "晴", icon: "☀️" },
  };

  const base = baseWeather[province] || { tempHigh: 20, tempLow: 10, condition: "多云", icon: "⛅" };

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      date: date.toISOString().split("T")[0],
      tempHigh: base.tempHigh + Math.floor(Math.random() * 5) - 2,
      tempLow: base.tempLow + Math.floor(Math.random() * 5) - 2,
      precipitation: Math.floor(Math.random() * 30),
      precipitationType: "none" as const,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windLevel: "微风",
      condition: base.condition,
      icon: base.icon,
    };
  });
}
```

- [ ] **Step 3: 提交天气服务**

```bash
git add src/lib/weather.ts src/data/weather.ts
git commit -m "feat: implement weather service with Open-Meteo API"
```

---

## Task 7: 实现装备推荐引擎

**Files:**
- Create: `src/lib/recommend.ts`
- Create: `src/data/gear-rules.ts`

- [ ] **Step 1: 创建装备规则数据**

```typescript
// src/data/gear-rules.ts
import { ProductCategory, Priority } from "@/types/product";

interface GearRule {
  category: ProductCategory;
  categoryName: string;
  categoryIcon: string;
  conditions: {
    field: string;
    operator: "gt" | "lt" | "eq" | "contains";
    value: any;
  }[];
  recommended: boolean;
  priority: Priority;
  reasonTemplate: string;
  productFilter?: (product: any) => boolean;
}

export const gearRules: GearRule[] = [
  // 鞋类规则
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [{ field: "duration", operator: "contains", value: "天" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "{duration}行程+{difficulty}难度，需要防水徒步鞋",
  },
  {
    category: "footwear",
    categoryName: "鞋类",
    categoryIcon: "🥾",
    conditions: [
      { field: "duration", operator: "eq", value: "1天" },
      { field: "distance", operator: "lt", value: 25 },
    ],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "单日{distance}km线路，轻量鞋即可",
  },
  // 保暖层规则
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "altitude", operator: "gt", value: 3500 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "海拔{altitude}m，需要高海拔保暖装备",
  },
  {
    category: "mid-layer",
    categoryName: "保暖层",
    categoryIcon: "🧥",
    conditions: [{ field: "tempLow", operator: "lt", value: 10 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "夜间温度约{tempLow}°C，需要保暖层",
  },
  // 雨具规则
  {
    category: "rain-gear",
    categoryName: "雨具",
    categoryIcon: "🌧️",
    conditions: [{ field: "precipitation", operator: "gt", value: 60 }],
    recommended: true,
    priority: "required",
    reasonTemplate: "降水概率{precipitation}%，必须携带雨衣",
  },
  // 防晒规则
  {
    category: "sun-protection",
    categoryName: "防晒",
    categoryIcon: "☀️",
    conditions: [{ field: "tempHigh", operator: "gt", value: 30 }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "高温{tempHigh}°C，需要防晒装备",
  },
  // 背包规则
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "重装露营需要大容量背包",
  },
  {
    category: "backpack",
    categoryName: "背包",
    categoryIcon: "🎒",
    conditions: [{ field: "style", operator: "eq", value: "轻装速穿" }],
    recommended: true,
    priority: "recommended",
    reasonTemplate: "轻装速穿适合中小容量背包",
  },
  // 睡眠装备规则
  {
    category: "sleeping",
    categoryName: "睡眠",
    categoryIcon: "🛏️",
    conditions: [{ field: "style", operator: "eq", value: "重装露营" }],
    recommended: true,
    priority: "required",
    reasonTemplate: "露营需要帐篷和睡袋",
  },
];
```

- [ ] **Step 2: 创建推荐引擎**

```typescript
// src/lib/recommend.ts
import { Product, Recommendation, ReasonTag, GearRecommendation, ProductCategory } from "@/types/product";
import { DayForecast } from "@/types/weather";
import { Route, RouteStyleData } from "@/types/route";
import { products, productCategories } from "@/data/products";
import { gearRules } from "@/data/gear-rules";

interface RecommendationContext {
  route: Route;
  style: RouteStyleData;
  forecasts: DayForecast[];
  date: string;
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

function parseDistance(distance: string): number {
  const match = distance.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function parseAltitude(altitude: string): number {
  const match = altitude.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function getMinTemp(forecasts: DayForecast[]): number {
  return Math.min(...forecasts.map((f) => f.tempLow));
}

function getMaxTemp(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.tempHigh));
}

function getMaxPrecipitation(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.precipitation));
}

function hasSnow(forecasts: DayForecast[]): boolean {
  return forecasts.some((f) => f.precipitationType === "snow");
}

function getMaxWindSpeed(forecasts: DayForecast[]): number {
  return Math.max(...forecasts.map((f) => f.windSpeed));
}

function generateReasonTags(context: RecommendationContext, rule: any): ReasonTag[] {
  const tags: ReasonTag[] = [];
  const { style, forecasts } = context;

  // 走法标签
  tags.push({ text: style.name, type: "style" });

  // 线路标签
  const duration = parseDuration(style.duration);
  const distance = parseDistance(style.distance);
  if (duration >= 2) tags.push({ text: `${duration}天行程`, type: "route" });
  if (distance >= 20) tags.push({ text: `${distance}km`, type: "route" });

  // 天气标签
  const maxPrecip = getMaxPrecipitation(forecasts);
  if (maxPrecip > 60) tags.push({ text: `降水${maxPrecip}%`, type: "weather" });

  const minTemp = getMinTemp(forecasts);
  if (minTemp < 0) tags.push({ text: `低温${minTemp}°C`, type: "weather" });

  const maxTemp = getMaxTemp(forecasts);
  if (maxTemp > 30) tags.push({ text: `高温${maxTemp}°C`, type: "weather" });

  return tags;
}

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
    .replace("{style}", style.name);
}

export function generateRecommendations(context: RecommendationContext): GearRecommendation {
  const { route, style, forecasts, date } = context;
  const recommendations: Recommendation[] = [];
  const notRecommended: { category: string; reason: string }[] = [];
  const processedCategories = new Set<ProductCategory>();

  // 解析线路属性
  const duration = parseDuration(style.duration);
  const distance = parseDistance(style.distance);
  const altitude = parseAltitude(style.altitude);
  const minTemp = getMinTemp(forecasts);
  const maxTemp = getMaxTemp(forecasts);
  const maxPrecip = getMaxPrecipitation(forecasts);
  const hasSnowfall = hasSnow(forecasts);
  const maxWind = getMaxWindSpeed(forecasts);

  // 评估每条规则
  for (const rule of gearRules) {
    if (processedCategories.has(rule.category)) continue;

    let matches = true;

    for (const condition of rule.conditions) {
      let value: any;

      switch (condition.field) {
        case "duration":
          value = style.duration;
          break;
        case "distance":
          value = distance;
          break;
        case "altitude":
          value = altitude;
          break;
        case "difficulty":
          value = style.difficulty;
          break;
        case "tempLow":
          value = minTemp;
          break;
        case "tempHigh":
          value = maxTemp;
          break;
        case "precipitation":
          value = maxPrecip;
          break;
        case "style":
          value = style.name;
          break;
        default:
          value = null;
      }

      switch (condition.operator) {
        case "gt":
          if (!(value > condition.value)) matches = false;
          break;
        case "lt":
          if (!(value < condition.value)) matches = false;
          break;
        case "eq":
          if (value !== condition.value) matches = false;
          break;
        case "contains":
          if (!String(value).includes(condition.value)) matches = false;
          break;
      }

      if (!matches) break;
    }

    if (matches) {
      processedCategories.add(rule.category);

      const categoryProducts = products.filter((p) => p.category === rule.category);
      const primaryProduct = categoryProducts[0];
      const alternativeProducts = categoryProducts.slice(1, 3);

      const reasonTags = generateReasonTags(context, rule);
      const reason = fillReasonTemplate(rule.reasonTemplate, context);

      recommendations.push({
        category: rule.category,
        categoryName: rule.categoryName,
        categoryIcon: rule.categoryIcon,
        recommended: rule.recommended,
        product: primaryProduct,
        alternativeProducts,
        reason,
        reasonTags,
        priority: rule.priority,
        carryingTips: primaryProduct?.maintenanceTips,
        maintenanceTips: primaryProduct?.maintenanceTips,
      });
    }
  }

  // 添加不推荐的品类
  for (const category of productCategories) {
    if (!processedCategories.has(category.id)) {
      notRecommended.push({
        category: category.name,
        reason: getNotRecommendedReason(category.id, context),
      });
    }
  }

  // 计算总重量
  const totalWeight = recommendations.reduce((sum, rec) => {
    if (rec.product) {
      const specs = rec.product.specs as any;
      return sum + (specs.weight || 0);
    }
    return sum;
  }, 0);

  return {
    routeId: route.id,
    style: style.name,
    date,
    recommendations,
    notRecommended,
    totalWeight,
    weatherForecast: forecasts,
  };
}

function getNotRecommendedReason(category: ProductCategory, context: RecommendationContext): string {
  const { style } = context;

  const reasons: Record<ProductCategory, Record<string, string>> = {
    footwear: {
      越野跑: "越野跑不需要重装徒步鞋",
    },
    "base-layer": {},
    "mid-layer": {},
    "outer-layer": {},
    "rain-gear": {},
    "sun-protection": {},
    backpack: {
      越野跑: "越野跑使用水袋背心即可",
    },
    sleeping: {
      轻装速穿: "轻装速穿不需要露营装备",
      越野跑: "越野跑不需要露营装备",
    },
    cooking: {
      轻装速穿: "轻装速穿不需要炊具",
      越野跑: "越野跑不需要炊具",
    },
    navigation: {},
    safety: {},
  };

  return reasons[category]?.[style.name] || "当前线路不需要此类装备";
}
```

- [ ] **Step 3: 提交推荐引擎**

```bash
git add src/lib/recommend.ts src/data/gear-rules.ts
git commit -m "feat: implement gear recommendation engine"
```

---

## Task 8: 创建装备推荐 UI 组件

**Files:**
- Create: `src/components/gear/WeatherForecast.tsx`
- Create: `src/components/gear/CategoryCard.tsx`
- Create: `src/components/gear/ProductCard.tsx`
- Create: `src/components/gear/NotRecommended.tsx`
- Create: `src/components/gear/GearPlanner.tsx`

- [ ] **Step 1: 创建 WeatherForecast 组件**

```typescript
// src/components/gear/WeatherForecast.tsx
import { DayForecast } from "@/types/weather";

interface WeatherForecastProps {
  forecasts: DayForecast[];
}

export default function WeatherForecast({ forecasts }: WeatherForecastProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">行程天气</h4>
      <div className="space-y-2">
        {forecasts.map((forecast) => {
          const isWarning = forecast.precipitation > 60 || forecast.precipitationType === "snow";

          return (
            <div
              key={forecast.date}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                isWarning ? "bg-red-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">
                  {new Date(forecast.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}
                </span>
                <span className="text-lg">{forecast.icon}</span>
                <span className="text-sm text-gray-700">{forecast.condition}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  <span className="font-medium">{forecast.tempHigh}°</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-500">{forecast.tempLow}°</span>
                </span>
                <span className={`text-sm ${forecast.precipitation > 60 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                  降水{forecast.precipitation}%
                </span>
                {isWarning && <span className="text-red-500">⚠️</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 ProductCard 组件**

```typescript
// src/components/gear/ProductCard.tsx
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const specs = product.specs as any;

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="w-15 h-15 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">
          {product.brand} {product.name}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {specs.waterproof && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
              {specs.waterproofRating || "防水"}
            </span>
          )}
          {specs.ankleSupport && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {specs.ankleSupport === "high" ? "高帮" : specs.ankleSupport === "mid" ? "中帮" : "低帮"}
            </span>
          )}
          {specs.weight && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {specs.weight}g
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.maintenanceTips?.[0] || product.scenarios.join(" · ")}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 CategoryCard 组件**

```typescript
// src/components/gear/CategoryCard.tsx
"use client";

import { useState } from "react";
import { Recommendation } from "@/types/product";
import Badge from "@/components/ui/Badge";
import ProductCard from "./ProductCard";

interface CategoryCardProps {
  recommendation: Recommendation;
}

export default function CategoryCard({ recommendation }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{recommendation.categoryIcon}</span>
            <span className="font-semibold text-gray-900">{recommendation.categoryName}</span>
          </div>
          <Badge variant="priority" priority={recommendation.priority} />
        </div>

        <div className="mb-2">
          <p className="text-sm text-primary-500 font-medium">
            推荐：{recommendation.product?.name || recommendation.categoryName}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {recommendation.reasonTags.map((tag, index) => {
            const colors = {
              weather: "bg-tag-weather-bg text-tag-weather",
              terrain: "bg-tag-terrain-bg text-tag-terrain",
              route: "bg-tag-route-bg text-tag-route",
              style: "bg-tag-style-bg text-tag-style",
            };

            return (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[tag.type]}`}
              >
                {tag.text}
              </span>
            );
          })}
        </div>

        <p className="text-sm text-gray-500">{recommendation.reason}</p>

        {recommendation.carryingTips && recommendation.carryingTips.length > 0 && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <span className="font-medium">携带提示：</span>
            {recommendation.carryingTips[0]}
          </div>
        )}
      </div>

      {recommendation.alternativeProducts && recommendation.alternativeProducts.length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm text-primary-500 hover:bg-primary-100 transition-colors border-t border-gray-200"
          >
            {isExpanded ? "收起" : "查看推荐产品 ▼"}
          </button>

          {isExpanded && (
            <div className="p-4 border-t border-gray-200 space-y-2">
              {recommendation.product && <ProductCard product={recommendation.product} />}
              {recommendation.alternativeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 创建 NotRecommended 组件**

```typescript
// src/components/gear/NotRecommended.tsx
interface NotRecommendedProps {
  items: { category: string; reason: string }[];
}

export default function NotRecommended({ items }: NotRecommendedProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-900 mb-3">不推荐</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">
              <span className="text-gray-700">{item.category}</span>
              {" — "}
              {item.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 创建 GearPlanner 组件**

```typescript
// src/components/gear/GearPlanner.tsx
"use client";

import { useState } from "react";
import { Route, RouteStyleData } from "@/types/route";
import { GearRecommendation } from "@/types/product";
import { DayForecast } from "@/types/weather";
import { generateRecommendations } from "@/lib/recommend";
import { fetchWeatherForecast } from "@/lib/weather";
import { getFallbackWeather } from "@/data/weather";
import WeatherForecast from "./WeatherForecast";
import CategoryCard from "./CategoryCard";
import NotRecommended from "./NotRecommended";
import Button from "@/components/ui/Button";

interface GearPlannerProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function GearPlanner({ route, selectedStyle }: GearPlannerProps) {
  const [date, setDate] = useState("");
  const [recommendation, setRecommendation] = useState<GearRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!date) {
      setError("请选择出发日期");
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("请选择未来日期");
      return;
    }

    const daysDiff = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 14) {
      setError("仅支持未来14天的天气推荐，超出部分使用典型天气");
    }

    setIsLoading(true);
    setError(null);

    try {
      let forecasts: DayForecast[];

      const duration = parseInt(selectedStyle.duration) || 1;
      const coords = route.coordinates;

      if (coords && daysDiff <= 14) {
        const result = await fetchWeatherForecast(coords.lat, coords.lng, duration);
        if (result.success) {
          forecasts = result.data;
        } else {
          forecasts = getFallbackWeather(route.province, duration);
        }
      } else {
        forecasts = getFallbackWeather(route.province, duration);
      }

      const rec = generateRecommendations({
        route,
        style: selectedStyle,
        forecasts,
        date,
      });

      setRecommendation(rec);
    } catch (err) {
      setError("生成推荐时出错，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-gray rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">装备推荐</h3>

      {!recommendation ? (
        <div>
          <p className="text-gray-500 text-sm mb-4">
            选择出发日期后，系统将根据线路条件和天气预报为您生成个性化装备清单。
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                出发日期
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? "生成中..." : "生成清单"}
              </Button>
            </div>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">
                {recommendation.style} · {recommendation.date}
              </p>
              <p className="text-sm text-gray-500">
                预估负重：{(recommendation.totalWeight / 1000).toFixed(1)}kg
              </p>
            </div>
            <button
              onClick={() => setRecommendation(null)}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              重新选择
            </button>
          </div>

          {recommendation.weatherForecast && (
            <WeatherForecast forecasts={recommendation.weatherForecast} />
          )}

          <div className="space-y-3 mb-6">
            {recommendation.recommendations.map((rec, index) => (
              <CategoryCard key={index} recommendation={rec} />
            ))}
          </div>

          <NotRecommended items={recommendation.notRecommended} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: 提交装备推荐组件**

```bash
git add src/components/gear/
git commit -m "feat: create gear recommendation UI components"
```

---

## Task 9: 集成装备推荐到详情页

**Files:**
- Modify: `src/app/route/[routeId]/page.tsx`

- [ ] **Step 1: 更新详情页集成 GearPlanner**

```typescript
// src/app/route/[routeId]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { getRouteById, routes } from "@/data/routes";
import Header from "@/components/layout/Header";
import TrailHero from "@/components/trail/TrailHero";
import TrailInfo from "@/components/trail/TrailInfo";
import GearPlanner from "@/components/gear/GearPlanner";

interface RoutePageProps {
  params: Promise<{
    routeId: string;
  }>;
}

export async function generateStaticParams() {
  return routes.map((route) => ({
    routeId: route.id,
  }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = getRouteById(routeId);
  if (!route) {
    return { title: "线路未找到 - 径迹" };
  }
  return {
    title: `${route.name} - 径迹`,
    description: route.styles[0]?.description || "",
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;
  const route = getRouteById(routeId);

  if (!route) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">未找到该线路</h1>
          <Link href="/" className="text-primary-500 hover:text-primary-600 font-medium">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const defaultStyle = route.styles[0];

  return (
    <div className="min-h-screen bg-white">
      <Header showBack />
      <TrailHero image={route.image} alt={route.name} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrailInfo route={route} selectedStyle={defaultStyle} />
          </div>

          <div className="lg:col-span-1">
            <GearPlanner route={route} selectedStyle={defaultStyle} />
          </div>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 提交集成**

```bash
git add src/app/route/[routeId]/page.tsx
git commit -m "feat: integrate gear planner into trail detail page"
```

---

## Task 10: 测试和优化

**Files:**
- Test all pages and components

- [ ] **Step 1: 启动开发服务器**

Run: `cd outdoor-trails && npm run dev`
Expected: 项目正常启动，无错误

- [ ] **Step 2: 测试首页**

1. 访问 http://localhost:3000
2. 验证背景轮播正常工作
3. 验证搜索功能正常
4. 点击搜索结果跳转到详情页

- [ ] **Step 3: 测试详情页**

1. 访问 http://localhost:3000/route/wugong
2. 验证 Hero 图片显示正常
3. 验证走法切换器工作正常
4. 验证核心数据横条显示正确

- [ ] **Step 4: 测试装备推荐**

1. 选择出发日期
2. 点击"生成清单"
3. 验证天气预报显示正常
4. 验证推荐装备列表正确
5. 验证展开/收起功能正常
6. 验证不推荐列表显示正确

- [ ] **Step 5: 运行构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 6: 提交最终版本**

```bash
git add .
git commit -m "feat: complete MVP implementation"
```

---

## 完成

实施计划完成。两个执行选项：

**1. Subagent-Driven (推荐)** - 每个任务分发新的子代理，任务间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中执行任务，批量执行并设置检查点

选择哪种方式？
