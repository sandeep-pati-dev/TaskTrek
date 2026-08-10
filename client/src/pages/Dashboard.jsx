import { useEffect, useState, useCallback } from "react";
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
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Button from "../components/Button";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);

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

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setErrorState(null);
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      const code = err.response?.status || (err.message === "Network Error" ? "network" : 500);
      const message = err.response?.data?.message;
      setErrorState({ code, message });
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      return "Title is required.";
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

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "Alphabetical (A-Z)" },
  ];

  return (
    <div className="min-h-screen bg-bg-app text-white flex flex-col">
      {/* Top navigation */}
      <header className="bg-bg-surface border-b border-border-ui px-4 md:px-8 py-4 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center space-x-2.5">
          <svg
            className="w-7 h-7 text-blue-500"
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-xl font-black tracking-wide text-white">TaskTrek</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-small text-text-muted hidden sm:inline">
            Active User: <span className="text-white font-semibold">{user?.user?.name}</span>
          </span>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            ariaLabel="Logout from account"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Workspace layout wrapper */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Welcome / Quick action Greeting header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-850 pb-4">
          <div>
            <h2 className="text-h1 tracking-tight text-white">Workspace</h2>
            <p className="text-small text-text-muted mt-1 leading-relaxed">
              Plan, execute, and monitor your personal tasks and progress indices.
            </p>
          </div>
          <Button
            onClick={focusTitleInput}
            variant="primary"
            size="sm"
            className="w-fit cursor-pointer shrink-0"
          >
            Quick Create
          </Button>
        </div>

        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-surface p-5 rounded-lg border border-border-ui shadow-sm flex flex-col justify-between">
            <span className="text-caption text-text-muted font-bold uppercase tracking-wider">
              Total Tasks
            </span>
            <span className="text-display mt-2 text-white">{tasks.length}</span>
          </div>
          <div className="bg-bg-surface p-5 rounded-lg border border-border-ui shadow-sm flex flex-col justify-between">
            <span className="text-caption text-yellow-500 font-bold uppercase tracking-wider">
              Pending
            </span>
            <span className="text-display mt-2 text-yellow-500">
              {tasks.filter((t) => !t.completed).length}
            </span>
          </div>
          <div className="bg-bg-surface p-5 rounded-lg border border-border-ui shadow-sm flex flex-col justify-between">
            <span className="text-caption text-green-400 font-bold uppercase tracking-wider">
              Completed
            </span>
            <span className="text-display mt-2 text-green-400">
              {tasks.filter((t) => t.completed).length}
            </span>
          </div>
        </div>

        {/* Task Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Create Task Form Panel */}
          <div className="lg:col-span-1 bg-bg-surface p-6 rounded-lg border border-border-ui shadow-sm h-fit">
            <h3 className="text-h3 font-bold mb-5 border-b border-border-ui pb-2.5 text-white">
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <Input
                id="task-title-input"
                name="title"
                label="Task Title *"
                type="text"
                value={newTask.title}
                onChange={handleFormChange}
                placeholder="E.g. Refactor API layer"
                required
              />

              <Textarea
                id="task-description-input"
                name="description"
                label="Description"
                value={newTask.description}
                onChange={handleFormChange}
                placeholder="Details or specific checklist items..."
                rows={3}
              />

              <Button
                type="submit"
                loading={submitting}
                variant="primary"
                size="md"
                className="w-full"
              >
                Create Task
              </Button>
            </form>
          </div>

          {/* Task Filters & Task Card Grid list */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Filter controls headers bar */}
            <div className="bg-bg-surface p-4 rounded-lg border border-border-ui shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar Input */}
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded bg-gray-950 border border-gray-800 focus:outline-none focus:border-blue-500 text-white placeholder-gray-600 transition focus-ring"
                />
              </div>

              {/* Status and Sort selectors */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-end">
                <div className="flex items-center space-x-2 shrink-0">
                  <Select
                    id="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={filterOptions}
                    className="w-[130px]"
                  />
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Select
                    id="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    options={sortOptions}
                    className="w-[160px]"
                  />
                </div>
              </div>
            </div>

            {/* Content states switcher */}
            {loading ? (
              <SkeletonLoader />
            ) : errorState ? (
              <ErrorState
                code={errorState.code}
                message={errorState.message}
                onRetry={fetchTasks}
              />
            ) : filteredTasks.length === 0 ? (
              <EmptyState
                title="No tasks match your query"
                message={
                  searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filter selectors or search keywords."
                    : "Your workspace is empty. Create a task to outline your day."
                }
                actionText={!searchQuery && statusFilter === "all" ? "Add First Task" : null}
                onActionClick={focusTitleInput}
              />
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
      </main>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-surface w-full max-w-lg rounded-lg shadow-lg border border-border-ui text-white p-6 relative">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-lg cursor-pointer"
              aria-label="Close edit task modal"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2.5">
              Edit Task
            </h3>

            {editError && (
              <p className="text-red-500 text-sm mb-3 bg-red-900/30 p-2 rounded border border-red-900/50">
                {editError}
              </p>
            )}

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <Input
                id="edit-title-input"
                name="title"
                label="Task Title *"
                type="text"
                value={editForm.title}
                onChange={handleEditFormChange}
                required
                placeholder="E.g. Refactor API layer"
              />

              <Textarea
                id="edit-description-input"
                name="description"
                label="Description"
                value={editForm.description}
                onChange={handleEditFormChange}
                placeholder="Brief details about the task..."
                rows={4}
              />

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
                <Button
                  onClick={handleCloseEditModal}
                  variant="secondary"
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={editSubmitting}
                  variant="primary"
                  size="md"
                >
                  Save Changes
                </Button>
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
