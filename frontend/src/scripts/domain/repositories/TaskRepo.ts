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
