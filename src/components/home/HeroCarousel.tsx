"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  {
    src: "https://p6-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/269851fc9f1d4446bb19490e0afa5571.jpg~tplv-a9rns2rl98-image.image?lk3s=8e244e95&rcl=202605240108178C90385715D63BF0B315&rrcfp=935dee89&x-expires=1780160898&x-signature=KwNGcFUvEPLSr6we8JbuKvsVjf0%3D",
    alt: "户外风景",
  },
  {
    src: "https://aka.doubaocdn.com/s/KQiE1wTNXl",
    alt: "户外风景",
  },
  {
    src: "https://aka.doubaocdn.com/s/qLOy1wTNXl",
    alt: "户外风景",
  },
  {
    src: "https://aka.doubaocdn.com/s/cgkK1wTNXl",
    alt: "户外风景",
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* 左右箭头（桌面端悬停显示） */}
      <button
        onClick={goToPrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
        aria-label="上一张"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
        aria-label="下一张"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 右下角圆点指示器 */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`切换到第${index + 1}张图片`}
          />
        ))}
      </div>
    </div>
  );
}
