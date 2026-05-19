interface StatsBarProps {
  distance: string;
  duration: string;
  altitude: string;
  difficulty: string;
}

export default function StatsBar({ distance, duration, altitude, difficulty }: StatsBarProps) {
  const difficultyColors: Record<string, string> = {
    简单: "text-difficulty-easy",
    中等: "text-difficulty-medium",
    困难: "text-difficulty-hard",
    极难: "text-difficulty-expert",
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {/* 距离 */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div>
              <span className="text-lg font-semibold text-gray-900">{distance}</span>
              <span className="text-sm text-gray-500 ml-1">距离</span>
            </div>
          </div>

          {/* 时长 */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-lg font-semibold text-gray-900">{duration}</span>
              <span className="text-sm text-gray-500 ml-1">时长</span>
            </div>
          </div>

          {/* 海拔 */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div>
              <span className="text-lg font-semibold text-gray-900">{altitude}</span>
              <span className="text-sm text-gray-500 ml-1">海拔</span>
            </div>
          </div>

          {/* 难度 */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <span className={`text-lg font-semibold ${difficultyColors[difficulty] || "text-gray-700"}`}>
                {difficulty}
              </span>
              <span className="text-sm text-gray-500 ml-1">难度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
