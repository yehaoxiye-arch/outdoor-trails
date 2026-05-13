import Link from "next/link";

interface HeaderProps {
  showBack?: boolean;
  transparent?: boolean;
}

export default function Header({ showBack = false, transparent = false }: HeaderProps) {
  return (
    <header
      className={
        transparent
          ? "bg-transparent"
          : "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
      }
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        {showBack ? (
          <Link
            href="/"
            className={`flex items-center gap-2 transition-colors ${
              transparent
                ? "text-white/80 hover:text-white"
                : "text-gray-600 hover:text-primary-500"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回</span>
          </Link>
        ) : (
          <div />
        )}
        <Link
          href="/"
          className={`font-semibold ${
            transparent ? "text-white" : "text-primary-500"
          }`}
        >
          径迹
        </Link>
      </div>
    </header>
  );
}
