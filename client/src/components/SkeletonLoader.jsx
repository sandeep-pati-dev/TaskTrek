export default function SkeletonLoader() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-gray-800 p-4 rounded shadow border border-gray-700 h-44 flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-700 rounded w-2/3"></div>
              {/* Actions Skeleton */}
              <div className="flex space-x-2">
                <div className="h-4 bg-gray-700 rounded w-8"></div>
                <div className="h-4 bg-gray-700 rounded w-4"></div>
              </div>
            </div>
            {/* Description lines Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
          {/* Footer Skeleton */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <div className="h-5 bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
