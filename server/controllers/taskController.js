import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const task = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: false,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description ? description.trim() : "";
    }
    if (completed !== undefined) {
      task.completed = completed;
    }

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
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
    next(error);
  }
};
