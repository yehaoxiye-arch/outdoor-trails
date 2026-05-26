"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchRoutes } from "@/data/routes";

interface SearchBarProps {
  variant?: "default" | "hero";
}

export default function SearchBar({ variant = "default" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchRoutes(query);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (routeId: string) => {
    router.push(`/route/${routeId}`);
    setIsOpen(false);
    setQuery("");
  };

  if (variant === "hero") {
    return (
      <div ref={containerRef} className="relative">
        <div className="h-[66px] flex items-center gap-3.5 px-[26px] rounded-full bg-white text-[#777f75]"
          style={{ boxShadow: "0 14px 28px rgba(29,31,28,.24)" }}
        >
          <svg className="w-5 h-5 flex-shrink-0 text-[#8b9688]" fill="none" viewBox="0 0 24 24">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M15 15l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            placeholder="搜索路线名称、地区或装备需求..."
            className="flex-1 bg-transparent text-[16px] text-gray-900 placeholder-[#777f75] outline-none"
          />
        </div>

        {isOpen && results.length > 0 && (
          <div className="mt-2 bg-white rounded-xl shadow-lg max-h-[320px] overflow-y-auto">
            {results.map((route) => (
              <button
                key={route.id}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                onClick={() => handleSelect(route.id)}
              >
                <div className="font-medium text-gray-900">{route.name}</div>
                <div className="text-sm text-gray-500">{route.province} · {route.location}</div>
              </button>
            ))}
          </div>
        )}

        {isOpen && query.length > 0 && results.length === 0 && (
          <div className="mt-2 bg-white rounded-xl shadow-lg p-4 text-center text-gray-500">
            未找到相关线路
          </div>
        )}
      </div>
    );
  }

  // 默认 variant（桌面端）
  return (
    <div ref={containerRef} className="relative w-full max-w-[640px] mx-auto">
      <div className="relative">
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="搜索线路名称、地区..."
          className="w-full pl-14 pr-5 py-4 text-lg text-gray-900 placeholder-gray-500 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-[320px] overflow-y-auto z-50">
          {results.map((route) => (
            <button
              key={route.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
              onClick={() => handleSelect(route.id)}
            >
              <div className="font-medium text-gray-900">{route.name}</div>
              <div className="text-sm text-gray-500">{route.province} · {route.location}</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-4 text-center text-gray-500 z-50">
          未找到相关线路
        </div>
      )}
    </div>
  );
}
