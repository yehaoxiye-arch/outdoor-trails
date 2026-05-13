import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "径迹 - 探索中国最美户外线路",
  description:
    "发现中国经典户外徒步路线，获取专业装备推荐和实时天气信息。从西藏冈仁波齐到云南虎跳峡，开启你的户外探险之旅。",
  keywords: [
    "户外徒步",
    "登山",
    "探险",
    "中国线路",
    "装备推荐",
    "天气查询",
  ],
  authors: [{ name: "径迹" }],
  openGraph: {
    title: "径迹 - 探索中国最美户外线路",
    description:
      "发现中国经典户外徒步路线，获取专业装备推荐和实时天气信息。",
    type: "website",
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
