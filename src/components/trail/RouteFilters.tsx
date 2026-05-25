"use client";

import { useState } from "react";

const filters = [
  { id: "difficulty", label: "难度" },
  { id: "distance", label: "距离" },
  { id: "duration", label: "时长" },
  { id: "altitude", label: "海拔" },
];

export default function RouteFilters() {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string) => {
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => handleClick(f.id)}
          className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
            active === f.id
              ? "bg-green-700 text-white border-green-700"
              : "bg-white border-gray-300 text-gray-700 hover:border-green-500"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
