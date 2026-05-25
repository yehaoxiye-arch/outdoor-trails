import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";
import RankingCard from "@/components/home/RankingCard";
import rankingsData from "@/data/outdoormagic-rankings.json";

export default function HomePage() {
  const rankings = Object.values(rankingsData);

  return (
    <div className="min-h-screen bg-background-warm">
      {/* Hero: image background + title overlay */}
      <section className="relative h-[45vh]">
        <HeroCarousel />

        {/* Title at bottom of hero */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg mb-2">
            径迹
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light tracking-widest drop-shadow-md">
            智能装备推荐 · 让每一次出发都从容
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-16 flex flex-col" style={{ minHeight: "calc(55vh - 48px)" }}>
        {/* Search */}
        <section className="text-center mb-auto pt-4">
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </section>

        {/* Rankings */}
        <section className="pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
          <p className="text-center text-[10px] text-gray-400 mt-6">
            榜单数据来源：<a href="https://outdoorsmagic.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">outdoorsmagic.com</a>
          </p>
        </section>
      </main>
    </div>
  );
}
