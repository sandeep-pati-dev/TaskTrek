import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required and cannot be empty" });
    }
    if (title.length > 100) {
      return res.status(400).json({ message: "Title cannot exceed 100 characters" });
    }
    if (description && typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ message: "Description cannot exceed 500 characters" });
    }

    const task = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Title must be a non-empty string" });
      }
      if (title.length > 100) {
        return res.status(400).json({ message: "Title cannot exceed 100 characters" });
      }
      updates.title = title.trim();
    }
    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return res.status(400).json({ message: "Description must be a string" });
      }
      if (description && description.length > 500) {
        return res.status(400).json({ message: "Description cannot exceed 500 characters" });
      }
      updates.description = description ? description.trim() : "";
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be a boolean" });
      }
      updates.completed = completed;
    }

    Object.assign(task, updates);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
