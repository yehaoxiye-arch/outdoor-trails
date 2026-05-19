# 径迹（Jingji）项目规范

## 项目简介
户外徒步装备推荐网站，根据线路特征 + 实时天气预报生成装备推荐。

## 技术栈
- Next.js 16 App Router + Turbopack
- React 19 + TypeScript
- Tailwind CSS 4
- ExcelJS（数据导入）

## 核心文件结构
```
src/
├── types/
│   ├── product.ts      # 装备类型定义（Product, ProductCategory, 各品类Specs）
│   └── route.ts        # 线路类型定义
├── data/
│   ├── products.ts     # 装备数据库（17品类，裤类已合并到服饰品类）
│   ├── routes.ts       # 线路数据库
│   └── gear-rules.ts   # 推荐规则引擎
├── lib/
│   └── recommend.ts    # 推荐算法核心
└── components/
    ├── gear/           # 装备推荐组件
    ├── trail/          # 线路详情组件
    └── layout/         # 布局组件
```

## 代码规范

### 类型安全
- 所有产品必须使用 `Product` 类型
- 产品规格必须使用对应的 `*Specs` 接口（如 `FootwearSpecs`, `ClothingSpecs`）
- 裤类产品使用 `ClothingSpecs`，通过 `garmentType: "bottom"` 标识
- 禁止使用 `any` 类型，除非有充分理由并添加注释
- 产品 ID 必须使用 kebab-case 格式：`品牌-产品名`（如 `salomon-x-ultra-4-gtx`）

### 产品数据规范
- 产品数组必须使用 `Product[]` 类型声明
- 禁止在数组中产生稀疏元素（多余的逗号）
- 每个产品必须包含：id, name, brand, category, image, specs, scenarios
- 产品 ID 必须唯一，不能重复
- 产品图片 URL 必须是有效的 HTTPS 链接或空字符串

### 推荐规则规范
- 规则文件：`src/data/gear-rules.ts`
- 推荐算法：`src/lib/recommend.ts`
- 修改推荐逻辑时必须同步更新两个文件
- 优先级体系：critical > required > recommended > optional
- 替代品选择必须使用 `filterProductsForCategory` 函数统一筛选

### 品类覆盖
当前支持 17 个品类：
```
footwear, base-layer, mid-layer, outer-layer, rain-gear, 
sun-protection, backpack, tent, sleeping, trekking-poles, 
cooking, navigation, safety, snow-gear, lighting, emergency, hydration
```

裤类产品已合并到服饰品类（base-layer / mid-layer / outer-layer），通过 `garmentType: "bottom"` 区分。

## 开发流程

### 修改产品数据
1. 编辑 `src/data/products.ts`
2. 运行 `npx tsc --noEmit` 验证类型
3. 运行 `npm run dev` 验证编译
4. 提交时使用规范的 commit message

### 修改推荐规则
1. 同步更新 `gear-rules.ts` 和 `recommend.ts`
2. 测试多个场景（单日/多日、轻装/重装、不同难度）
3. 验证替代品选择逻辑
4. 检查优先级是否正确

### Git 提交规范
- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `refactor:` 重构
- `data:` 数据更新（产品/线路）
- `rule:` 推荐规则更新

## 常见问题

### TypeScript 编译错误
- 检查是否有稀疏数组元素（多余的逗号）
- 检查产品 ID 是否重复
- 检查 Specs 类型是否匹配

### 推荐结果异常
- 检查 `selectBestProduct` 函数的品类 case
- 检查 `filterProductsForCategory` 函数的筛选逻辑
- 检查 `gear-rules.ts` 中的条件是否正确

### 产品数据问题
- 使用 `grep -n "id: 'xxx'" src/data/products.ts` 查找产品
- 使用 `node -e "..."` 脚本批量检查数据
- 图片链接必须是 HTTPS 协议

## 测试场景

### 场景 1：单日简单线路
- 预期：轻量鞋、速干衣、小背包
- 不推荐：帐篷、睡袋、炊具

### 场景 2：多日重装露营
- 预期：防水徒步鞋、冲锋衣、大背包、帐篷、睡袋
- 所有品类都应该有推荐

### 场景 3：高海拔线路
- 预期：高帮鞋、保暖层、防晒、应急装备
- 优先级应该升级

### 场景 4：越野跑
- 预期：越野跑鞋、水袋背心
- 不推荐：帐篷、炊具、重装装备

## 数据导入

### Excel 导入流程
1. 使用 `scripts/` 目录下的导入脚本
2. 导入前检查产品 ID 是否重复
3. 导入后验证 TypeScript 编译
4. 检查产品数量是否正确

### 图片补充
1. 导出无图片产品清单到 Excel
2. 填写图片链接后导入
3. 验证图片 URL 格式

## 性能优化
- 产品数据按品类分组，减少运行时筛选
- 推荐结果按优先级排序
- 使用 `Set` 进行去重操作

## 安全注意
- 图片 URL 必须是 HTTPS
- 用户输入需要验证
- API 调用需要错误处理
