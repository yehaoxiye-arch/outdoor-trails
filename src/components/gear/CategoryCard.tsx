"use client";

import { useState } from "react";
import { Recommendation, Product } from "@/types/product";
import Badge from "@/components/ui/Badge";
import ProductCard from "./ProductCard";
import { getBrandOrder } from "@/data/brand-priority";

interface CategoryCardProps {
  recommendation: Recommendation;
  routeContext?: {
    altitude: number;
    durationDays: number;
    distanceKm: number;
    minTemp: number;
    maxPrecipitation: number;
  };
}

const DEFAULT_VISIBLE_BRANDS = 5;

// 直接展示所有产品的品类（跳过品牌分组）
const DIRECT_SHOW_CATEGORIES = new Set(["emergency"]);

// 品牌Logo映射（可扩展）
const brandLogos: Record<string, string> = {
  "Salomon": "/images/brands/salomon.png",
  "Merrell": "/images/brands/merrell.png",
  "HOKA": "/images/brands/hoka.png",
  "Arc'teryx": "/images/brands/arcteryx.png",
  "Patagonia": "/images/brands/patagonia.png",
  "The North Face": "/images/brands/tnf.png",
  "Osprey": "/images/brands/osprey.png",
  "Gregory": "/images/brands/gregory.png",
  "MSR": "/images/brands/msr.png",
  "Big Agnes": "/images/brands/bigagnes.png",
  "Naturehike": "/images/brands/naturehike.png",
  "Western Mountaineering": "/images/brands/wm.png",
  "Marmot": "/images/brands/marmot.png",
  "Therm-a-Rest": "/images/brands/thermarest.png",
  "Black Diamond": "/images/brands/bd.png",
  "Leki": "/images/brands/leki.png",
  "Petzl": "/images/brands/petzl.png",
  "Garmin": "/images/brands/garmin.png",
  "Decathlon": "/images/brands/decathlon.png",
  "Columbia": "/images/brands/columbia.png",
  "Montbell": "/images/brands/montbell.png",
  "NEMO": "/images/brands/nemo.png",
  "Snow Peak": "/images/brands/snowpeak.png",
  "TOAKS": "/images/brands/toaks.png",
  "Platypus": "/images/brands/platypus.png",
  "Sawyer": "/images/brands/sawyer.png",
  "Jetboil": "/images/brands/jetboil.png",
  "SOTO": "/images/brands/soto.png",
  "Fjällräven": "/images/brands/fjallraven.png",
  "Prana": "/images/brands/prana.png",
  "2XU": "/images/brands/2xu.png",
  "KEEN": "/images/brands/keen.png",
  "Hilleberg": "/images/brands/hilleberg.png",
  "Granite Gear": "/images/brands/granitegear.png",
  "Julbo": "/images/brands/julbo.png",
  "Darn Tough": "/images/brands/darntough.png",
  "Sunday Afternoons": "/images/brands/sundayafternoons.png",
  "Outdoor Research": "/images/brands/or.png",
  "Buff": "/images/brands/buff.png",
};

// 获取品牌首字母作为Fallback
function getBrandInitial(brand: string): string {
  return brand.charAt(0).toUpperCase();
}

// 按品牌分组产品
function groupProductsByBrand(products: Product[]): Map<string, Product[]> {
  const brandMap = new Map<string, Product[]>();
  for (const product of products) {
    const brand = product.brand;
    if (!brandMap.has(brand)) {
      brandMap.set(brand, []);
    }
    brandMap.get(brand)!.push(product);
  }
  return brandMap;
}

// 品牌卡片组件（内部使用）
function BrandCard({
  brand,
  brandMap,
  selectedBrand,
  expandedBrands,
  onBrandClick,
  onToggleExpand,
}: {
  brand: string;
  brandMap: Map<string, Product[]>;
  selectedBrand: string | null;
  expandedBrands: Set<string>;
  onBrandClick: (brand: string) => void;
  onToggleExpand: (brand: string, e: React.MouseEvent) => void;
}) {
  const products = brandMap.get(brand) || [];
  const primaryProduct = products[0];
  const otherProducts = products.slice(1);
  const isSelected = selectedBrand === brand;
  const isBrandExpanded = expandedBrands.has(brand);

  return (
    <div
      className={`border rounded-lg transition-all ${
        isSelected ? "border-primary-300 bg-primary-50" : "border-gray-200 bg-white"
      }`}
    >
      {/* 品牌头部：点击展示主推产品 */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => onBrandClick(brand)}
      >
        {/* 品牌 Logo */}
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {brandLogos[brand] ? (
            <img src={brandLogos[brand]} alt={brand} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-500">{getBrandInitial(brand)}</span>
          )}
        </div>

        {/* 品牌名 + 产品数 */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900">{brand}</div>
          <div className="text-xs text-gray-500">{products.length}款产品</div>
        </div>

        {/* 展开/收起按钮（多产品时显示） */}
        {otherProducts.length > 0 && (
          <button
            onClick={(e) => onToggleExpand(brand, e)}
            className="text-xs text-primary-500 hover:text-primary-600 px-2 py-1"
          >
            {isBrandExpanded ? "收起" : `+${otherProducts.length}`}
          </button>
        )}
      </div>

      {/* 主推产品 */}
      {isSelected && primaryProduct && (
        <div className="px-3 pb-3">
          <ProductCard product={primaryProduct} />
        </div>
      )}

      {/* 其他产品（展开时显示） */}
      {isBrandExpanded && otherProducts.length > 0 && (
        <div className="px-3 pb-3 space-y-2">
          {otherProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryCard({ recommendation, routeContext }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [showAllBrands, setShowAllBrands] = useState(false);

  // 收集所有推荐产品（主要产品 + 替代产品）
  const allProducts = [
    ...(recommendation.product ? [recommendation.product] : []),
    ...(recommendation.alternativeProducts || []),
  ];

  // 按品牌分组
  const brandMap = groupProductsByBrand(allProducts);

  // 品牌排序（根据路线条件动态调整）
  let brands = Array.from(brandMap.keys());
  if (routeContext) {
    const priorityOrder = getBrandOrder(
      recommendation.category,
      routeContext.altitude,
      routeContext.durationDays,
      routeContext.distanceKm,
      routeContext.minTemp,
      routeContext.maxPrecipitation
    );
    if (priorityOrder) {
      const brandSet = new Set(brands);
      const sorted: string[] = [];
      for (const b of priorityOrder) {
        if (brandSet.has(b)) {
          sorted.push(b);
          brandSet.delete(b);
        }
      }
      // 追加未在优先级列表中的品牌
      for (const b of brandSet) {
        sorted.push(b);
      }
      brands = sorted;
    }
  }

  // 分割为可见品牌和剩余品牌
  const visibleBrands = brands.slice(0, DEFAULT_VISIBLE_BRANDS);
  const remainingBrands = brands.slice(DEFAULT_VISIBLE_BRANDS);

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(selectedBrand === brand ? null : brand);
  };

  const handleToggleBrandExpand = (brand: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedBrands);
    if (newExpanded.has(brand)) {
      newExpanded.delete(brand);
    } else {
      newExpanded.add(brand);
    }
    setExpandedBrands(newExpanded);
  };

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

      {allProducts.length > 0 && (
        <>
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded) setSelectedBrand(null);
            }}
            className="w-full py-2 text-sm text-primary-500 hover:bg-primary-100 active:bg-primary-200 transition-colors border-t border-gray-200"
          >
            {isExpanded ? "收起" : "查看推荐产品 ▼"}
          </button>

          {isExpanded && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              {/* 直接展示产品（应急等品类跳过品牌分组） */}
              {DIRECT_SHOW_CATEGORIES.has(recommendation.category) ? (
                <div className="space-y-2">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
              <>
              {/* 品牌卡片列表（默认展示前5个） */}
              {visibleBrands.map((brand) => (
                <BrandCard
                  key={brand}
                  brand={brand}
                  brandMap={brandMap}
                  selectedBrand={selectedBrand}
                  expandedBrands={expandedBrands}
                  onBrandClick={handleBrandClick}
                  onToggleExpand={handleToggleBrandExpand}
                />
              ))}

              {/* 查看更多品牌按钮 */}
              {remainingBrands.length > 0 && (
                <button
                  onClick={() => setShowAllBrands(true)}
                  className="w-full py-2.5 text-sm text-primary-500 hover:bg-primary-50 active:bg-primary-100 transition-colors rounded-alltrails border border-dashed border-primary-300"
                >
                  查看更多品牌（{remainingBrands.length}个）
                </button>
              )}

              {/* 弹窗：展示全部品牌 */}
              {showAllBrands && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setShowAllBrands(false)} />
                  <div className="relative bg-white w-full max-w-lg max-h-[80vh] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col">
                    {/* 弹窗头部 */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-text-primary">{recommendation.categoryIcon} {recommendation.categoryName} — 全部品牌</h3>
                      <button onClick={() => setShowAllBrands(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* 弹窗内容 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {brands.map((brand) => (
                        <BrandCard
                          key={brand}
                          brand={brand}
                          brandMap={brandMap}
                          selectedBrand={selectedBrand}
                          expandedBrands={expandedBrands}
                          onBrandClick={handleBrandClick}
                          onToggleExpand={handleToggleBrandExpand}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
