export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 border-b border-gray-200" />
      <div className="max-w-[1280px] mx-auto px-4 pt-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-px bg-gray-200 mb-6" />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:flex-[65] space-y-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full md:flex-[35] space-y-4">
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
