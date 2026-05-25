export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">加载中...</p>
      </div>
    </div>
  );
}
