import { Product } from "@/types/product";

interface EquipmentListProps {
  products: Product[];
}

export default function EquipmentList({ products }: EquipmentListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-bold mb-4">装备推荐</h3>
        <p className="text-gray-500 text-sm">
          选择出发日期后，系统将根据线路条件和天气预报为您生成个性化装备清单。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-bold mb-4">装备推荐</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {product.brand} {product.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {product.scenarios.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
