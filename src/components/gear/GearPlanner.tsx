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
