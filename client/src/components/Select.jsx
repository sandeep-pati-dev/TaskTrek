/**
 * Premium Reusable Select Component.
 * Supports labels, option lists, custom indicators, and validation error messages.
 */
export default function Select({
  id,
  name,
  label,
  value,
  onChange,
  options = [], // [{ value, label }]
  className = "",
  error,
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2.5 rounded bg-gray-900 border text-white text-sm transition focus-ring cursor-pointer ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-800 focus:border-blue-500"
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-gray-950">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
