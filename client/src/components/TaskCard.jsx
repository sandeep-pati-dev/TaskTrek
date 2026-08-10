import Badge from "./Badge";
import Button from "./Button";

/**
 * Premium Task Card Component.
 * Visually communicates title, description, status, date, and actions.
 * Enforces strong keyboard accessibility and screen reader support.
 */
export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  isActionLoading,
}) {
  // Format creation date nicely (e.g. Aug 10, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div
      className={`bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-800 flex flex-col justify-between h-full transition relative group hover:border-gray-700 ${
        task.completed ? "opacity-75" : ""
      } ${isActionLoading ? "opacity-60 pointer-events-none" : ""}`}
    >
      {isActionLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/40 rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3
            className={`text-h3 font-bold ${
              task.completed ? "line-through text-gray-500" : "text-white"
            } break-words w-full mr-2`}
          >
            {task.title}
          </h3>
          <div className="flex space-x-1.5 shrink-0">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(task)}
              disabled={isActionLoading}
              aria-label={`Edit task: ${task.title}`}
              className="text-gray-400 hover:text-blue-400 p-1.5 rounded hover:bg-gray-800 transition focus-ring"
            >
              <svg
                className="w-4 h-4"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            {/* Delete Button */}
            <button
              onClick={() => onDelete(task._id)}
              disabled={isActionLoading}
              aria-label={`Delete task: ${task.title}`}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded hover:bg-gray-800 transition focus-ring"
            >
              <svg
                className="w-4 h-4"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <p
          className={`text-small mb-4 break-words whitespace-pre-wrap leading-relaxed ${
            task.completed ? "text-gray-500" : "text-gray-300"
          }`}
        >
          {task.description || "No description provided."}
        </p>
      </div>

      <div className="flex flex-col space-y-3 mt-auto pt-3 border-t border-gray-850">
        <div className="flex justify-between items-center">
          <span className="text-caption text-gray-500 font-medium">
            Created: {formatDate(task.createdAt)}
          </span>
          <Badge variant={task.completed ? "success" : "warning"}>
            {task.completed ? "Completed" : "Pending"}
          </Badge>
        </div>

        <Button
          onClick={() => onToggleComplete(task._id, task.completed)}
          disabled={isActionLoading}
          variant={task.completed ? "secondary" : "primary"}
          size="sm"
          className="w-full text-xs"
          ariaLabel={
            task.completed
              ? `Mark task "${task.title}" as pending`
              : `Mark task "${task.title}" as complete`
          }
        >
          {task.completed ? (
            <span className="flex items-center justify-center space-x-1.5">
              <svg
                className="w-3.5 h-3.5"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5"
                />
              </svg>
              <span>Mark as Pending</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Mark as Complete</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
