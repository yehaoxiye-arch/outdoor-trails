"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchRoutes } from "@/data/routes";
import SearchInput from "@/components/ui/SearchInput";

export default function SearchBar() {
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

  return (
    <div ref={containerRef} className="relative w-full max-w-[640px] mx-auto">
      <SearchInput
        placeholder="搜索线路名称、地区..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg max-h-[320px] overflow-y-auto">
          {results.map((route) => (
            <button
              key={route.id}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              onClick={() => handleSelect(route.id)}
            >
              <div className="font-medium text-gray-900">{route.name}</div>
              <div className="text-sm text-gray-500">
                {route.province} · {route.location}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg p-4 text-center text-gray-500">
          未找到相关线路
        </div>
      )}
    </div>
  );
}
