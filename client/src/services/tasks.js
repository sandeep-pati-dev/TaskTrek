import api from "./api";

/**
 * Fetches all tasks for the logged-in user.
 * @returns {Promise<Array>} - List of tasks
 */
export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

/**
 * Creates a new task.
 * @param {Object} taskData - { title, description }
 * @returns {Promise<Object>} - The created task
 */
export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

/**
 * Updates task details (title, description, completed status).
 * @param {String} taskId - ID of the task to update
 * @param {Object} updates - Task attributes to change
 * @returns {Promise<Object>} - The updated task
 */
export const updateTask = async (taskId, updates) => {
  const res = await api.put(`/tasks/${taskId}`, updates);
  return res.data;
};

/**
 * Toggles a task's completion status.
 * @param {String} taskId - ID of the task
 * @param {Boolean} currentCompleted - Current completed state
 * @returns {Promise<Object>} - The updated task
 */
export const toggleTaskCompletion = async (taskId, currentCompleted) => {
  return updateTask(taskId, { completed: !currentCompleted });
};

/**
 * Deletes a task.
 * @param {String} taskId - ID of the task to delete
 * @returns {Promise<Object>} - Confirmation message
 */
export const deleteTask = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};
