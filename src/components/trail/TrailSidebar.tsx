"use client";

import Image from "next/image";
import { Route, RouteStyleData } from "@/types/route";

interface TrailSidebarProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function TrailSidebar({ route, selectedStyle }: TrailSidebarProps) {
  return (
    <div className="hidden md:block space-y-4">
      {/* 风景缩略图 */}
      <div className="relative w-full aspect-[4/3] rounded-alltrails overflow-hidden shadow-alltrails">
        <Image
          src={route.image2 || route.image}
          alt={route.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 35vw"
        />
      </div>

      {/* 地图缩略图 */}
      <div className="relative w-full aspect-[4/3] rounded-alltrails overflow-hidden shadow-alltrails bg-gray-100">
        {/* 模拟地图 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100">
          {/* 模拟路线 */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            {/* 路线 */}
            <path
              d="M 50 250 Q 100 200 150 180 Q 200 160 250 120 Q 300 80 350 50"
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* 起点 */}
            <circle cx="50" cy="250" r="8" fill="white" stroke="#22c55e" strokeWidth="2" />
            <text x="50" y="275" textAnchor="middle" className="text-xs fill-gray-500">起点</text>
            {/* 终点 */}
            <circle cx="350" cy="50" r="8" fill="white" stroke="#22c55e" strokeWidth="2" />
            <text x="350" y="35" textAnchor="middle" className="text-xs fill-gray-500">终点</text>
            {/* 地名标注 */}
            <text x="150" y="200" className="text-xs fill-gray-400">Gorak Shep</text>
            <text x="250" y="140" className="text-xs fill-gray-400">Lobuche</text>
          </svg>
        </div>
        {/* 放大按钮 */}
        <button className="absolute bottom-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-alltrails hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
