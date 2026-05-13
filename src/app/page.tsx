import HeroCarousel from "@/components/home/HeroCarousel";
import SearchBar from "@/components/home/SearchBar";

export default function HomePage() {
  return (
    <main className="relative h-screen overflow-hidden">
      <HeroCarousel />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          径迹
        </h1>
        <p className="text-lg text-white/80 mb-8 drop-shadow-md">
          发现你的下一次冒险
        </p>
        <SearchBar />
      </div>
    </main>
  );
}
