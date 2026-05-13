import Link from "next/link";
import { Metadata } from "next";
import { getRouteById, routes } from "@/data/routes";
import Header from "@/components/layout/Header";
import TrailHero from "@/components/trail/TrailHero";
import TrailInfo from "@/components/trail/TrailInfo";

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

  return (
    <div className="min-h-screen bg-white">
      <Header showBack />
      <TrailHero image={route.image} alt={route.name} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TrailInfo route={route} selectedStyle={defaultStyle} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-background-gray rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">装备推荐</h3>
              <p className="text-gray-500 text-sm">
                选择出发日期后，系统将根据线路条件和天气预报为您生成个性化装备清单。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
