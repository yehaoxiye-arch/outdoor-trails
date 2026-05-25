"use client";

import { useState } from "react";
import Image from "next/image";
import { Route, RouteStyleData, RouteStyle } from "@/types/route";

interface TrailMainContentProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function TrailMainContent({ route, selectedStyle }: TrailMainContentProps) {
  const [currentStyle, setCurrentStyle] = useState<RouteStyleData>(selectedStyle);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "conditions">("overview");

  const handleStyleChange = (style: RouteStyle) => {
    const newStyle = route.styles.find((s) => s.name === style);
    if (newStyle) {
      setCurrentStyle(newStyle);
    }
  };

  return (
    <div>
      {/* 标签页切换 */}
      <div className="flex gap-4 mb-4 overflow-x-auto md:gap-6 md:mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-text-primary text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          概览
        </button>
        <button
          onClick={() => setActiveTab("conditions")}
          className={`pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === "conditions"
              ? "border-text-primary text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          路况
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* 大尺寸主图卡片 */}
          <div className="relative w-full aspect-[16/10] rounded-alltrails overflow-hidden shadow-alltrails mb-6">
            <Image
              src={route.image}
              alt={route.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 65vw"
            />
            {/* 播放按钮 */}
            <button className="absolute bottom-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-alltrails hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            {/* 照片数量标签 */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-text-primary shadow-alltrails">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>12</span>
            </div>
          </div>

          {/* 数据行 - 三个等宽数据块 */}
          <div className="grid grid-cols-3 gap-2 mb-4 md:flex md:gap-6 md:mb-6">
            <div className="flex-1">
              <div className="text-2xl font-bold text-text-primary">{currentStyle.distance}</div>
              <div className="text-sm text-text-secondary mt-1">距离</div>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-text-primary">{currentStyle.duration}</div>
              <div className="text-sm text-text-secondary mt-1">时长</div>
            </div>
            <div className="flex-1 flex items-start gap-2">
              <svg className="w-5 h-5 text-text-primary mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div>
                <div className="text-2xl font-bold text-text-primary">{currentStyle.altitude}</div>
                <div className="text-sm text-text-secondary mt-1">海拔</div>
              </div>
            </div>
          </div>

          {/* 路线描述 */}
          <div className="mb-6">
            <p className={`text-text-primary leading-relaxed ${!isDescriptionExpanded ? "line-clamp-4" : ""}`}>
              {currentStyle.description}
            </p>
            {currentStyle.description.length > 200 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-text-primary font-medium text-sm mt-2 underline"
              >
                {isDescriptionExpanded ? "收起" : "展开"}
              </button>
            )}
          </div>

          {/* 路线风格选择器 */}
          {route.styles.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">路线风格</h3>
              <div className="flex flex-wrap gap-2">
                {route.styles.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => handleStyleChange(style.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      currentStyle.name === style.name
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-text-primary hover:bg-gray-200 active:bg-gray-300"
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* 路况标签页 */
        <ConditionsTab route={route} style={currentStyle} />
      )}
    </div>
  );
}

function ConditionsTab({ route, style }: { route: Route; style: RouteStyleData }) {
  // 模拟天气数据
  const weatherDays = [
    { day: "周一", icon: "☀️", low: 8, high: 22, sunrise: "6:15", sunset: "19:45", humidity: 45, condition: "晴朗" },
    { day: "周二", icon: "⛅", low: 10, high: 20, sunrise: "6:14", sunset: "19:46", humidity: 55, condition: "多云" },
    { day: "周三", icon: "🌧️", low: 12, high: 18, sunrise: "6:13", sunset: "19:47", humidity: 75, condition: "小雨" },
    { day: "周四", icon: "☀️", low: 9, high: 24, sunrise: "6:12", sunset: "19:48", humidity: 40, condition: "晴朗" },
    { day: "周五", icon: "⛅", low: 11, high: 21, sunrise: "6:11", sunset: "19:49", humidity: 50, condition: "多云" },
  ];

  const today = weatherDays[0];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      {/* 左侧：每日天气预报 */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-text-primary mb-4">每日天气预报</h3>

        {/* 当日天气放大显示 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-alltrails">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{today.icon}</span>
            <div>
              <div className="text-5xl font-bold text-text-primary">{today.high}°</div>
              <div className="text-text-secondary">{today.condition}</div>
            </div>
          </div>
        </div>

        {/* 每日天气列表 */}
        <div className="space-y-3">
          {weatherDays.map((day, index) => {
            const coldWidth = Math.max(20, ((day.low + 10) / 40) * 100);
            const hotWidth = Math.max(20, ((30 - day.high) / 40) * 100);
            const midWidth = 100 - coldWidth - hotWidth;

            return (
              <div key={day.day} className="flex items-center gap-4 py-2">
                <span className="text-sm font-medium text-text-primary w-10">{day.day}</span>
                <span className="text-xl w-8">{day.icon}</span>
                <span className="text-sm text-text-secondary w-8">{day.low}°</span>
                <div className="flex-1 flex h-1 rounded-full overflow-hidden">
                  <div className="temp-bar-cold" style={{ width: `${coldWidth}%` }} />
                  <div className="temp-bar-mid" style={{ width: `${midWidth}%` }} />
                  <div className="temp-bar-hot" style={{ width: `${hotWidth}%` }} />
                </div>
                <span className="text-sm font-medium text-text-primary w-8">{day.high}°</span>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                  <span>{day.sunrise}</span>
                </div>
                <div className="text-xs text-text-secondary">{day.humidity}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧：装备推荐栏 */}
      <div className="w-full md:w-64 flex-shrink-0">
        <h3 className="text-lg font-semibold text-text-primary mb-4">装备推荐</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-alltrails">
            <div className="text-sm font-medium text-text-primary">鞋类</div>
            <div className="text-xs text-text-secondary mt-1">建议防水登山靴</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-alltrails">
            <div className="text-sm font-medium text-text-primary">分层穿衣</div>
            <div className="text-xs text-text-secondary mt-1">早晚温差大，携带保暖层</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-alltrails">
            <div className="text-sm font-medium text-text-primary">雨具</div>
            <div className="text-xs text-text-secondary mt-1">周三有雨，需携带雨衣</div>
          </div>
        </div>
      </div>
    </div>
  );
}
