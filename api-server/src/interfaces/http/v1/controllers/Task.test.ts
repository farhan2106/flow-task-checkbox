import { Request, Response } from "express";
import TaskController from "./Task";
// import TaskService from "./../../../../domain/services/TaskService";

jest.mock("../../../../infra/database", () => ({
  dbPool: {
    getClient: jest.fn(),
  },
}));

const mockTaskService = {
  getTasks: jest.fn(),
  createTask: jest.fn(),
  editTask: jest.fn(),
};
jest.mock("./../../../../domain/services/TaskService", () => jest.fn().mockImplementation(() => mockTaskService));

describe("TaskController", () => {
  let taskController: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    taskController = new TaskController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getTasks", () => {
    it("should return tasks", async () => {
      mockTaskService.getTasks.mockResolvedValue({ tasks: [], totalCount: 0 });
      req.query = { pageNumber: "1", pageSize: "10" };
      await taskController.getTasks(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ tasks: [], totalCount: 0 });
    });
  });

  describe("createTask", () => {
    it("should create a task", async () => {
      const task = { id: 1, name: "Task 1", description: "Description", dueDate: "2024-02-18" };
      mockTaskService.createTask.mockResolvedValue(task);
      req.body = { name: "Task 1", description: "Description", dueDate: "2024-02-18" };
      await taskController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(task);
    });
  });

  describe("editTask", () => {
    it("should edit a task", async () => {
      const updatedTask = { id: 1, name: "Updated Task", description: "Updated Description", dueDate: "2024-02-20" };
      mockTaskService.editTask.mockResolvedValue(updatedTask);
      req.params = { id: "1" };
      req.body = { name: "Updated Task", description: "Updated Description", dueDate: "2024-02-20" };
      await taskController.editTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });
  });
});
