"use client";

import { useState } from "react";
import { Route, RouteStyleData, RouteStyle } from "@/types/route";

interface TrailContentProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function TrailContent({ route, selectedStyle }: TrailContentProps) {
  const [currentStyle, setCurrentStyle] = useState<RouteStyleData>(selectedStyle);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleStyleChange = (style: RouteStyle) => {
    const newStyle = route.styles.find((s) => s.name === style);
    if (newStyle) {
      setCurrentStyle(newStyle);
    }
  };

  return (
    <div>
      {/* 路线风格选择器 */}
      {route.styles.length > 1 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">路线风格</h2>
          <div className="flex flex-wrap gap-2">
            {route.styles.map((style) => (
              <button
                key={style.name}
                onClick={() => handleStyleChange(style.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStyle.name === style.name
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 路线描述 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">路线介绍</h2>
        <div className="prose prose-gray max-w-none">
          <p className={`text-gray-700 leading-relaxed ${!isDescriptionExpanded ? "line-clamp-4" : ""}`}>
            {currentStyle.description}
          </p>
          {currentStyle.description.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-primary-500 hover:text-primary-600 font-medium text-sm mt-2"
            >
              {isDescriptionExpanded ? "收起" : "展开更多"}
            </button>
          )}
        </div>
      </div>

      {/* 路线详情 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">路线详情</h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">负重范围</span>
              <p className="font-medium text-gray-900">{currentStyle.weightRange}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">时间缩减</span>
              <p className="font-medium text-gray-900">{currentStyle.timeReduction}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">所属山脉</span>
              <p className="font-medium text-gray-900">{route.mountainRange || "未分类"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">路线风格</span>
              <p className="font-medium text-gray-900">{currentStyle.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 地图占位 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">路线地图</h2>
        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-sm">地图功能开发中</p>
          </div>
        </div>
      </div>
    </div>
  );
}
