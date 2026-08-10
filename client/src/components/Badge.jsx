/**
 * Premium Reusable Badge Component.
 * Supports status variants (success, warning, danger, info, muted).
 */
export default function Badge({ children, variant = "info", className = "" }) {
  const variants = {
    success: "bg-green-950/40 text-green-400 border border-green-800/40",
    warning: "bg-yellow-950/40 text-yellow-500 border border-yellow-850/50",
    danger: "bg-red-950/40 text-red-400 border border-red-800/40",
    info: "bg-blue-950/40 text-blue-400 border border-blue-800/40",
    muted: "bg-gray-850 text-gray-400 border border-gray-750",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none ${
        variants[variant] || variants.info
      } ${className}`}
    >
      {children}
    </span>
  );
}
