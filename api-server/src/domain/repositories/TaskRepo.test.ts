import TaskRepository from './TaskRepo';
import { TaskDTO, Task, TaskStatus } from '../models';

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
    };
    taskRepository = new TaskRepository(mockDb as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData: TaskDTO = {
        name: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date('2024-02-20'),
      };

      const expectedResult: Task = {
        name: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date('2024-02-20'),
        createDate: new Date(),
        status: TaskStatus.NotUrgent,
      };

      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: [expectedResult],
      });

      const result = await taskRepository.create(taskData);
      expect(result).toEqual(expectedResult);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        expect.any(Array)
      );
    });
  });

  describe('read', () => {
    it('should return the task with the given ID', async () => {
      const taskId = 1;
      const expectedTask: Task = {
        name: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date('2024-02-20'),
        createDate: new Date(),
        status: TaskStatus.NotUrgent,
      };

      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: [expectedTask],
      });

      const result = await taskRepository.read(taskId);
      expect(result).toEqual(expectedTask);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [taskId]
      );
    });

    it('should return null if task with given ID does not exist', async () => {
      const taskId = 100;
      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
      });

      const result = await taskRepository.read(taskId);
      expect(result).toBeNull();
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [taskId]
      );
    });
  });

  describe('update', () => {
    it('should update the task with the given ID', async () => {
      const taskId = 1;
      const updatedTaskData: Partial<TaskDTO> = {
        name: 'Updated Task Name',
      };
      const originalTask: Task = {
        name: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date('2024-02-20'),
        createDate: new Date(),
        status: TaskStatus.NotUrgent,
      };

      const expectedUpdatedTask: Task = {
        ...originalTask,
        name: updatedTaskData.name!,
      };

      taskRepository.read = jest.fn().mockResolvedValueOnce(originalTask);
      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: [expectedUpdatedTask],
      });

      const result = await taskRepository.update(taskId, updatedTaskData);
      expect(result).toEqual(expectedUpdatedTask);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE'),
        [updatedTaskData.name, undefined, undefined, taskId]
      );
    });

    it('should return null if task with given ID does not exist', async () => {
      const taskId = 100;
      const updatedTaskData: Partial<TaskDTO> = {
        name: 'Updated Task Name',
      };

      taskRepository.read = jest.fn().mockResolvedValueOnce(null);

      const result = await taskRepository.update(taskId, updatedTaskData);
      expect(result).toBeNull();
      expect(mockDb.query).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should return a list of tasks and total count with pagination, sorting, and searching', async () => {
      const pageSize = 10;
      const pageNumber = 1;
      const sortBy = 'due_date ASC';
      const searchParams: Partial<TaskDTO> = { name: 'Task' };
      const offset = (pageNumber - 1) * pageSize;

      const expectedTasks: Task[] = [
        {
          name: 'Task 1',
          description: 'Description 1',
          dueDate: new Date('2024-02-10'),
          createDate: new Date(),
          status: TaskStatus.NotUrgent,
        },
        {
          name: 'Task 2',
          description: 'Description 2',
          dueDate: new Date('2024-02-15'),
          createDate: new Date(),
          status: TaskStatus.NotUrgent,
        },
      ];

      const expectedTotalCount = 100;

      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: expectedTasks,
      });

      (mockDb.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ total_count: expectedTotalCount }],
      });

      const result = await taskRepository.list(pageSize, pageNumber, sortBy, searchParams);

      expect(result.tasks).toEqual(expectedTasks);
      expect(result.totalCount).toEqual(expectedTotalCount);
      expect(mockDb.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('SELECT'),
        ['%Task%', pageSize, offset]
      );

      expect(mockDb.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('SELECT COUNT(*)'),
        ['%Task%']
      );
    });
  });
});
