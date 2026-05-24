import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  images: {
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
