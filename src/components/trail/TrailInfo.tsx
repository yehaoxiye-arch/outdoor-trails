"use client";

import { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StatsBar from "./StatsBar";
import RouteSelector from "./RouteSelector";
import { Route, RouteStyleData, RouteStyle } from "@/types/route";

interface TrailInfoProps {
  route: Route;
  selectedStyle: RouteStyleData;
}

export default function TrailInfo({ route, selectedStyle }: TrailInfoProps) {
  const [currentStyle, setCurrentStyle] = useState<RouteStyleData>(selectedStyle);

  const handleStyleChange = (style: RouteStyle) => {
    const newStyle = route.styles.find((s) => s.name === style);
    if (newStyle) {
      setCurrentStyle(newStyle);
    }
  };

  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: route.province, href: `/province/${route.province}` },
    { label: route.name },
  ];

  return (
    <div className="mb-8">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {route.name}
      </h1>

      <p className="text-gray-500 mb-4">
        {route.location}
      </p>

      <div className="mb-6">
        <RouteSelector
          styles={route.styles.map((s) => s.name)}
          selectedStyle={currentStyle.name}
          onStyleChange={handleStyleChange}
        />
      </div>

      <StatsBar
        distance={currentStyle.distance}
        duration={currentStyle.duration}
        altitude={currentStyle.altitude}
        difficulty={currentStyle.difficulty}
      />

      <div className="mt-6">
        <p className="text-gray-700 leading-relaxed">
          {currentStyle.description}
        </p>
      </div>
    </div>
  );
}
