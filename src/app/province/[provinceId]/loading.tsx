export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="h-16 bg-white shadow-sm" />
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
