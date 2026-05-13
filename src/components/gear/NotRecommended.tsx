interface NotRecommendedProps {
  items: { category: string; reason: string }[];
}

export default function NotRecommended({ items }: NotRecommendedProps) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="font-semibold text-gray-900 mb-3">不推荐</h4>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">
              <span className="text-gray-700">{item.category}</span>
              {" — "}
              {item.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
