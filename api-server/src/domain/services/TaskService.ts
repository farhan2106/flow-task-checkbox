import TaskRepository from "../repositories/TaskRepo";
import { Task, TaskDTO } from "../models";

interface ITaskService {
  taskRepo: TaskRepository;
}

export default class TaskService {
  private taskRepo: TaskRepository;

  constructor(deps: ITaskService) {
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
    searchParams: Partial<TaskDTO> = {}
  ): Promise<{ tasks: Task[], totalCount: number }> {
    const { tasks, totalCount } = await this.taskRepo.list(pageSize, pageNumber, sortBy, searchParams);
    return { tasks, totalCount };
  }
}
