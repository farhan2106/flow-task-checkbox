import TaskService from './TaskService';
import TaskRepository from '../repositories/TaskRepo';

jest.mock('../repositories/TaskRepo');

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepoMock: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    const taskRepo = new TaskRepository({} as any);
    taskService = new TaskService({ taskRepo });
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

  describe('getAllTasks', () => {
    it('should get all tasks with pagination', async () => {
      const pageNumber = 1;
      const pageSize = 10;
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.getAllTasks(pageNumber, pageSize);
      expect(result).toEqual({ tasks, totalCount });
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

  describe('searchTasksByName', () => {
    it('should search tasks by name', async () => {
      const taskName = 'Task 1';
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.searchTasksByName(taskName);
      expect(result).toEqual({ tasks, totalCount });
    });
  });

  describe('getTasksSortedByDueDate', () => {
    it('should get tasks sorted by due date', async () => {
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.getTasksSortedByDueDate();
      expect(result).toEqual({ tasks, totalCount });
    });

    it('should get tasks sorted by due date in descending order', async () => {
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.getTasksSortedByDueDate(false);
      expect(result).toEqual({ tasks, totalCount });
    });
  });

  describe('getTasksSortedByCreateDate', () => {
    it('should get tasks sorted by create date', async () => {
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.getTasksSortedByCreateDate();
      expect(result).toEqual({ tasks, totalCount });
    });

    it('should get tasks sorted by create date in descending order', async () => {
      const tasks = [{ name: 'Task 1', description: 'Description 1', dueDate: new Date() }] as any;
      const totalCount = 1;
      taskRepoMock.list.mockResolvedValueOnce({ tasks, totalCount });
      const result = await taskService.getTasksSortedByCreateDate(false);
      expect(result).toEqual({ tasks, totalCount });
    });
  });
});
