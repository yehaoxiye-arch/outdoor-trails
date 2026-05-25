"use client";

import { useState, useEffect } from "react";
import { Route } from "@/types/route";
import { DayForecast } from "@/types/weather";
import { getFallbackWeather } from "@/data/weather";
import { fetchWeatherForecast } from "@/lib/weather";

interface WeatherSectionProps {
  route: Route;
  selectedDate?: string;
  forecasts?: DayForecast[];
  defaultForecasts?: DayForecast[];
}

// 统一的天气数据格式
interface WeatherDay {
  date: string;
  icon: string;
  low: number;
  high: number;
  sunrise: string;
  sunset: string;
  humidity: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  windLevel: string;
}

// 生成模拟的小时天气数据
function generateHourlyWeather(day: WeatherDay, dayIndex: number) {
  const hours = [];
  const tempRange = day.high - day.low;
  const seed = dayIndex * 7;

  for (let i = 6; i <= 21; i++) {
    const hourFactor = Math.sin(((i - 6) / 15) * Math.PI);
    const temp = Math.round(day.low + tempRange * hourFactor);

    let precipitation = day.precipitation * 0.3;
    if (i >= 12 && i <= 18) {
      precipitation = day.precipitation * (0.5 + ((seed + i) % 10) / 20);
    }
    precipitation = Math.min(100, Math.round(precipitation));

    const windVariation = 0.7 + ((seed + i) % 6) / 10;
    const windSpeed = Math.round(day.windSpeed * windVariation);

    const windDirections = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
    const windDir = windDirections[(seed + i) % windDirections.length];

    hours.push({
      hour: `${i.toString().padStart(2, "0")}:00`,
      temp,
      precipitation,
      windSpeed,
      windDirection: windDir,
      condition: precipitation > 60 ? "🌧️" : precipitation > 30 ? "⛅" : "☀️",
    });
  }

  return hours;
}

// 格式化日期
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekDay = weekDays[date.getDay()];
  return `${month}月${day}日 ${weekDay}`;
}

// 获取天气图标
function getWeatherIcon(condition: string) {
  if (condition.includes("雨") || condition.includes("雪")) return "🌧️";
  if (condition.includes("云") || condition.includes("阴")) return "⛅";
  return "☀️";
}

// 将 DayForecast 转换为 WeatherDay
function forecastToWeatherDay(forecast: DayForecast, index: number): WeatherDay {
  return {
    date: forecast.date,
    icon: getWeatherIcon(forecast.condition),
    low: forecast.tempLow,
    high: forecast.tempHigh,
    sunrise: `6:${(15 - index).toString().padStart(2, "0")}`,
    sunset: `19:${(45 + index).toString().padStart(2, "0")}`,
    humidity: 45 + index * 5,
    condition: forecast.condition,
    precipitation: forecast.precipitation,
    windSpeed: forecast.windSpeed,
    windLevel: forecast.windLevel,
  };
}

export default function WeatherSection({ route, selectedDate, forecasts, defaultForecasts }: WeatherSectionProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [realtimeForecasts, setRealtimeForecasts] = useState<DayForecast[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // 组件挂载时获取真实天气数据
  useEffect(() => {
    const loadWeather = async () => {
      const coords = route.coordinates;
      if (!coords) return;

      setIsLoadingWeather(true);
      try {
        const result = await fetchWeatherForecast(coords.lat, coords.lng, 5);
        if (result.success) {
          setRealtimeForecasts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    loadWeather();
  }, [route.coordinates]);

  // 确定使用的天气数据（优先级：实时API > 传入的forecasts > fallback）
  const getWeatherData = (): DayForecast[] => {
    // 如果有实时获取的天气数据，使用它
    if (realtimeForecasts.length > 0) return realtimeForecasts;
    // 如果有传入的forecasts（用户选择日期后的数据），使用它
    if (forecasts && forecasts.length > 0) return forecasts;
    // 如果有传入的defaultForecasts，使用它
    if (defaultForecasts && defaultForecasts.length > 0) return defaultForecasts;
    // 最后使用fallback
    return getFallbackWeather(route.province, 5);
  };

  const weatherData = getWeatherData();
  const defaultWeatherDays: WeatherDay[] = weatherData.map((f, i) => forecastToWeatherDay(f, i));

  // 使用 forecasts 或默认数据
  const weatherDays: WeatherDay[] = forecasts && forecasts.length > 0
    ? forecasts.map((f, i) => forecastToWeatherDay(f, i))
    : defaultWeatherDays;

  // 获取选中日期的详细天气
  const selectedDayData = selectedDayIndex !== null ? weatherDays[selectedDayIndex] : null;
  const hourlyData = selectedDayData ? generateHourlyWeather(selectedDayData, selectedDayIndex!) : [];

  return (
    <div className="bg-white rounded-alltrails shadow-alltrails p-4 md:p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {selectedDate && weatherDays.length > 0
          ? weatherDays.length === 1
            ? `${formatDate(weatherDays[0].date)} 天气预报`
            : `${formatDate(weatherDays[0].date)} - ${formatDate(weatherDays[weatherDays.length - 1].date)} 天气预报`
          : "天气预报"
        }
      </h3>

      {/* 天气卡片列表 */}
      <div className="space-y-3 mb-4">
        {weatherDays.map((day, index) => {
          const coldWidth = Math.max(20, ((day.low + 10) / 40) * 100);
          const hotWidth = Math.max(20, ((30 - day.high) / 40) * 100);
          const midWidth = 100 - coldWidth - hotWidth;
          const isSelected = selectedDayIndex === index;
          const dayDate = new Date(day.date);
          const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          const weekDay = weekDays[dayDate.getDay()];
          const monthDay = `${dayDate.getMonth() + 1}/${dayDate.getDate()}`;

          return (
            <div
              key={index}
              onClick={() => setSelectedDayIndex(isSelected ? null : index)}
              className={`p-4 rounded-alltrails cursor-pointer transition-all ${
                isSelected
                  ? "bg-primary-100 border-2 border-primary-500"
                  : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border-2 border-transparent"
              }`}
            >
              {/* 日期和天气概览 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{day.icon}</span>
                  <div>
                    <span className="text-sm font-medium text-text-primary">{weekDay}</span>
                    <span className="text-xs text-text-secondary ml-2">{monthDay}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-text-primary" suppressHydrationWarning>{day.high}°</span>
                  <span className="text-sm text-text-secondary" suppressHydrationWarning> / {day.low}°</span>
                </div>
              </div>

              {/* 温度条 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-text-secondary w-6" suppressHydrationWarning>{day.low}°</span>
                <div className="flex-1 flex h-1.5 rounded-full overflow-hidden">
                  <div className="temp-bar-cold" style={{ width: `${coldWidth}%` }} />
                  <div className="temp-bar-mid" style={{ width: `${midWidth}%` }} />
                  <div className="temp-bar-hot" style={{ width: `${hotWidth}%` }} />
                </div>
                <span className="text-xs text-text-secondary w-6" suppressHydrationWarning>{day.high}°</span>
              </div>

              {/* 详细信息 */}
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span suppressHydrationWarning>{day.condition}</span>
                <div className="flex items-center gap-3">
                  <span suppressHydrationWarning>降水 {day.precipitation}%</span>
                  <span suppressHydrationWarning>风速 {day.windSpeed}km/h</span>
                </div>
              </div>

              {/* 展开的逐时天气 */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-text-primary mb-3">逐时天气</h4>
                  <div className="space-y-2">
                    {hourlyData.map((hour) => (
                      <div key={hour.hour} className="flex items-center gap-3 py-1">
                        <span className="text-sm font-medium text-text-primary w-12">{hour.hour}</span>
                        <span className="text-base w-6">{hour.condition}</span>
                        <span className="text-sm font-medium text-text-primary w-10">{hour.temp}°</span>
                        <div className="flex items-center gap-1 w-14">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                          <span className="text-xs text-text-secondary">{hour.precipitation}%</span>
                        </div>
                        <span className="text-xs text-text-secondary whitespace-nowrap">
                          {hour.windDirection}风 {hour.windSpeed}km/h
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 天气提示 */}
                  <div className="mt-3 p-2 bg-blue-50 rounded-alltrails">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-blue-700">
                        {day.precipitation > 50
                          ? "降雨概率较高，建议携带雨具并注意路面湿滑。"
                          : day.high > 30
                          ? "气温较高，注意防暑防晒，多补充水分。"
                          : day.low < 10
                          ? "早晚温差较大，建议携带保暖衣物。"
                          : "天气条件良好，适合户外活动。"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!selectedDate && (
        <p className="text-sm text-text-secondary text-center">
          点击日期查看详细逐时天气
        </p>
      )}
    </div>
  );
}
