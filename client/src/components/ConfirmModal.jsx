import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-lg shadow-lg border border-gray-800 text-white p-6 relative">
        <div className="flex items-center space-x-3 mb-4">
          {/* Warning SVG Icon */}
          <div className="bg-red-950/20 p-2.5 rounded-full border border-red-900/30 shrink-0">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{title || "Are you sure?"}</h3>
        </div>

        <p className="text-gray-400 text-sm mb-6 break-words leading-relaxed">
          {message || "This action cannot be undone."}
        </p>

        <div className="flex space-x-3 justify-end">
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            variant="secondary"
            size="md"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={isSubmitting}
            variant="danger"
            size="md"
          >
            {confirmText || "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
