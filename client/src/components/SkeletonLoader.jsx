export default function SkeletonLoader() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-gray-900 p-5 rounded-lg border border-gray-800 h-[190px] flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              {/* Title Skeleton */}
              <div className="h-5 bg-gray-850 rounded w-2/3"></div>
              {/* Actions Skeleton */}
              <div className="flex space-x-2">
                <div className="h-7 w-7 bg-gray-850 rounded"></div>
                <div className="h-7 w-7 bg-gray-850 rounded"></div>
              </div>
            </div>
            {/* Description lines Skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-3.5 bg-gray-850 rounded w-full"></div>
              <div className="h-3.5 bg-gray-850 rounded w-4/5"></div>
            </div>
          </div>
          {/* Footer Skeleton */}
          <div className="flex flex-col space-y-2.5 pt-3 border-t border-gray-850">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-850 rounded w-24"></div>
              <div className="h-5 bg-gray-850 rounded-full w-16"></div>
            </div>
            <div className="h-8 bg-gray-850 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
