import type { NextConfig } from "next";

const isCloudflareBuild = process.env.CF_PAGES === "1";

const nextConfig: NextConfig = {
  ...(isCloudflareBuild && { output: "export" }),
  turbopack: {
    root: ".",
  },
  images: {
    ...(isCloudflareBuild && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "aka.doubaocdn.com",
      },
      {
        protocol: "https",
        hostname: "p6-flow-imagex-sign.byteimg.com",
      },
      {
        protocol: "https",
        hostname: "outdoorsmagic.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "cbu01.alicdn.com",
      },
      {
        protocol: "https",
        hostname: "img14.360buyimg.com",
      },
      {
        protocol: "https",
        hostname: "contents.mediadecathlon.com",
      },
      {
        protocol: "https",
        hostname: "gd-hbimg.huaban.com",
      },
      {
        protocol: "https",
        hostname: "imgservice.suning.cn",
      },
    ],
  },
};

export default nextConfig;
