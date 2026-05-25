import Link from "next/link";
import SearchBar from "./SearchBar";

interface HeaderProps {
  showBack?: boolean;
  transparent?: boolean;
}

export default function Header({ showBack = false, transparent = false }: HeaderProps) {
  return (
    <header
      className={`h-16 bg-white ${transparent ? "" : "border-b border-gray-200"}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* 左侧：Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <svg className="w-8 h-8 text-primary-500" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 2L4 28h24L16 2zm0 8l8 16H8l8-16z" />
          </svg>
          <span className="text-xl font-bold text-text-primary">径迹</span>
        </Link>

        {/* 中间：搜索框 */}
        <div className="flex-1 mx-4 max-w-md">
          <SearchBar />
        </div>

        {/* 右侧：返回按钮或占位 */}
        {showBack ? (
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden md:inline">返回</span>
          </Link>
        ) : (
          <div className="w-10 flex-shrink-0" />
        )}
      </div>
    </header>
  );
}
