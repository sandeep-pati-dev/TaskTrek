import Button from "./Button";

/**
 * Premium Reusable EmptyState Component.
 * Displays a clean SVG graphic, message header, descriptive explanation, and optional action buttons.
 */
export default function EmptyState({
  title = "No data found",
  message = "Try modifying your parameters or adding a new record.",
  actionText,
  onActionClick,
  className = "",
}) {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 p-12 rounded-lg text-center shadow-sm flex flex-col items-center justify-center ${className}`}
    >
      {/* SVG Icon checklist */}
      <svg
        className="h-20 w-20 text-gray-700 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 14l2 2 4-4"
        />
      </svg>
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">{message}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
}
