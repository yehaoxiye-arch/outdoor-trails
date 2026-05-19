"use client";

import Image from "next/image";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface TrailHeroProps {
  image: string;
  alt: string;
  name: string;
  location: string;
  province: string;
}

export default function TrailHero({ image, alt, name, location, province }: TrailHeroProps) {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: province, href: `/province/${province}` },
    { label: name },
  ];

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh]">
      {/* 背景图片 */}
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

      {/* 顶部导航 - 面包屑 */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbItems} light />
        </div>
      </div>

      {/* 右上角操作按钮 */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>

      {/* 底部标题信息 */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 pb-6">
          {/* 路线类型标签 */}
          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700">
              环线
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {name}
          </h1>

          {/* 位置信息 */}
          <p className="text-white/90 text-lg drop-shadow-md">
            {location}
          </p>
        </div>
      </div>
    </div>
  );
}
