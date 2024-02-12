import TaskRepository from "../repositories/TaskRepo";
import { TaskDTO } from "../models";

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

  async getAllTasks(pageNumber: number, pageSize: number){
    return await this.taskRepo.list(pageSize, pageNumber);
  }

  async editTask(taskId: number, updatedTaskData: Partial<TaskDTO>) {
    return await this.taskRepo.update(taskId, updatedTaskData);
  }

  async searchTasksByName(taskName: string) {
    const searchParams: Partial<TaskDTO> = { name: taskName };
    const result = await this.taskRepo.list(10, 1, null, searchParams);
    return result;
  }

  async getTasksSortedByDueDate(ascending: boolean = true) {
    const order = ascending ? 'ASC' : 'DESC';
    const result = this.taskRepo.list(10, 1, `due_date ${order}`);
    return result;
  }

  async getTasksSortedByCreateDate(ascending: boolean = true) {
    const order = ascending ? 'ASC' : 'DESC';
    const result = this.taskRepo.list(10, 1, `create_date ${order}`);
    return result;
  }
}
