import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";
import RankingCard from "@/components/home/RankingCard";
import rankingsData from "@/data/outdoormagic-rankings.json";

export default function HomePage() {
  const rankings = Object.values(rankingsData);

  return (
    <div className="min-h-screen">
      {/* ===== 移动端 Hero ===== */}
      <div className="md:hidden relative">
        {/* 背景层（图片 + 渐变叠加） */}
        <div className="absolute inset-0 h-[444px] overflow-hidden">
          {/* 图片底图 */}
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
          />
          {/* 渐变叠加层（保留原先的氛围感） */}
          <div className="absolute inset-0"
            style={{
              background: `
                linear-gradient(180deg, rgba(255,255,255,.18), rgba(88,56,34,.38)),
                radial-gradient(circle at 83% 18%, rgba(230,216,184,.5) 0 32px, transparent 33px),
                linear-gradient(125deg, transparent 0 35%, rgba(142,119,91,.5) 35% 62%, transparent 63%),
                linear-gradient(55deg, transparent 0 42%, rgba(159,119,78,.45) 42% 72%, transparent 73%)
              `,
            }}
          />
          {/* 底部渐变过渡 */}
          <div className="absolute left-0 right-0 bottom-0 h-[90px]"
            style={{ background: "linear-gradient(180deg, rgba(248,248,246,0), #f8f8f6 86%)" }}
          />
        </div>

        {/* 内容层（无 overflow-hidden，搜索下拉可正常展开） */}
        <section className="relative">
          {/* 顶部导航 */}
          <div className="relative z-10 flex items-center gap-3 px-6 pt-[18px]">
            <button className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center" aria-label="打开菜单">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-white font-extrabold text-[22px]">
              <svg className="w-11 h-6" viewBox="0 0 44 24" fill="none">
                <path d="M2 21L12 3l10 18" stroke="#dce97a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21L24 7l8 14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>径迹</span>
            </div>
          </div>

          {/* Hero 文案 */}
          <div className="relative z-10 px-6 mt-[160px]">
            <h1 className="text-[42px] font-[850] leading-[1.08] text-white mb-3">
              Find your<br />trail kit
            </h1>
            <p className="text-[15px] text-white/92">
              智能装备推荐，让每一次出发都从容。
            </p>
          </div>

          {/* 搜索栏 */}
          <div className="relative z-20 mx-6 mt-[14px]">
            <SearchBar variant="hero" />
          </div>

          {/* 快捷链接 */}
          <a href="#rankings" className="relative z-10 block w-fit mx-auto mt-7 text-[13px] font-bold text-[#999f99] underline underline-offset-4">
            探索热门装备榜单
          </a>
        </section>
      </div>

      {/* ===== 桌面端 Hero（轮播图） ===== */}
      <section className="hidden md:block relative h-[45vh]">
        <HeroCarousel />

        {/* 左上角品牌标识 */}
        <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
          <svg className="w-11 h-6" viewBox="0 0 44 24" fill="none">
            <path d="M2 21L12 3l10 18" stroke="#dce97a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 21L24 7l8 14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-extrabold text-[22px] drop-shadow-lg">径迹</span>
        </div>

        {/* 底部文案 */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
            Find your trail kit
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light tracking-widest drop-shadow-md">
            智能装备推荐 · 让每一次出发都从容
          </p>
        </div>
      </section>

      {/* ===== 桌面端搜索栏 ===== */}
      <div className="hidden md:block max-w-5xl mx-auto px-6 pt-10 pb-4">
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* ===== 榜单区域 ===== */}
      <main id="rankings" className="max-w-5xl mx-auto px-6 py-8 md:py-16">
        <section>
          {/* 移动端：单列卡片 */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {rankings.map((ranking) => (
              <RankingCard
                key={ranking.id}
                id={ranking.id}
                title={ranking.title}
                icon={ranking.icon}
                products={ranking.products}
                source={ranking.source}
                url={ranking.url}
                variant="mobile"
              />
            ))}
          </div>

          {/* 桌面端：三列卡片 */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-8 max-w-4xl mx-auto">
            {rankings.map((ranking) => (
              <RankingCard
                key={ranking.id}
                id={ranking.id}
                title={ranking.title}
                icon={ranking.icon}
                products={ranking.products}
                source={ranking.source}
                url={ranking.url}
              />
            ))}
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-6 md:mt-8">
            榜单数据来源：<a href="https://outdoorsmagic.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">outdoorsmagic.com</a>
          </p>
        </section>
      </main>
    </div>
  );
}
