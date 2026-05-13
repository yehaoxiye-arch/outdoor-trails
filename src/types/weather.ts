export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface DayForecast {
  date: string;
  tempHigh: number;
  tempLow: number;
  precipitation: number; // 降水概率 0-100
  precipitationType: "none" | "rain" | "snow" | "sleet";
  windSpeed: number; // km/h
  windLevel: string; // "微风" / "大风" / "狂风"
  condition: string;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface WeatherError {
  code: string;
  message: string;
  fallbackUsed: boolean;
}

export type WeatherResult =
  | { success: true; data: DayForecast[] }
  | { success: false; error: WeatherError };
