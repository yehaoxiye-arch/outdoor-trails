"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchRoutes } from "@/data/routes";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; location: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const searchResults = searchRoutes(value.trim());
      setResults(searchResults.slice(0, 8)); // 最多显示8条
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (routeId: string) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    router.push(`/route/${routeId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative flex-1 max-w-md mx-8">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="搜索线路"
          className="w-full h-10 pl-10 pr-4 bg-gray-100 rounded-full text-sm text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
        />
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-alltrails shadow-lg border border-gray-200 overflow-hidden z-50"
        >
          {results.map((route) => (
            <button
              key={route.id}
              onClick={() => handleSelect(route.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-sm font-medium text-text-primary group-hover:text-primary-500">
                  {route.name}
                </div>
                <div className="text-xs text-text-secondary">{route.location}</div>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {isOpen && query.trim() && results.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-alltrails shadow-lg border border-gray-200 p-4 z-50"
        >
          <p className="text-sm text-text-secondary text-center">未找到相关线路</p>
        </div>
      )}
    </div>
  );
}
