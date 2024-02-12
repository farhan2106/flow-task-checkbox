import axios from 'axios';

export default class TaskRepository {
  private baseUrl: string;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async create(data: any) {
    const response = await axios.post(`${this.baseUrl}/task`, data);
    return response.data;
  }

  async update(id: number, updatedData: any) {
    const response = await axios.put(`${this.baseUrl}/task/${id}`, updatedData);
    return response.data;
  }

  async list(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchString: string = '',
    sortBy: string = 'createDate' // Default sorting by createDate
  ) {
    return [
      { id: 1, name: 'Task 1', description: 'Description 1', dueDate: '2024-02-15', createDate: '2024-02-10', status: 'Not urgent' },
      { id: 2, name: 'Task 2', description: 'Description 2', dueDate: '2024-02-20', createDate: '2024-02-11', status: 'Due soon' },
      // Add more tasks as needed
    ];  

    const params = {
      pageNumber,
      pageSize,
      name: searchString,
      sortBy
    };

    const response = await axios.get(`${this.baseUrl}/task`, { params });
    return response.data;
  }
}
