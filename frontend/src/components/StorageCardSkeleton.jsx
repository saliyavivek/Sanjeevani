export default function StorageCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="py-4 px-1 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />

        {/* Listed by skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />

        {/* Status skeleton */}
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}
