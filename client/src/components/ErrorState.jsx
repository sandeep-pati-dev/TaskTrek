import Button from "./Button";

/**
 * Premium Reusable ErrorState Component.
 * Differentiates and displays validation, network, authentication, not found, or server errors.
 */
export default function ErrorState({
  code,
  message,
  onRetry,
  className = "",
}) {
  const getErrorDetails = () => {
    switch (code) {
      case 400:
        return {
          title: "Validation Error",
          desc: message || "Some parameters are invalid. Please check your entries.",
          color: "text-yellow-500",
        };
      case 401:
        return {
          title: "Authentication Error",
          desc: message || "Your session has expired. Please sign in again.",
          color: "text-red-500",
        };
      case 403:
        return {
          title: "Access Forbidden",
          desc: message || "You do not have permission to access this resource.",
          color: "text-red-500",
        };
      case 404:
        return {
          title: "Resource Not Found",
          desc: message || "The requested item could not be found.",
          color: "text-blue-500",
        };
      case "network":
        return {
          title: "Network Connection Issue",
          desc: message || "Unable to reach the server. Please check your internet connection.",
          color: "text-yellow-500",
        };
      default:
        return {
          title: "Unexpected Server Error",
          desc: message || "An unexpected error occurred. Please try again later.",
          color: "text-red-500",
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div
      className={`bg-gray-900 border border-gray-800 p-8 rounded-lg text-center shadow-md max-w-lg mx-auto flex flex-col items-center justify-center ${className}`}
    >
      {/* Danger/Alert SVG icon */}
      <svg
        className={`h-16 w-16 mb-4 ${details.color}`}
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h4 className="text-xl font-bold text-white mb-2">{details.title}</h4>
      <p className="text-gray-400 text-sm mb-6 max-w-sm">{details.desc}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}
