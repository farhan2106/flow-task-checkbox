import TaskRepository from "../repositories/TaskRepo";
import { Task, TaskDTO } from "../models";
import { PoolClient } from "pg";

interface ITaskService {
  taskRepo: TaskRepository;
}

export default class TaskService {
  private taskRepo: TaskRepository;

  constructor(db: PoolClient, deps: ITaskService = { taskRepo: new TaskRepository(db) }) {
    this.taskRepo = deps.taskRepo;
  }

  async createTask(taskData: TaskDTO) {
    return await this.taskRepo.create(taskData);
  }

  async editTask(taskId: number, updatedTaskData: Partial<TaskDTO>) {
    return await this.taskRepo.update(taskId, updatedTaskData);
  }

  async getTasks(
    pageNumber: number,
    pageSize: number,
    sortBy: string | null = null,
    sortDir: "asc" | "desc" = "asc",
    searchParams: Partial<TaskDTO> = {}
  ): Promise<{ tasks: Task[], totalCount: number }> {
    const { tasks, totalCount } = await this.taskRepo.list(pageSize, pageNumber, sortBy, sortDir, searchParams);
    return { tasks, totalCount };
  }
}
