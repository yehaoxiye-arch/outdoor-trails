import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const specs = product.specs as any;

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className="w-15 h-15 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">
          {product.brand} {product.name}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {specs.waterproof && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
              {specs.waterproofRating || "防水"}
            </span>
          )}
          {specs.ankleSupport && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {specs.ankleSupport === "high" ? "高帮" : specs.ankleSupport === "mid" ? "中帮" : "低帮"}
            </span>
          )}
          {specs.weight && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
              {specs.weight}g
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.maintenanceTips?.[0] || product.scenarios.join(" · ")}
        </p>
      </div>
    </div>
  );
}
