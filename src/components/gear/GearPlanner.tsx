"use client";

import { useState } from "react";
import { Route, RouteStyleData } from "@/types/route";
import { GearRecommendation } from "@/types/product";
import { DayForecast } from "@/types/weather";
import { generateRecommendations } from "@/lib/recommend";
import { fetchWeatherForecast } from "@/lib/weather";
import { getFallbackWeather } from "@/data/weather";
import DatePicker from "@/components/ui/DatePicker";
import CategoryCard from "./CategoryCard";
import NotRecommended from "./NotRecommended";

interface GearPlannerProps {
  route: Route;
  selectedStyle: RouteStyleData;
  onDateChange?: (date: string, forecasts: DayForecast[]) => void;
  defaultForecasts?: DayForecast[];
}

export default function GearPlanner({ route, selectedStyle, onDateChange, defaultForecasts }: GearPlannerProps) {
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
        // 需要获取从今天到出行结束的所有天数
        const totalDays = daysDiff + duration;
        const result = await fetchWeatherForecast(coords.lat, coords.lng, Math.min(totalDays, 14));
        if (result.success) {
          // 跳过从今天到出行日期的天数，只保留出行期间的天气
          forecasts = result.data.slice(daysDiff, daysDiff + duration);
          // 如果切片后数据不足，用备用数据补充
          if (forecasts.length < duration) {
            const fallback = getFallbackWeather(route.province, totalDays);
            forecasts = [...forecasts, ...fallback.slice(daysDiff + forecasts.length, daysDiff + duration)];
          }
        } else {
          // API失败，使用备用数据并根据出行日期偏移
          const fallback = getFallbackWeather(route.province, daysDiff + duration);
          forecasts = fallback.slice(daysDiff, daysDiff + duration);
        }
      } else {
        // 没有坐标或超出14天，使用备用数据并根据出行日期偏移
        const fallback = getFallbackWeather(route.province, daysDiff + duration);
        forecasts = fallback.slice(daysDiff, daysDiff + duration);
      }

      // 确保天气数据的日期从用户选择的出行日期开始
      forecasts = forecasts.map((f, i) => {
        const forecastDate = new Date(date);
        forecastDate.setDate(forecastDate.getDate() + i);
        return {
          ...f,
          date: forecastDate.toISOString().split("T")[0],
        };
      });

      // 通知父组件天气数据变化
      if (onDateChange) {
        onDateChange(date, forecasts);
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

  const handleReset = () => {
    setRecommendation(null);
    if (onDateChange) {
      onDateChange("", []);
    }
  };

  return (
    <div className="bg-white rounded-alltrails shadow-alltrails p-4">
      <h3 className="text-lg font-semibold text-text-primary mb-3">装备规划</h3>

      {!recommendation ? (
        <div>
          <p className="text-text-secondary text-sm mb-4">
            根据线路条件和天气预报，为您生成个性化装备推荐。
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-1">
                出发日期
              </label>
              <DatePicker
                id="date"
                value={date}
                onChange={(val) => {
                  setDate(val);
                  setError(null);
                }}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-2.5 bg-primary-500 text-white text-sm font-medium rounded-alltrails hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "生成中..." : "获取推荐"}
            </button>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-text-primary">
                {recommendation.style}
              </p>
              <p className="text-xs text-text-secondary">
                {recommendation.date} · 预估负重: {(recommendation.totalWeight / 1000).toFixed(1)}kg
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium"
            >
              重置
            </button>
          </div>

          <div className="space-y-2 mb-4">
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
