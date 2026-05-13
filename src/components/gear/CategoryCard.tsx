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
