"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Route, getProvinces } from "@/data/routes";

interface CarouselProps {
  routes: Route[];
}

export default function Carousel({ routes }: CarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const currentRoute = routes[currentIndex];

  // Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { provinces: [], routes: [] };

    const query = searchQuery.toLowerCase().trim();
    const provinces = getProvinces().filter((p) =>
      p.toLowerCase().includes(query)
    );
    const matchedRoutes = routes.filter(
      (route) =>
        route.name.toLowerCase().includes(query) ||
        route.province.toLowerCase().includes(query) ||
        route.location.toLowerCase().includes(query) ||
        route.description.toLowerCase().includes(query)
    );

    return { provinces, routes: matchedRoutes };
  }, [searchQuery, routes]);

  const showSearchResults = isSearchFocused && searchQuery.trim().length > 0;
  const hasResults =
    searchResults.provinces.length > 0 || searchResults.routes.length > 0;

  const handleProvinceClick = (province: string) => {
    router.push(`/province/${encodeURIComponent(province)}`);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleRouteClick = (routeId: string) => {
    router.push(`/route/${routeId}`);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 1800);
    },
    [isTransitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % routes.length);
  }, [currentIndex, routes.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + routes.length) % routes.length);
  }, [currentIndex, routes.length, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape") {
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with smooth color transition */}
      <div
        className="absolute inset-0 transition-colors duration-[2500ms] ease-in-out"
        style={{ backgroundColor: currentRoute.bgColor }}
      />

      {/* Images with crossfade */}
      {routes.map((route, index) => (
        <div
          key={route.id}
          className="absolute inset-0 transition-opacity duration-[2500ms] ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <Image
            src={route.image}
            alt={route.name}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Header - AllTrails style */}
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-white text-xl font-bold tracking-tight">
              径迹
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-colors">
              登录
            </button>
            <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors">
              注册
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Centered like AllTrails */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 md:px-6">
        {/* Hero Title */}
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-4 drop-shadow-lg">
          发现你的下一次冒险
        </h1>
        <p className="text-white/80 text-base md:text-lg lg:text-xl text-center mb-6 md:mb-8 max-w-2xl drop-shadow-md px-4">
          探索中国经典户外徒步路线，开启你的户外之旅
        </p>

        {/* Search Bar - Centered */}
        <div className="w-full max-w-xl md:max-w-2xl px-2 md:px-0">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索省份、线路名称或地区..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              className="w-full px-6 py-4 pr-14 bg-white rounded-full text-gray-900 placeholder-gray-500 text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                {hasResults ? (
                  <div className="py-2">
                    {/* Province Results */}
                    {searchResults.provinces.length > 0 && (
                      <div>
                        <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                          省份
                        </div>
                        {searchResults.provinces.map((province) => (
                          <button
                            key={province}
                            onClick={() => handleProvinceClick(province)}
                            className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                          >
                            <div className="text-gray-900 font-medium">
                              {province}
                            </div>
                            <div className="text-gray-500 text-sm">
                              查看该省份所有线路
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Route Results */}
                    {searchResults.routes.length > 0 && (
                      <div>
                        {searchResults.provinces.length > 0 && (
                          <div className="border-t border-gray-100 my-1" />
                        )}
                        <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                          线路
                        </div>
                        {searchResults.routes.map((route) => (
                          <button
                            key={route.id}
                            onClick={() => handleRouteClick(route.id)}
                            className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                          >
                            <div className="text-gray-900 font-medium">
                              {route.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {route.province} · {route.location}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-4 text-gray-500 text-sm">
                    没有找到匹配的结果
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 text-white/70 text-xs md:text-sm flex-wrap">
            <span>12 条精选线路</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden md:block" />
            <span>10 个省份</span>
            <span className="w-1 h-1 bg-white/30 rounded-full hidden md:block" />
            <span>专业户外指南</span>
          </div>
        </div>
      </div>

      {/* Featured Routes - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {routes.map((route, index) => (
              <button
                key={route.id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? "bg-white text-gray-900"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {route.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
