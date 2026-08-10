/**
 * Premium Reusable Textarea Component.
 * Supports labels, sizing heights, and validation error messages.
 */
export default function Textarea({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 3,
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
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-3 rounded bg-gray-900 border text-white text-sm transition placeholder-gray-600 focus-ring ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-800 focus:border-blue-500"
        } resize-none`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
