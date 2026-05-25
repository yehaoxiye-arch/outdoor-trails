import Link from "next/link";

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
  backText?: string;
}

export default function Header({
  showBackButton = false,
  backUrl = "/",
  backText = "返回",
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-green-800 hover:text-green-900 transition-colors"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-xl font-bold tracking-tight">径迹</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-green-700 font-medium text-sm transition-colors"
          >
            探索线路
          </Link>
        </nav>
      </div>
    </header>
  );
}
