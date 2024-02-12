import { PoolClient } from 'pg';
import { Task, TaskDTO, TaskStatus } from '../models';

export default class TaskRepository {
  private _db: PoolClient;
  
  constructor(db: PoolClient) {
    this._db = db;
  }
  
  async create(taskData: TaskDTO) {
    const { name, description, dueDate } = taskData;
    const query = `
      INSERT INTO tasks (name, description, due_date, create_date, status)
      VALUES ($1, $2, $3, NOW(), $4)
      RETURNING name, description, due_date as "dueDate", create_date as "createDate", status;
    `;
    const values = [name, description, dueDate, TaskStatus.NotUrgent];

    const result = await this._db.query(query, values);
    return result.rows[0] as Task;
  }

  async read(taskId: number) {
    const query = `
      SELECT name, description, due_date as "dueDate", create_date as "createDate", status
      FROM tasks
      WHERE id = $1;
    `;
    const result = await this._db.query(query, [taskId]);
    return result.rows.length ? result.rows[0] as Task : null;
  }

  async update(taskId: number, updatedTaskData: Partial<TaskDTO>) {
    const task = await this.read(taskId);
    if (!task) return null;

    const { name, description, dueDate } = updatedTaskData;
    const query = `
      UPDATE tasks
      SET name = COALESCE($1, name), 
          description = COALESCE($2, description),
          due_date = COALESCE($3, due_date)
      WHERE id = $4
      RETURNING name, description, due_date as "dueDate", create_date as "createDate", status;
    `;
    const values = [name, description, dueDate, taskId];

    const result = await this._db.query(query, values);
    return result.rows[0] as Task;
  }

  async list(pageSize: number, pageNumber: number): Promise<{ tasks: Task[], totalCount: number }> {
    const offset = (pageNumber - 1) * pageSize;
    const query = `
        SELECT name, description, due_date as "dueDate", create_date as "createDate", status
        FROM tasks
        ORDER BY create_date
        LIMIT $1
        OFFSET $2;
    `;
    const values = [pageSize, offset];

    const result = await this._db.query(query, values);
    const totalCountQuery = `
        SELECT COUNT(*) as total_count FROM tasks;
    `;
    const totalCountResult = await this._db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].total_count);

    return { tasks: result.rows as Task[], totalCount };
  }
}
