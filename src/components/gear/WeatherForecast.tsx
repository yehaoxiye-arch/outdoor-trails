import { DayForecast } from "@/types/weather";

interface WeatherForecastProps {
  forecasts: DayForecast[];
}

export default function WeatherForecast({ forecasts }: WeatherForecastProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-gray-900 mb-3">行程天气</h4>
      <div className="space-y-2">
        {forecasts.map((forecast) => {
          const isWarning = forecast.precipitation > 60 || forecast.precipitationType === "snow";

          return (
            <div
              key={forecast.date}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                isWarning ? "bg-red-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20">
                  {new Date(forecast.date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })}
                </span>
                <span className="text-lg">{forecast.icon}</span>
                <span className="text-sm text-gray-700">{forecast.condition}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  <span className="font-medium">{forecast.tempHigh}°</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-500">{forecast.tempLow}°</span>
                </span>
                <span className={`text-sm ${forecast.precipitation > 60 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                  降水{forecast.precipitation}%
                </span>
                {isWarning && <span className="text-red-500">⚠️</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
