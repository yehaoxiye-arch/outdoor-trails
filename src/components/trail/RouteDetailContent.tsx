"use client";

import { useState, useMemo } from "react";
import { Route, RouteStyleData } from "@/types/route";
import { DayForecast } from "@/types/weather";
import { getFallbackWeather } from "@/data/weather";
import WeatherSection from "./WeatherSection";
import GearPlanner from "@/components/gear/GearPlanner";

interface RouteDetailContentProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function RouteDetailContent({ route, selectedStyle }: RouteDetailContentProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);

  // 初始化默认天气数据（WeatherSection 和 GearPlanner 共享）
  const defaultForecasts = useMemo(() => getFallbackWeather(route.province, 5), [route.province]);

  const handleDateChange = (date: string, weatherData: DayForecast[]) => {
    setSelectedDate(date);
    setForecasts(weatherData);
  };

  return (
    <div className="flex flex-col gap-6 mt-6 pt-6 border-t border-gray-200 md:flex-row md:mt-8 md:pt-8">
      {/* 左侧：天气信息 */}
      <div className="flex-1">
        <WeatherSection
          route={route}
          selectedDate={selectedDate}
          forecasts={forecasts}
          defaultForecasts={defaultForecasts}
        />
      </div>

      {/* 右侧：装备推荐 */}
      <div className="flex-1">
        <GearPlanner
          route={route}
          selectedStyle={selectedStyle}
          onDateChange={handleDateChange}
          defaultForecasts={defaultForecasts}
        />
      </div>
    </div>
  );
}
