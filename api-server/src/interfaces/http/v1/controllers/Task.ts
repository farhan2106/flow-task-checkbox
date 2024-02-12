import { Request, Response } from "express";
import { dbPool } from "@infra/database";
import TaskService from "@domain/services/TaskService";

export default class TaskController {
  async getTasks(req: Request, res: Response) {
    let dbConn;
    try {
      const { pageNumber, pageSize, sortBy, search } = req.query;

      // Validate pageNumber and pageSize
      const pageNumberInt = parseInt(pageNumber as string);
      const pageSizeInt = parseInt(pageSize as string);
      if (isNaN(pageNumberInt) || isNaN(pageSizeInt) || pageNumberInt < 1 || pageSizeInt < 1) {
        return res.status(400).json({ error: "Invalid pageNumber or pageSize" });
      }

      // Set default sorting by create date if sortBy is not provided or is invalid
      const validSortByValues = ['dueDate', 'createDate'];
      const sortByValue = validSortByValues.includes(sortBy as string) ? sortBy : 'createDate';

      // Set search value to an empty string if not provided
      const searchValue = search || '';

      dbConn = await dbPool.getClient();
      const taskService = new TaskService(dbConn);
      const tasks = await taskService.getTasks(pageNumberInt, pageSizeInt, sortByValue as string, { name: searchValue as string });
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
      const { name, description, dueDate } = req.body;

      // Validate request body
      if (!name || !description || !dueDate) {
        return res.status(400).json({ error: "Name, description, and dueDate are required" });
      }

      dbConn = await dbPool.getClient();
      const taskService = new TaskService(dbConn);
      const task = await taskService.createTask({ name, description, dueDate });
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

      // Validate taskId
      if (isNaN(taskId) || taskId < 1) {
        return res.status(400).json({ error: "Invalid taskId" });
      }

      // Validate updatedTaskData
      if (Object.keys(updatedTaskData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

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
