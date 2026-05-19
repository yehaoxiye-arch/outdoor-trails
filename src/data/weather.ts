import { DayForecast } from "@/types/weather";

export function getFallbackWeather(province: string, days: number): DayForecast[] {
  const baseWeather: Record<string, { tempHigh: number; tempLow: number; condition: string; icon: string }> = {
    江西: { tempHigh: 22, tempLow: 10, condition: "多云", icon: "⛅" },
    西藏: { tempHigh: 15, tempLow: 0, condition: "晴", icon: "☀️" },
    四川: { tempHigh: 20, tempLow: 10, condition: "多云", icon: "⛅" },
    云南: { tempHigh: 22, tempLow: 12, condition: "晴", icon: "☀️" },
    陕西: { tempHigh: 18, tempLow: 8, condition: "多云", icon: "⛅" },
    香港: { tempHigh: 28, tempLow: 22, condition: "晴", icon: "☀️" },
    安徽: { tempHigh: 22, tempLow: 12, condition: "多云", icon: "⛅" },
    湖南: { tempHigh: 24, tempLow: 14, condition: "多云", icon: "⛅" },
    山东: { tempHigh: 20, tempLow: 10, condition: "晴", icon: "☀️" },
  };

  const base = baseWeather[province] || { tempHigh: 20, tempLow: 10, condition: "多云", icon: "⛅" };

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return {
      date: date.toISOString().split("T")[0],
      tempHigh: base.tempHigh + Math.floor(Math.random() * 5) - 2,
      tempLow: base.tempLow + Math.floor(Math.random() * 5) - 2,
      precipitation: Math.floor(Math.random() * 30),
      precipitationType: "none" as const,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      windLevel: "微风",
      condition: base.condition,
      icon: base.icon,
    };
  });
}
