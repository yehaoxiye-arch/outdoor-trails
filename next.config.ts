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
    ],
  },
};

export default nextConfig;
