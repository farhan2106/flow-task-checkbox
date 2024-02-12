import { Router } from "express";
import TaskController from "./controllers/Task";

const router = Router();
const taskController = new TaskController();


router
  .post("/", taskController.createTask) // Create a new task
  .get("/", taskController.getTasks) // Get all tasks with optional pagination, sorting, and searching
  .put("/:id", taskController.editTask) // Edit a task by ID;

export default router;