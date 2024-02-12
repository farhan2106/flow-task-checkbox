import TaskService from './TaskService';
import TaskRepository from '../repositories/TaskRepo';

jest.mock('../repositories/TaskRepo');

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepoMock: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    const taskRepo = new TaskRepository({} as any);
    taskService = new TaskService(jest.fn() as any, { taskRepo });
    taskRepoMock = taskRepo as jest.Mocked<TaskRepository>;
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const taskData = { name: 'Task 1', description: 'Description 1', dueDate: new Date() };
      taskRepoMock.create.mockResolvedValueOnce(taskData as any);
      const result = await taskService.createTask(taskData);
      expect(result).toEqual(taskData);
    });
  });

  describe('editTask', () => {
    it('should edit a task', async () => {
      const taskId = 1;
      const updatedTaskData = { name: 'Updated Task 1' };
      taskRepoMock.update.mockResolvedValueOnce(updatedTaskData as any);
      const result = await taskService.editTask(taskId, updatedTaskData);
      expect(result).toEqual(updatedTaskData);
    });
  });

  describe('getTasks', () => {
    it('should get tasks with pagination, sorting, and searching', async () => {
      const pageNumber = 1;
      const pageSize = 10;
      const sortBy = 'due_date ASC';
      const searchParams = { name: 'Task' };
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;

      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });

      const result = await taskService.getTasks(pageNumber, pageSize, sortBy, searchParams);

      expect(result).toEqual({ tasks, totalCount });
      expect(taskRepoMock.list).toHaveBeenCalledWith(pageSize, pageNumber, sortBy, searchParams);
    });

    it('should get tasks with default parameters', async () => {
      const pageNumber = 1;
      const pageSize = 10;

      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;

      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });

      const result = await taskService.getTasks(pageNumber, pageSize);

      expect(result).toEqual({ tasks, totalCount });
      expect(taskRepoMock.list).toHaveBeenCalledWith(pageSize, pageNumber, null, {});
    });
  });
});
