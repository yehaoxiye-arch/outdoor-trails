export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

// 模拟天气数据
const weatherDatabase: Record<string, WeatherData> = {
  西藏: { temperature: 5, condition: "晴朗", humidity: 30, windSpeed: 15, icon: "☀️" },
  四川: { temperature: 12, condition: "多云", humidity: 60, windSpeed: 8, icon: "⛅" },
  云南: { temperature: 18, condition: "晴朗", humidity: 45, windSpeed: 5, icon: "☀️" },
  江西: { temperature: 22, condition: "小雨", humidity: 80, windSpeed: 10, icon: "🌧️" },
  陕西: { temperature: 15, condition: "阴天", humidity: 55, windSpeed: 12, icon: "☁️" },
  香港: { temperature: 28, condition: "炎热", humidity: 75, windSpeed: 15, icon: "🌡️" },
};

export function getWeatherByProvince(province: string): WeatherData {
  return weatherDatabase[province] || { temperature: 20, condition: "未知", humidity: 50, windSpeed: 10, icon: "❓" };
}

export function getWeatherForecast(province: string): WeatherForecast[] {
  const base = getWeatherByProvince(province);
  const days = ["今天", "明天", "后天"];
  return days.map((date, i) => ({
    date,
    high: base.temperature + Math.floor(Math.random() * 5) - 2 + i,
    low: base.temperature - Math.floor(Math.random() * 5) - 2 + i,
    condition: base.condition,
    icon: base.icon,
  }));
}
