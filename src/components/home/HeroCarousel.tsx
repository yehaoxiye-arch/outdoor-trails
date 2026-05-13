"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    alt: "山脉全景",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
    alt: "山峰",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80",
    alt: "雪山",
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
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
    </div>
  );
}
