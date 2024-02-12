import axios from 'axios';
import TaskRepository from './TaskRepo';

jest.mock('axios');

describe('TaskRepository', () => {
  const baseUrl = '/api/v1';
  let taskRepository: TaskRepository;

  beforeEach(() => {
    taskRepository = new TaskRepository(baseUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const taskData = { name: 'Task 1', description: 'Description', dueDate: '2024-02-18' };
      const responseData = { id: 1, ...taskData };

      (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

      const result = await taskRepository.create(taskData);

      expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/task`, taskData);
      expect(result).toEqual(responseData);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updatedTaskData = { name: 'Updated Task', description: 'Updated Description', dueDate: '2024-02-20' };
      const responseData = { id: taskId, ...updatedTaskData };

      (axios.put as jest.Mock).mockResolvedValueOnce({ data: responseData });

      const result = await taskRepository.update(taskId, updatedTaskData);

      expect(axios.put).toHaveBeenCalledWith(`${baseUrl}/task/${taskId}`, updatedTaskData);
      expect(result).toEqual(responseData);
    });
  });

  describe('list', () => {
    it('should list tasks', async () => {
      const pageNumber = 1;
      const pageSize = 10;
      const name = 'Task';
      const sortBy = 'dueDate';
      const responseData = [{ id: 1, name: 'Task 1', description: 'Description', dueDate: '2024-02-18' }];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: responseData });

      const result = await taskRepository.list(pageNumber, pageSize, name, sortBy);

      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/task`, { params: { pageNumber, pageSize, name, sortBy } });
      expect(result).toEqual(responseData);
    });
  });
});
