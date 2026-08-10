export default function TaskCard({ task, onToggleComplete, onDelete, onEdit, isActionLoading }) {
  return (
    <div className={`bg-gray-800 p-4 rounded shadow flex flex-col justify-between h-full transition relative ${isActionLoading ? "opacity-60 pointer-events-none" : ""}`}>
      {isActionLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 rounded">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-bold ${task.completed ? "line-through text-gray-500" : "text-white"} break-words w-full mr-2`}>
            {task.title}
          </h3>
          <div className="flex space-x-2 shrink-0">
            <button
              onClick={() => onEdit(task)}
              disabled={isActionLoading}
              className="text-blue-400 hover:text-blue-300 font-medium text-sm transition"
              title="Edit Task"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              disabled={isActionLoading}
              className="text-red-500 hover:text-red-400 font-semibold text-sm transition"
              title="Delete Task"
            >
              ✕
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-4 break-words whitespace-pre-wrap">{task.description}</p>
      </div>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700">
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            task.completed ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
          }`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>
        <button
          onClick={() => onToggleComplete(task._id, task.completed)}
          disabled={isActionLoading}
          className="text-xs py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          Mark as {task.completed ? "Pending" : "Complete"}
        </button>
      </div>
    </div>
  );
}
