"use client";

import { RouteStyle } from "@/types/route";

interface RouteSelectorProps {
  styles: RouteStyle[];
  selectedStyle: RouteStyle;
  onStyleChange: (style: RouteStyle) => void;
}

export default function RouteSelector({ styles, selectedStyle, onStyleChange }: RouteSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {styles.map((style) => (
        <button
          key={style}
          onClick={() => onStyleChange(style)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStyle === style
              ? "bg-primary-500 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-primary-500"
          }`}
        >
          {style}
        </button>
      ))}
    </div>
  );
}
