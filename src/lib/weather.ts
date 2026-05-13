import { DayForecast, WeatherResult } from "@/types/weather";

const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";

const weatherCodeMap: Record<number, { condition: string; icon: string }> = {
  0: { condition: "晴", icon: "☀️" },
  1: { condition: "少云", icon: "⛅" },
  2: { condition: "多云", icon: "⛅" },
  3: { condition: "阴", icon: "☁️" },
  45: { condition: "雾", icon: "🌫️" },
  48: { condition: "雾凇", icon: "🌫️" },
  51: { condition: "毛毛雨", icon: "🌦️" },
  53: { condition: "毛毛雨", icon: "🌦️" },
  55: { condition: "毛毛雨", icon: "🌦️" },
  61: { condition: "小雨", icon: "🌧️" },
  63: { condition: "中雨", icon: "🌧️" },
  65: { condition: "大雨", icon: "🌧️" },
  71: { condition: "小雪", icon: "🌨️" },
  73: { condition: "中雪", icon: "🌨️" },
  75: { condition: "大雪", icon: "🌨️" },
  77: { condition: "雪粒", icon: "🌨️" },
  80: { condition: "阵雨", icon: "🌧️" },
  81: { condition: "阵雨", icon: "🌧️" },
  82: { condition: "暴雨", icon: "🌧️" },
  85: { condition: "阵雪", icon: "🌨️" },
  86: { condition: "阵雪", icon: "🌨️" },
  95: { condition: "雷暴", icon: "⛈️" },
  96: { condition: "雷暴", icon: "⛈️" },
  99: { condition: "雷暴", icon: "⛈️" },
};

function getWindLevel(speed: number): string {
  if (speed < 12) return "微风";
  if (speed < 39) return "和风";
  if (speed < 62) return "大风";
  return "狂风";
}

function getPrecipitationType(code: number): "none" | "rain" | "snow" | "sleet" {
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "rain";
  return "none";
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  days: number
): Promise<WeatherResult> {
  try {
    const url = new URL(WEATHER_API_BASE);
    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,windspeed_10m_max,weathercode");
    url.searchParams.set("timezone", "Asia/Shanghai");
    url.searchParams.set("forecast_days", Math.min(days, 14).toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const { daily } = data;

    const forecasts: DayForecast[] = daily.time.map((date: string, index: number) => {
      const weatherCode = daily.weathercode[index];
      const weatherInfo = weatherCodeMap[weatherCode] || { condition: "未知", icon: "❓" };

      return {
        date,
        tempHigh: Math.round(daily.temperature_2m_max[index]),
        tempLow: Math.round(daily.temperature_2m_min[index]),
        precipitation: daily.precipitation_probability_max[index],
        precipitationType: getPrecipitationType(weatherCode),
        windSpeed: Math.round(daily.windspeed_10m_max[index]),
        windLevel: getWindLevel(daily.windspeed_10m_max[index]),
        condition: weatherInfo.condition,
        icon: weatherInfo.icon,
      };
    });

    return { success: true, data: forecasts };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return {
      success: false,
      error: {
        code: "FETCH_ERROR",
        message: "无法获取天气数据",
        fallbackUsed: false,
      },
    };
  }
}
