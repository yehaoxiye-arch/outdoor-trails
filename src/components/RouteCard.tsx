import Link from "next/link";
import Image from "next/image";
import { Route } from "@/types/route";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const defaultStyle = route.styles[0];

  return (
    <Link
      href={`/route/${route.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={route.image}
          alt={route.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              defaultStyle?.difficulty === "简单"
                ? "bg-green-100 text-green-800"
                : defaultStyle?.difficulty === "中等"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {defaultStyle?.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1">
          {route.name}
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          {route.province} · {route.location}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{defaultStyle?.altitude}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{defaultStyle?.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>{defaultStyle?.distance}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
