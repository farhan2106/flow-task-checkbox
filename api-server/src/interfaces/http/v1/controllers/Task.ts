import { Request, Response } from "express";
import { dbPool } from "@infra/database";
import TaskService from "@domain/services/TaskService";

export default class TaskController {
  async getTasks(req: Request, res: Response) {
    let dbConn;
    try {
      let { pageNumber, pageSize, sortBy, search } = req.query;
      
      // Set default sorting by create date if sortBy is not provided or is invalid
      sortBy = (sortBy === 'dueDate' || sortBy === 'createDate') ? sortBy : 'createDate';

      // Set search value to an empty string if not provided
      search = search || '';

      dbConn = await dbPool.getClient();
      const taskService = new TaskService(dbConn);
      const tasks = await taskService.getTasks(pageNumber, pageSize, sortBy as string, { name: search as string });
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      dbConn?.release();
    }
  }

  async createTask(req: Request, res: Response) {
    let dbConn;
    try {
      const taskData = req.body;

      dbConn = await dbPool.getClient();
      const taskService = new TaskService(dbConn);
      const task = await taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      dbConn?.release();
    }
  }

  async editTask(req: Request, res: Response) {
    let dbConn;
    try {
      const taskId = parseInt(req.params.id);
      const updatedTaskData = req.body;

      dbConn = await dbPool.getClient();
      const taskService = new TaskService(dbConn);
      const updatedTask = await taskService.editTask(taskId, updatedTaskData);
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      dbConn?.release();
    }
  }
}
