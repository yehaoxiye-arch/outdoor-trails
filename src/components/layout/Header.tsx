import Link from "next/link";

interface HeaderProps {
  showBack?: boolean;
}

export default function Header({ showBack = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        {showBack ? (
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回</span>
          </Link>
        ) : (
          <div />
        )}
        <Link href="/" className="text-primary-500 font-semibold">
          径迹
        </Link>
      </div>
    </header>
  );
}
