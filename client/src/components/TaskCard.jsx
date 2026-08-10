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
      className={`bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg border border-gray-700 hover:border-gray-600 flex flex-col justify-between h-full transition relative ${
        isActionLoading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {isActionLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3
            className={`text-lg font-bold ${
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
              className="text-gray-400 hover:text-blue-400 p-1.5 rounded hover:bg-gray-700 transition"
              title="Edit Task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-gray-700 transition"
              title="Delete Task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
        <p className="text-sm text-gray-300 mb-4 break-words whitespace-pre-wrap leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </div>

      <div className="flex flex-col space-y-3 mt-auto pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Created: {formatDate(task.createdAt)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              task.completed
                ? "bg-green-900/30 text-green-400 border border-green-800/50"
                : "bg-yellow-900/30 text-yellow-500 border border-yellow-800/50"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>

        <button
          onClick={() => onToggleComplete(task._id, task.completed)}
          disabled={isActionLoading}
          className={`w-full text-xs py-2 px-3 rounded font-medium transition flex items-center justify-center space-x-1.5 ${
            task.completed
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {task.completed ? (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5"
                />
              </svg>
              <span>Mark as Pending</span>
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Mark as Complete</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
