# OutdoorsMagic 榜单卡片实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页替换介绍栏，放置三个 OutdoorsMagic 榜单卡片（背包、登山靴、防水夹克），点击弹出产品模态框，展示获奖头衔和 tester's verdict，所有内容中文翻译。

**Architecture:** 使用静态 JSON 数据（已通过脚本从 outdoorsmagic.com 抓取并处理），创建 RankingCard 卡片组件和 RankingModal 模态框组件，集成到首页。数据在构建时静态导入，无需运行时 API 调用。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4

---

## 文件结构

```
src/
├── data/
│   └── outdoormagic-rankings.json     # 已有：榜单数据（已抓取、清洗、翻译）
├── components/
│   └── home/
│       ├── RankingCard.tsx            # 新建：首页榜单卡片
│       ├── RankingModal.tsx           # 新建：榜单产品弹窗
│       └── ProductItem.tsx            # 新建：弹窗内单个产品项
└── app/
    └── page.tsx                       # 修改：替换介绍栏为榜单卡片
```

---

### Task 1: 翻译 Verdict 文本

**背景：** 当前 `outdoormagic-rankings.json` 中非获奖产品的 verdict 仍为英文。需要翻译成中文。

**Files:**
- Modify: `scripts/process-rankings.js`
- Modify: `src/data/outdoormagic-rankings.json`

- [ ] **Step 1: 在 process-rankings.js 中添加 verdict 翻译映射**

在 `process-rankings.js` 的 `translateModel` 函数之后，添加 verdict 翻译函数和映射表：

```javascript
// Verdict 翻译映射（英文 -> 中文）
const VERDICT_TRANSLATIONS = {
  // 背包
  "I like how tough this backpack is. While there's not much in the way of recycled content, the material itself feels robust and has held up well on the trail. The back panel is pretty breathable too and uses a suspended mesh fabric with a reinforced frame.":
    "我喜欢这款背包的耐用性。虽然可回收材料不多，但面料本身非常结实，在小路上表现出色。背板也很透气，使用了悬浮网布和加固框架。",
  "It's comfortable, convenient, it feels aerodynamic and it also feels well made and durable too – it's the kind of pack that you could use on a daily basis.":
    "它舒适、方便，感觉符合空气动力学，做工精良且耐用——这是一款可以日常使用的背包。",
  "The Delling 20L is a well-made backpack built with high quality materials. It's performed very reliably on my recent UK hill walks and I've found it very comfortable too.":
    "Delling 20L是一款做工精良的背包，采用高品质材料。在我最近的英国山地徒步中表现非常可靠，也非常舒适。",
  "The Keb 52 is a well-made, robust backpack that's ideal for multi-day treks. It's comfortable, has a great feature set and is made from sustainable materials.":
    "Keb 52是一款做工精良、结实的背包，非常适合多日徒步。它舒适、功能丰富，且采用可持续材料制成。",
  "The Vaude Assymetric 52+8 is a versatile, well-made backpack that's ideal for multi-day treks. It's comfortable, has a great feature set and is made from sustainable materials.":
    "Vaude Assymetric 52+8是一款多功能、做工精良的背包，非常适合多日徒步。它舒适、功能丰富，且采用可持续材料制成。",
  // 登山靴
  "These are some of the most comfortable boots I've ever worn. I've found the fit to be very snug, in a good way. There's no heel lift and the lacing system keeps everything secure.":
    "这是我穿过的最舒适的靴子之一。贴合度非常好，没有脚跟滑动，鞋带系统让一切固定牢靠。",
  "The Montbell Alpine Cruiser 800 is a proper workhorse: a stable, supportive, nicely made leather alpine trekking boot that'll last for years.":
    "Montbell Alpine Cruiser 800是一匹真正的工作马：稳定、支撑性好、做工精良的皮质高山徒步靴，可以使用多年。",
  "Overall, I'd say the Hoka Kaha 2 is a well made and versatile three-season hiking boot that suits anything from short and easy hikes to more adventurous multi-day treks.":
    "总的来说，Hoka Kaha 2是一款做工精良、用途广泛的三季登山靴，适合从简短轻松的徒步到更具冒险性的多日徒步。",
  // 防水夹克
  "A functional jacket that serves as a good all-rounder – and at a reasonable price for a 3L shell.":
    "一款功能全面的夹克——以3层冲锋衣的合理价格提供了出色的综合性能。",
  "Stylish and functional with an excellent balance between weight and durability. An excellent option for three-season long-distance hiking.":
    "时尚且功能出色，重量和耐用性之间取得了极佳平衡。是三季长距离徒步的绝佳选择。",
  "The waterproofness and cut impressed me. The hood does let it down though as it's pretty basic and doesn't give create proper protection from the rain.":
    "防水性能和剪裁让我印象深刻。但兜帽设计比较基础，无法提供完善的防雨保护，这是一个遗憾。",
};

function translateVerdict(verdict) {
  if (!verdict) return '';
  // 尝试精确匹配
  for (const [en, zh] of Object.entries(VERDICT_TRANSLATIONS)) {
    if (verdict === en) return zh;
  }
  // 尝试前缀匹配（verdict可能被截断）
  for (const [en, zh] of Object.entries(VERDICT_TRANSLATIONS)) {
    if (verdict.length > 30 && en.startsWith(verdict.substring(0, 50))) return zh;
  }
  return verdict; // 无翻译则保留英文
}
```

- [ ] **Step 2: 在数据处理流程中调用 translateVerdict**

修改 `processedProducts` 的 map 逻辑，将 verdict 翻译：

```javascript
const processedProducts = data.products
  .filter(p => p.model && !p.model.includes('Outdoors Gear, Equipment'))
  .map(p => ({
    model: translateModel(cleanHtml(p.model)),
    image: p.image,
    awardTitle: p.awardTitle ? translateAward(p.awardTitle) : '',
    verdict: translateVerdict(cleanHtml(p.verdict)),
    isWinner: p.isWinner && !!p.awardTitle
  }));
```

- [ ] **Step 3: 运行脚本更新数据**

```bash
node scripts/fetch-outdoormagic.js && node scripts/process-rankings.js
```

- [ ] **Step 4: 验证翻译结果**

```bash
node -e "const d = require('./src/data/outdoormagic-rankings.json'); Object.values(d).forEach(c => c.products.filter(p => !p.isWinner).forEach(p => console.log(p.model.split('（')[0] + ': ' + (p.verdict || '(empty)').substring(0, 60))))"
```

---

### Task 2: 创建 ProductItem 组件

**Files:**
- Create: `src/components/home/ProductItem.tsx`

- [ ] **Step 1: 创建 ProductItem 组件**

```tsx
import Image from "next/image";

interface ProductItemProps {
  model: string;
  image: string;
  awardTitle?: string;
  verdict?: string;
  isWinner: boolean;
}

export default function ProductItem({
  model,
  image,
  awardTitle,
  verdict,
  isWinner,
}: ProductItemProps) {
  // 提取英文名和中文名
  const match = model.match(/^(.+?)（(.+?)）$/);
  const englishName = match ? match[1] : model;
  const chineseName = match ? match[2] : "";

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      {/* 产品图片 */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
        {image ? (
          <Image
            src={image}
            alt={englishName}
            fill
            className="object-contain"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* 产品信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
          {englishName}
        </h4>
        {chineseName && (
          <p className="text-xs text-gray-500 mt-0.5">{chineseName}</p>
        )}

        {isWinner && awardTitle ? (
          <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            {awardTitle}
          </span>
        ) : verdict ? (
          <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
            &ldquo;{verdict}&rdquo;
          </p>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/home/ProductItem.tsx
```

---

### Task 3: 创建 RankingModal 组件

**Files:**
- Create: `src/components/home/RankingModal.tsx`

- [ ] **Step 1: 创建 RankingModal 组件**

```tsx
"use client";

import { useEffect } from "react";
import ProductItem from "./ProductItem";

interface Product {
  model: string;
  image: string;
  awardTitle: string;
  verdict: string;
  isWinner: boolean;
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  products: Product[];
  source: string;
}

export default function RankingModal({
  isOpen,
  onClose,
  title,
  icon,
  products,
  source,
}: RankingModalProps) {
  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 分离获奖产品和非获奖产品
  const winners = products.filter((p) => p.isWinner);
  const others = products.filter((p) => !p.isWinner);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-400">
                数据来源：{source}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* 获奖产品 */}
          {winners.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                获奖产品
              </h3>
              <div className="space-y-3">
                {winners.map((product, i) => (
                  <ProductItem key={i} {...product} />
                ))}
              </div>
            </div>
          )}

          {/* 其他产品 */}
          {others.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                更多推荐
              </h3>
              <div className="space-y-3">
                {others.map((product, i) => (
                  <ProductItem key={i} {...product} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 text-center">
            榜单数据来自 outdoorsmagic.com · 仅供参考
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/home/RankingModal.tsx
```

---

### Task 4: 创建 RankingCard 组件

**Files:**
- Create: `src/components/home/RankingCard.tsx`

- [ ] **Step 1: 创建 RankingCard 组件**

```tsx
"use client";

import { useState } from "react";
import RankingModal from "./RankingModal";

interface Product {
  model: string;
  image: string;
  awardTitle: string;
  verdict: string;
  isWinner: boolean;
}

interface RankingCardProps {
  id: string;
  title: string;
  icon: string;
  products: Product[];
  source: string;
  url: string;
}

export default function RankingCard({
  id,
  title,
  icon,
  products,
  source,
  url,
}: RankingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const winners = products.filter((p) => p.isWinner);
  const winnerPreview = winners.slice(0, 3);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group text-left w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      >
        {/* 卡片头部 */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
          </div>

          {/* 获奖产品预览 */}
          <div className="space-y-2">
            {winnerPreview.map((product, i) => {
              const match = product.model.match(/^(.+?)（/);
              const name = match ? match[1] : product.model;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {name}
                  </span>
                  {product.awardTitle && (
                    <span className="flex-shrink-0 text-[10px] text-primary-600 font-medium">
                      {product.awardTitle}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 卡片底部 */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            共 {products.length} 款产品
          </span>
          <span className="text-xs text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
            查看全部 &rarr;
          </span>
        </div>
      </button>

      <RankingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        icon={icon}
        products={products}
        source={source}
      />
    </>
  );
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/home/RankingCard.tsx
```

---

### Task 5: 修改首页集成榜单卡片

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 替换首页介绍栏为榜单卡片**

将 `src/app/page.tsx` 修改为：

```tsx
import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";
import RankingCard from "@/components/home/RankingCard";
import rankingsData from "@/data/outdoormagic-rankings.json";

export default function HomePage() {
  const rankings = Object.values(rankingsData);

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Hero: image background + title overlay */}
      <section className="relative h-[45vh]">
        <HeroCarousel />

        {/* Title at bottom of hero */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
            径迹
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light tracking-widest drop-shadow-md">
            智能装备推荐 · 让每一次出发都从容
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-16 flex flex-col" style={{ minHeight: "calc(55vh - 48px)" }}>
        {/* Search */}
        <section className="text-center mb-auto pt-4">
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </section>

        {/* Rankings */}
        <section className="pt-16">
          <h2 className="text-center text-sm font-semibold text-gray-400 tracking-widest mb-8">
            专业装备榜单
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {rankings.map((ranking) => (
              <RankingCard
                key={ranking.id}
                id={ranking.id}
                title={ranking.title}
                icon={ranking.icon}
                products={ranking.products}
                source={ranking.source}
                url={ranking.url}
              />
            ))}
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-6">
            榜单数据来源：<a href="https://outdoorsmagic.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">outdoorsmagic.com</a>
          </p>
        </section>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 确保 JSON 数据可被静态导入**

检查 `tsconfig.json` 中是否启用了 `resolveJsonModule`：

```bash
node -e "const ts = require('./tsconfig.json'); console.log('resolveJsonModule:', ts.compilerOptions?.resolveJsonModule)"
```

如果未启用，在 `tsconfig.json` 的 `compilerOptions` 中添加 `"resolveJsonModule": true`。

- [ ] **Step 3: 启动开发服务器验证**

```bash
npm run dev
```

在浏览器中访问首页，验证：
1. 三个榜单卡片正确显示
2. 点击卡片弹出模态框
3. 模态框中获奖产品显示奖项头衔
4. 模态框中非获奖产品显示 verdict
5. ESC 键和点击背景可关闭模态框
6. 移动端响应式布局正常

- [ ] **Step 4: TypeScript 编译检查**

```bash
npx tsc --noEmit
```

---

### Task 6: 图片优化与错误处理

**Files:**
- Modify: `src/components/home/ProductItem.tsx`

- [ ] **Step 1: 添加图片加载错误处理**

更新 `ProductItem.tsx` 中的图片部分，添加 `onError` 回调和 unoptimized 属性（外部图片域名未配置）：

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductItemProps {
  model: string;
  image: string;
  awardTitle?: string;
  verdict?: string;
  isWinner: boolean;
}

export default function ProductItem({
  model,
  image,
  awardTitle,
  verdict,
  isWinner,
}: ProductItemProps) {
  const [imgError, setImgError] = useState(false);

  const match = model.match(/^(.+?)（(.+?)）$/);
  const englishName = match ? match[1] : model;
  const chineseName = match ? match[2] : "";

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
        {image && !imgError ? (
          <Image
            src={image}
            alt={englishName}
            fill
            className="object-contain"
            sizes="80px"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
          {englishName}
        </h4>
        {chineseName && (
          <p className="text-xs text-gray-500 mt-0.5">{chineseName}</p>
        )}

        {isWinner && awardTitle ? (
          <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            {awardTitle}
          </span>
        ) : verdict ? (
          <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
            &ldquo;{verdict}&rdquo;
          </p>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 配置 Next.js 允许外部图片域名**

在 `next.config.ts` 中添加 outdoorsmagic.com 的图片域名：

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outdoorsmagic.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
```

- [ ] **Step 3: 验证图片加载**

```bash
npm run dev
```

在浏览器中打开模态框，确认产品图片正常加载。

---

## 完成检查清单

- [ ] 三个榜单卡片在首页正确显示
- [ ] 点击卡片弹出模态框
- [ ] 获奖产品显示中文奖项头衔
- [ ] 非获奖产品显示中文 verdict
- [ ] 产品型号显示英文名+中文名
- [ ] 产品图片正常加载
- [ ] 模态框可 ESC / 点击背景关闭
- [ ] 移动端响应式布局正常
- [ ] TypeScript 编译无错误
- [ ] 数据来源标注为 outdoorsmagic.com
