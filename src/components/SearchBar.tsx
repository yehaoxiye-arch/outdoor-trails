"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getProvinces } from "@/data/routes";
import { Route } from "@/types/route";

interface SearchBarProps {
  routes: Route[];
  variant?: "light" | "dark";
}

export default function SearchBar({ routes, variant = "light" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return { provinces: [], routes: [] };

    const q = query.toLowerCase().trim();
    const provinces = getProvinces().filter((p) => p.toLowerCase().includes(q));
    const matchedRoutes = routes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
    );

    return { provinces, routes: matchedRoutes };
  }, [query, routes]);

  const hasResults = results.provinces.length > 0 || results.routes.length > 0;
  const showResults = isFocused && query.trim().length > 0;

  const handleProvinceClick = (province: string) => {
    router.push(`/province/${encodeURIComponent(province)}`);
    setQuery("");
    setIsFocused(false);
  };

  const handleRouteClick = (routeId: string) => {
    router.push(`/route/${routeId}`);
    setQuery("");
    setIsFocused(false);
  };

  const isDark = variant === "dark";

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索省份、线路名称或地区..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full px-6 py-4 pr-14 rounded-full text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
            isDark
              ? "bg-white text-gray-900 placeholder-gray-500"
              : "bg-white text-gray-900 placeholder-gray-500"
          }`}
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

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
            {hasResults ? (
              <div className="py-2">
                {results.provinces.length > 0 && (
                  <div>
                    <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                      省份
                    </div>
                    {results.provinces.map((province) => (
                      <button
                        key={province}
                        onClick={() => handleProvinceClick(province)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="text-gray-900 font-medium">{province}</div>
                        <div className="text-gray-500 text-sm">查看该省份所有线路</div>
                      </button>
                    ))}
                  </div>
                )}
                {results.routes.length > 0 && (
                  <div>
                    {results.provinces.length > 0 && <div className="border-t border-gray-100 my-1" />}
                    <div className="px-5 py-2 text-gray-400 text-xs uppercase tracking-widest font-medium">
                      线路
                    </div>
                    {results.routes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => handleRouteClick(route.id)}
                        className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="text-gray-900 font-medium">{route.name}</div>
                        <div className="text-gray-500 text-sm">{route.province} · {route.location}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="px-5 py-4 text-gray-500 text-sm">没有找到匹配的结果</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
