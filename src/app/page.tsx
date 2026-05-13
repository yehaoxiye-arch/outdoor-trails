import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";
import Header from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel — full width */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* Title & Search */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            径迹
          </h1>
          <p className="text-base md:text-lg text-gray-400 font-light tracking-wide mb-10">
            智能装备推荐 · 让每一次出发都从容
          </p>
          <SearchBar />
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-2">
              线路数据
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              覆盖全国经典徒步线路<br />海拔、距离、难度一目了然
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-2">
              天气联动
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              实时天气预报驱动推荐<br />雨具、保暖、防晒精准匹配
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide mb-2">
              装备清单
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              根据线路条件智能生成<br />负重预估、携带提示一步到位
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
