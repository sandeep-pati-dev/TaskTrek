import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Task Creation States
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Loading States for Actions (to prevent duplicate clicks)
  const [actionLoadingIds, setActionLoadingIds] = useState([]);

  // Task Edit Modal States
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", completed: false });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const handleLogout = () => {
    logout();
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
    setFormError("");
    setSuccessMessage("");

    const validationError = validateInputs(newTask.title, newTask.description);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: newTask.title.trim(),
          description: newTask.description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setTasks((prev) => [res.data, ...prev]);
      setNewTask({ title: "", description: "" });
      setSuccessMessage("Task created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (taskId, currentCompleted) => {
    // Prevent duplicate clicks
    if (actionLoadingIds.includes(taskId)) return;

    setActionLoadingIds((prev) => [...prev, taskId]);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { completed: !currentCompleted },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data : t))
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert(err.response?.data?.message || "Failed to update task status");
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (actionLoadingIds.includes(taskId)) return;
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setActionLoadingIds((prev) => [...prev, taskId]);

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setActionLoadingIds((prev) => prev.filter((id) => id !== taskId));
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
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          completed: editForm.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.data : t))
      );
      handleCloseEditModal();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-8">TaskTrek</h1>
          <p className="mb-4 text-gray-300">👋 Welcome, {user?.user?.name || "User"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Main Task Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded shadow border border-gray-700">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Total Tasks</p>
              <h3 className="text-3xl font-bold mt-1 text-white">{tasks.length}</h3>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow border border-gray-700">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Pending Tasks</p>
              <h3 className="text-3xl font-bold mt-1 text-yellow-500">
                {tasks.filter((t) => !t.completed).length}
              </h3>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow border border-gray-700">
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">Completed Tasks</p>
              <h3 className="text-3xl font-bold mt-1 text-green-500">
                {tasks.filter((t) => t.completed).length}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Task Form Panel */}
            <div className="lg:col-span-1 bg-gray-800 p-6 rounded shadow h-fit">
              <h3 className="text-xl font-bold mb-4">Create New Task</h3>
              
              {formError && (
                <div className="text-red-500 text-sm mb-3 bg-red-900/30 p-2 rounded border border-red-900/50">
                  {formError}
                </div>
              )}

              {successMessage && (
                <div className="text-green-500 text-sm mb-3 bg-green-900/30 p-2 rounded border border-green-900/50">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleFormChange}
                    placeholder="Task title"
                    required
                    className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleFormChange}
                    placeholder="Describe your task..."
                    rows="3"
                    className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-semibold text-sm transition"
                >
                  {submitting ? "Creating..." : "Add Task"}
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className="lg:col-span-3">
              {loading ? (
                <p className="text-gray-400">Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <div className="text-gray-400 bg-gray-800/30 p-8 rounded border border-dashed border-gray-700 text-center">
                  No tasks found. Go be productive! 😎
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
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
          <div className="bg-gray-800 w-full max-w-lg rounded shadow-lg border border-gray-700 text-white p-6 relative">
            <button
              onClick={handleCloseEditModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-lg"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">Edit Task</h3>

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
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm text-white"
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
                  className="w-full p-2.5 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="completed"
                  id="edit-completed"
                  checked={editForm.completed}
                  onChange={(e) => setEditForm({ ...editForm, completed: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800 bg-gray-900 border-gray-700"
                />
                <label htmlFor="edit-completed" className="text-sm text-gray-300 font-medium cursor-pointer">
                  Mark as Completed
                </label>
              </div>

              <div className="flex space-x-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition"
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
    </div>
  );
}
