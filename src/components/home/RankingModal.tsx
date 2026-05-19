"use client";

import { useEffect } from "react";
import ProductItem from "./ProductItem";

interface Product {
  model: string;
  image: string;
  awardTitle: string;
  verdict: string;
  isWinner: boolean;
}

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  products: Product[];
  source: string;
}

export default function RankingModal({
  isOpen,
  onClose,
  title,
  icon,
  products,
  source,
}: RankingModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 获奖产品在前，非获奖在后
  const sorted = [
    ...products.filter((p) => p.isWinner),
    ...products.filter((p) => !p.isWinner),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <p className="text-xs text-gray-400">
                数据来源：{source}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="关闭"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {sorted.map((product, i) => (
            <ProductItem key={i} {...product} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 text-center">
            榜单数据来自 outdoorsmagic.com · 仅供参考
          </p>
        </div>
      </div>
    </div>
  );
}
