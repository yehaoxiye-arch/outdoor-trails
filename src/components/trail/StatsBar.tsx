interface StatsBarProps {
  distance: string;
  duration: string;
  altitude: string;
  difficulty: string;
}

export default function StatsBar({ distance, duration, altitude, difficulty }: StatsBarProps) {
  const difficultyColors: Record<string, string> = {
    简单: "bg-difficulty-easy-bg text-difficulty-easy",
    中等: "bg-difficulty-medium-bg text-difficulty-medium",
    困难: "bg-difficulty-hard-bg text-difficulty-hard",
    极难: "bg-difficulty-expert-bg text-difficulty-expert",
  };

  return (
    <div className="bg-background-gray rounded-lg p-4 md:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{distance}</span>
          </div>
          <span className="text-xs text-gray-500">距离</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{duration}</span>
          </div>
          <span className="text-xs text-gray-500">时长</span>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xl font-bold text-gray-900">{altitude}</span>
          </div>
          <span className="text-xs text-gray-500">海拔</span>
        </div>

        <div className="text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold ${difficultyColors[difficulty] || "bg-gray-100 text-gray-700"}`}>
            {difficulty}
          </span>
          <div className="mt-1 text-xs text-gray-500">难度</div>
        </div>
      </div>
    </div>
  );
}
