"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductItemProps {
  model: string;
  image: string;
  awardTitle?: string;
  verdict?: string;
  isWinner: boolean;
}

export default function ProductItem({
  model,
  image,
  awardTitle,
  verdict,
  isWinner,
}: ProductItemProps) {
  const [imgError, setImgError] = useState(false);

  const match = model.match(/^(.+?)（(.+?)）$/);
  const englishName = match ? match[1] : model;
  const chineseName = match ? match[2] : "";

  return (
    <div className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
        {image && !imgError ? (
          <Image
            src={image}
            alt={englishName}
            fill
            className="object-contain"
            sizes="80px"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
          {englishName}
        </h4>
        {chineseName && (
          <p className="text-xs text-gray-500 mt-0.5">{chineseName}</p>
        )}

        {isWinner && awardTitle ? (
          <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
            {awardTitle}
          </span>
        ) : verdict ? (
          <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
            &ldquo;{verdict}&rdquo;
          </p>
        ) : null}
      </div>
    </div>
  );
}
