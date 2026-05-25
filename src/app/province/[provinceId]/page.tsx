import Link from "next/link";
import { Metadata } from "next";
import { getRoutesByProvince, getProvinces } from "@/data/routes";
import Header from "@/components/Header";
import RouteCard from "@/components/RouteCard";
import RouteFilters from "@/components/trail/RouteFilters";

interface ProvincePageProps {
  params: Promise<{
    provinceId: string;
  }>;
}

export async function generateStaticParams() {
  const provinces = getProvinces();
  return provinces.map((province) => ({
    provinceId: province,
  }));
}

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const { provinceId } = await params;
  const province = decodeURIComponent(provinceId);
  return {
    title: `${province}徒步线路 - 径迹`,
    description: `探索${province}地区最精彩的户外徒步路线，获取专业装备推荐和天气信息`,
  };
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const { provinceId } = await params;
  const province = decodeURIComponent(provinceId);
  const routes = getRoutesByProvince(province);

  if (routes.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">未找到该省份的线路</h1>
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
      <Header />

      {/* Main Content */}
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700 transition-colors">
              首页
            </Link>
            <span>/</span>
            <span className="text-gray-900">{province}</span>
          </nav>
        </div>

        {/* Province Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {province}徒步线路
          </h1>
          <p className="text-gray-600">
            发现 {province} 地区 {routes.length} 条精彩徒步路线
          </p>
        </div>

        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
          <RouteFilters />
        </div>

        {/* Routes Grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
