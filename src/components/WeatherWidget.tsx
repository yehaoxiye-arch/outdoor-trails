import { getWeatherByProvince, getWeatherForecast } from "@/data/weather";

interface WeatherWidgetProps {
  province: string;
}

export default function WeatherWidget({ province }: WeatherWidgetProps) {
  const weather = getWeatherByProvince(province);
  const forecast = getWeatherForecast(province);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">天气信息</h3>
      <div className="text-center mb-4">
        <span className="text-5xl">{weather.icon}</span>
        <p className="text-3xl font-bold mt-2">{weather.temperature}°C</p>
        <p className="text-gray-600">{weather.condition}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm">湿度</p>
          <p className="font-medium">{weather.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">风速</p>
          <p className="font-medium">{weather.windSpeed} km/h</p>
        </div>
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-500 mb-3">未来天气</h4>
        <div className="space-y-2">
          {forecast.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <span className="text-gray-600">{day.date}</span>
              <span>{day.icon}</span>
              <span className="text-gray-900">
                {day.high}° / {day.low}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
