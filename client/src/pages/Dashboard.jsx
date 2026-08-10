import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
} from "../services/tasks";
import TaskCard from "../components/TaskCard";
import SkeletonLoader from "../components/SkeletonLoader";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Task Creation States
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  // Loading States for Actions (to prevent duplicate clicks)
  const [actionLoadingIds, setActionLoadingIds] = useState([]);

  // Task Edit Modal States
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", completed: false });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Confirmation States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        // Map common errors
        if (err.response?.status === 401) {
          toast.error("Session expired. Please sign in again.");
          logout();
          navigate("/login");
        } else {
          toast.error("Could not load tasks. Please verify your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, logout, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
    navigate("/login");
  };

  const handleFormChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Central Input Validator
  const validateInputs = (title, description) => {
    if (!title || !title.trim()) {
      return "Title is required and cannot be empty.";
    }
    if (title.length > 100) {
      return "Title cannot exceed 100 characters.";
    }
    if (description && description.length > 500) {
      return "Description cannot exceed 500 characters.";
    }
    return null;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const validationError = validateInputs(newTask.title, newTask.description);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const data = await createTask({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
      });
      setTasks((prev) => [data, ...prev]);
      setNewTask({ title: "", description: "" });
      toast.success("Task created successfully!");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to create task.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId, currentCompleted) => {
    if (actionLoadingIds.includes(taskId)) return;

    setActionLoadingIds((prev) => [...prev, taskId]);

    try {
      const data = await toggleTaskCompletion(taskId, currentCompleted);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data : t))
      );
      toast.success(data.completed ? "Task completed!" : "Task set to pending.");
    } catch (err) {
      console.error("Failed to update task status:", err);
      toast.error(err.response?.data?.message || "Failed to update task status.");
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleDeleteTrigger = (taskId) => {
    setDeleteTargetId(taskId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteSubmitting(true);

    try {
      await deleteTask(deleteTargetId);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTargetId));
      toast.success("Task deleted successfully.");
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error(err.response?.data?.message || "Failed to delete task.");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Modal actions
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      completed: task.completed,
    });
    setEditError("");
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
    setEditForm({ title: "", description: "", completed: false });
    setEditError("");
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setEditError("");

    const validationError = validateInputs(editForm.title, editForm.description);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    setEditSubmitting(true);

    try {
      const data = await updateTask(editingTask._id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        completed: editForm.completed,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? data : t))
      );
      toast.success("Task updated successfully!");
      handleCloseEditModal();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const focusTitleInput = () => {
    const input = document.getElementById("task-title-input");
    if (input) input.focus();
  };

  // Client-Side Search, Filter, and Sort logic
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (statusFilter === "pending") return matchesSearch && !task.completed;
      if (statusFilter === "completed") return matchesSearch && task.completed;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      // default: newest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-white">
      {/* Sidebar navigation */}
      <div className="w-full md:w-64 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-800 p-6 flex flex-row md:flex-col justify-between items-center md:items-stretch shrink-0">
        <div className="md:w-full">
          <div className="flex items-center space-x-2 mb-0 md:mb-8">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
              TaskTrek
            </h1>
          </div>
          <p className="hidden md:block text-sm text-gray-400 mt-2">
            👋 Welcome, <span className="text-white font-semibold">{user?.user?.name || "User"}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4 md:space-x-0 md:w-full">
          <p className="md:hidden text-sm text-gray-400">
            👋 <span className="text-white font-semibold">{user?.user?.name || "User"}</span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-red-900/40 hover:text-red-400 border border-gray-700 hover:border-red-900/50 text-gray-300 py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm font-semibold transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Task Area */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Greeting & Summary Banner */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h2>
            <p className="text-gray-400 text-sm">
              Keep track of your projects and goals dynamically.
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-850 shadow-sm">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">
                Total Tasks
              </p>
              <h3 className="text-3xl font-black mt-1 text-white">{tasks.length}</h3>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-850 shadow-sm">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">
                Pending Tasks
              </p>
              <h3 className="text-3xl font-black mt-1 text-yellow-500">
                {tasks.filter((t) => !t.completed).length}
              </h3>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-850 shadow-sm">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">
                Completed Tasks
              </p>
              <h3 className="text-3xl font-black mt-1 text-green-500">
                {tasks.filter((t) => t.completed).length}
              </h3>
            </div>
          </div>

          {/* Workspace Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Create Task Panel */}
            <div className="lg:col-span-1 bg-gray-900 p-6 rounded-lg border border-gray-850 shadow-sm h-fit">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">
                Create New Task
              </h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label
                    htmlFor="task-title-input"
                    className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id="task-title-input"
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleFormChange}
                    placeholder="E.g. Code database index"
                    required
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 focus:outline-none focus:border-blue-500 text-sm text-white transition placeholder-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="task-description-input"
                    className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="task-description-input"
                    name="description"
                    value={newTask.description}
                    onChange={handleFormChange}
                    placeholder="Brief notes about the task..."
                    rows="3"
                    className="w-full p-2.5 rounded bg-gray-950 border border-gray-800 focus:outline-none focus:border-blue-500 text-sm text-white transition placeholder-gray-700 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold text-sm transition flex items-center justify-center space-x-1"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Add Task</span>
                  )}
                </button>
              </form>
            </div>

            {/* Task Controls & Task Grid List */}
            <div className="lg:col-span-3">
              {/* Filter controls, sorting and search bar */}
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-850 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search query input */}
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by title or details..."
                    className="w-full pl-9 pr-4 py-2 rounded bg-gray-950 border border-gray-800 focus:outline-none focus:border-blue-500 text-sm text-white placeholder-gray-700 transition"
                  />
                </div>

                {/* Filters and sorting order dropdown select components */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <label htmlFor="filter-select" className="text-xs font-semibold text-gray-400">
                      Filter:
                    </label>
                    <select
                      id="filter-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-2 rounded bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending Only</option>
                      <option value="completed">Completed Only</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <label htmlFor="sort-select" className="text-xs font-semibold text-gray-400">
                      Sort:
                    </label>
                    <select
                      id="sort-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="p-2 rounded bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="alphabetical">Alphabetical (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks List Grid */}
              {loading ? (
                <SkeletonLoader />
              ) : filteredTasks.length === 0 ? (
                <div className="bg-gray-900 border border-gray-850 p-12 rounded-lg text-center shadow-sm">
                  {/* Clean SVG Illustration (Empty State) */}
                  <svg
                    className="mx-auto h-20 w-20 text-gray-700 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <h4 className="text-xl font-bold text-white mb-2">No tasks to show</h4>
                  <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                    {searchQuery || statusFilter !== "all"
                      ? "Try tweaking your filter selections or search terms."
                      : "Create your first task on the left panel to begin your journey."}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={focusTitleInput}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition cursor-pointer"
                    >
                      Create a Task
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTrigger}
                      onEdit={handleOpenEditModal}
                      isActionLoading={actionLoadingIds.includes(task._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 w-full max-w-lg rounded-lg shadow-lg border border-gray-700 text-white p-6 relative">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              Edit Task
            </h3>

            {editError && (
              <p className="text-red-500 text-sm mb-3 bg-red-900/30 p-2 rounded border border-red-900/50">
                {editError}
              </p>
            )}

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  placeholder="Task title"
                  required
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-750 focus:outline-none focus:border-blue-500 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  placeholder="Describe your task..."
                  rows="4"
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-750 focus:outline-none focus:border-blue-500 text-sm text-white resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="completed"
                  id="edit-completed"
                  checked={editForm.completed}
                  onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 bg-gray-900 border-gray-700 cursor-pointer"
                />
                <label
                  htmlFor="edit-completed"
                  className="text-sm text-gray-300 font-medium cursor-pointer"
                >
                  Mark as Completed
                </label>
              </div>

              <div className="flex space-x-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-650 text-white rounded text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold text-sm transition"
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Confirm Delete"
        isSubmitting={deleteSubmitting}
      />
    </div>
  );
}
