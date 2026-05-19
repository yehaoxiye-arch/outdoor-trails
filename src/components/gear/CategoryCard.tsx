"use client";

import { useState } from "react";
import { Recommendation, Product } from "@/types/product";
import Badge from "@/components/ui/Badge";
import ProductCard from "./ProductCard";

interface CategoryCardProps {
  recommendation: Recommendation;
}

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

export default function CategoryCard({ recommendation }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());

  // 收集所有推荐产品（主要产品 + 替代产品）
  const allProducts = [
    ...(recommendation.product ? [recommendation.product] : []),
    ...(recommendation.alternativeProducts || []),
  ];

  // 按品牌分组
  const brandMap = groupProductsByBrand(allProducts);
  const brands = Array.from(brandMap.keys());

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

  // 获取品牌的最推荐产品（第一个产品）
  const getPrimaryProduct = (brand: string): Product | undefined => {
    const products = brandMap.get(brand);
    return products?.[0];
  };

  // 获取品牌的其他产品
  const getOtherProducts = (brand: string): Product[] => {
    const products = brandMap.get(brand) || [];
    return products.slice(1);
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
            className="w-full py-2 text-sm text-primary-500 hover:bg-primary-100 transition-colors border-t border-gray-200"
          >
            {isExpanded ? "收起" : "查看推荐产品 ▼"}
          </button>

          {isExpanded && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              {/* 品牌卡片列表 */}
              {brands.map((brand) => {
                const brandProducts = brandMap.get(brand)!;
                const isSelected = selectedBrand === brand;
                const isBrandExpanded = expandedBrands.has(brand);
                const logoUrl = brandLogos[brand];
                const primaryProduct = getPrimaryProduct(brand);
                const otherProducts = getOtherProducts(brand);
                const hasOtherProducts = otherProducts.length > 0;

                return (
                  <div key={brand}>
                    {/* 品牌卡片 - 简约风格 */}
                    <div
                      onClick={() => handleBrandClick(brand)}
                      className={`p-3 md:p-4 rounded-alltrails cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary-100 border-2 border-primary-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* 品牌Logo或首字母 */}
                        <div className="w-10 h-10 flex items-center justify-center">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={brand}
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                // Logo加载失败时显示首字母
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${logoUrl ? "hidden" : ""}`}
                          >
                            <span className="text-lg font-bold text-gray-600">
                              {getBrandInitial(brand)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-text-primary">{brand}</span>
                        </div>
                      </div>
                    </div>

                    {/* 品牌最推荐产品 */}
                    {isSelected && primaryProduct && (
                      <div className="mt-2 pl-4">
                        <ProductCard product={primaryProduct} />

                        {/* 展开按钮 - 仅当有其他产品时显示 */}
                        {hasOtherProducts && (
                          <button
                            onClick={(e) => handleToggleBrandExpand(brand, e)}
                            className="w-full mt-2 py-2 text-sm text-primary-500 hover:bg-primary-50 transition-colors rounded"
                          >
                            {isBrandExpanded
                              ? "收起其他产品"
                              : `展开其他 ${otherProducts.length} 款产品 ▼`}
                          </button>
                        )}

                        {/* 展开的其他产品列表 */}
                        {isBrandExpanded && (
                          <div className="mt-2 space-y-2">
                            {otherProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
