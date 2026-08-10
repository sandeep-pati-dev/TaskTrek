import Loader from "./Loader";

/**
 * Premium Reusable Button Component.
 * Supports primary, secondary, danger, and text styles.
 */
export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ariaLabel,
}) {
  const baseStyle =
    "inline-flex items-center justify-center rounded font-semibold transition focus-ring disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-transparent shadow-sm",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 shadow-sm",
    danger: "bg-red-650 hover:bg-red-700 text-white border border-transparent shadow-sm",
    text: "text-blue-400 hover:text-blue-300 bg-transparent hover:bg-gray-850 p-1.5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {loading ? (
        <span className="flex items-center space-x-1.5">
          <Loader size="sm" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
