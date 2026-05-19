import Link from "next/link";
import { Metadata } from "next";
import { getRouteById, routes } from "@/data/routes";
import Header from "@/components/layout/Header";
import TrailMainContent from "@/components/trail/TrailMainContent";
import TrailSidebar from "@/components/trail/TrailSidebar";
import RouteDetailContent from "@/components/trail/RouteDetailContent";

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
    description: route.styles[0]?.description || "",
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { routeId } = await params;
  const route = getRouteById(routeId);

  if (!route) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">未找到该线路</h1>
          <Link href="/" className="text-primary-500 hover:text-primary-600 font-medium">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const defaultStyle = route.styles[0];

  const difficultyColors: Record<string, string> = {
    简单: "bg-green-500",
    中等: "bg-yellow-500",
    困难: "bg-difficulty-orange",
    极难: "bg-red-500",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部固定导航栏 */}
      <Header showBack />

      {/* 标题信息区 */}
      <div className="max-w-[1280px] mx-auto px-4 pt-4 pb-3 md:px-6 md:pt-6 md:pb-4">
        {/* 主标题 */}
        <h1 className="text-[2.5rem] font-bold text-text-primary leading-tight mb-3">
          {route.name}
        </h1>

        {/* 评分行 */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 ${difficultyColors[defaultStyle.difficulty] || "bg-gray-500"} text-white text-sm font-medium rounded-full`}>
            {defaultStyle.difficulty}
          </span>
          <span className="text-text-secondary text-sm">{route.location}</span>
        </div>

        {/* 分割线 */}
        <div className="h-px bg-border" />
      </div>

      {/* 主内容区 */}
      <main className="max-w-[1280px] mx-auto px-4 py-4 md:px-6 md:py-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 左侧主栏 65% */}
          <div className="w-full md:flex-[65]">
            <TrailMainContent route={route} selectedStyle={defaultStyle} />
          </div>

          {/* 右侧边栏 35% */}
          <div className="w-full md:flex-[35]">
            <TrailSidebar route={route} selectedStyle={defaultStyle} />
          </div>
        </div>

        {/* 天气与装备推荐区 - 共享日期状态 */}
        <RouteDetailContent route={route} selectedStyle={defaultStyle} />
      </main>
    </div>
  );
}
