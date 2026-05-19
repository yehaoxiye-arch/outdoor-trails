import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  light?: boolean;
}

export default function Breadcrumb({ items, light = false }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center gap-2 text-sm ${light ? "text-white/80" : "text-gray-500"}`}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className={`transition-colors ${
                light ? "hover:text-white" : "hover:text-primary-500"
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${light ? "text-white" : "text-gray-900"}`}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
