import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getRouteById, routes } from "@/data/routes";
import { getEquipmentByDifficulty } from "@/data/equipment";
import EquipmentList from "@/components/EquipmentList";
import WeatherWidget from "@/components/WeatherWidget";

interface RoutePageProps {
  params: Promise<{
    routeId: string;
  }>;
}

export async function generateStaticParams() {
  return routes.map((route) => ({
    routeId: route.id,
  }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { routeId } = await params;
  const route = getRouteById(routeId);
  if (!route) {
    return { title: "线路未找到 - 径迹" };
  }
  return {
    title: `${route.name} - 径迹`,
    description: route.description,
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;
  const route = getRouteById(routeId);
  const equipment = route ? getEquipmentByDifficulty(route.difficulty) : [];

  if (!route) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">未找到该线路</h1>
          <Link
            href="/"
            className="text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-gray-900">
      {/* Header - AllTrails style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-green-800 hover:text-green-900 transition-colors"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-bold tracking-tight">径迹</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-green-700 font-medium text-sm transition-colors"
            >
              探索线路
            </Link>
            <Link
              href={`/province/${route.province}`}
              className="text-gray-600 hover:text-green-700 font-medium text-sm transition-colors"
            >
              {route.province}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-green-700 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-green-700 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-16 pb-4 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700 transition-colors">
              首页
            </Link>
            <span>/</span>
            <Link
              href={`/province/${route.province}`}
              className="hover:text-green-700 transition-colors"
            >
              {route.province}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{route.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={route.image}
          alt={route.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Title and Badges */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    route.difficulty === "简单"
                      ? "bg-green-100 text-green-800"
                      : route.difficulty === "中等"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {route.difficulty}
                </span>
                <span className="text-gray-500 text-sm">
                  {route.province} · {route.location}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {route.name}
              </h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <svg
                  className="w-6 h-6 text-green-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  {route.altitude}
                </p>
                <p className="text-gray-500 text-sm">海拔</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <svg
                  className="w-6 h-6 text-green-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  {route.distance}
                </p>
                <p className="text-gray-500 text-sm">距离</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <svg
                  className="w-6 h-6 text-green-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  {route.duration}
                </p>
                <p className="text-gray-500 text-sm">时长</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <svg
                  className="w-6 h-6 text-green-600 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-2xl font-bold text-gray-900">
                  {route.difficulty}
                </p>
                <p className="text-gray-500 text-sm">难度</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-bold mb-4">线路简介</h2>
              <p className="text-gray-700 leading-relaxed">
                {route.description}
              </p>
            </div>

            {/* Trail Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">线路详情</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">起点</span>
                  <span className="font-medium">{route.location}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">省份</span>
                  <span className="font-medium">{route.province}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">最佳季节</span>
                  <span className="font-medium">待补充</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">是否需要向导</span>
                  <span className="font-medium">待补充</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <button className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors mb-3">
                开始导航
              </button>
              <button className="w-full py-3 border border-gray-300 hover:border-green-500 text-gray-700 rounded-lg font-medium transition-colors mb-3">
                下载离线地图
              </button>
              <button className="w-full py-3 border border-gray-300 hover:border-green-500 text-gray-700 rounded-lg font-medium transition-colors">
                分享线路
              </button>
            </div>

            {/* Weather Widget */}
            <WeatherWidget province={route.province} />

            {/* Equipment Recommendations */}
            <EquipmentList equipment={equipment} />
          </div>
        </div>
      </main>
    </div>
  );
}
