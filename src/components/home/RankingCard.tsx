"use client";

import { useState } from "react";
import RankingModal from "./RankingModal";

interface Product {
  model: string;
  image: string;
  awardTitle: string;
  verdict: string;
  isWinner: boolean;
}

interface RankingCardProps {
  id: string;
  title: string;
  icon: string;
  products: Product[];
  source: string;
  url: string;
}

export default function RankingCard({
  id,
  title,
  icon,
  products,
  source,
  url,
}: RankingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group text-left w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center pt-16 pb-12 px-6">
          <span className="text-base text-gray-400 tracking-widest mb-2">2026年</span>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight text-center">
            {title.replace(/^2026年/, "")}
          </h3>
          <span className="text-xs text-primary-500 font-medium mt-3 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            查看榜单 &rarr;
          </span>
        </div>
      </button>

      <RankingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        icon={icon}
        products={products}
        source={source}
      />
    </>
  );
}
