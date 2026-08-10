import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  validateSchema,
  createTaskSchema,
  updateTaskSchema,
  validateObjectId,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateSchema(createTaskSchema), createTask);
router.get("/", getTasks);
router.put("/:id", validateObjectId("id"), validateSchema(updateTaskSchema), updateTask);
router.delete("/:id", validateObjectId("id"), deleteTask);

export default router;
