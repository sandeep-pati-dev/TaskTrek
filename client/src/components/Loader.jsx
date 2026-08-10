export default function Loader({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status">
      <div
        className={`animate-spin rounded-full border-gray-700 border-t-blue-500 ${
          sizeClasses[size] || sizeClasses.md
        }`}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
