import { PoolClient } from 'pg';
import { Task, TaskDTO, TaskStatus } from '../models';

export default class TaskRepository {
  private db: PoolClient;
  
  constructor(db: PoolClient) {
    this.db = db;
  }
  
  async create(taskData: TaskDTO) {
    const { name, description, dueDate } = taskData;
    const query = `
      INSERT INTO tasks (name, description, due_date, create_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING name, description, due_date as "dueDate", create_date as "createDate";
    `;
    const values = [name, description, dueDate];

    const result = await this.db.query(query, values);
    return result.rows[0] as Task;
  }

  async read(taskId: number) {
    const query = `
      SELECT 
        id,
        name, 
        description, 
        due_date AS "dueDate", 
        create_date AS "createDate",
        CASE 
            WHEN due_date > NOW() + INTERVAL '7 days' THEN '${TaskStatus.NotUrgent}'
            WHEN due_date <= NOW() + INTERVAL '7 days' AND due_date >= NOW() THEN '${TaskStatus.DueSoon}'
            ELSE '${TaskStatus.Overdue}'
        END AS status
      FROM tasks
      WHERE id = $1;
    `;
    const result = await this.db.query(query, [taskId]);
    return result.rows.length ? result.rows[0] as Task : null;
  }

  async update(taskId: number, updatedTaskData: Partial<TaskDTO>) {
    const task = await this.read(taskId);
    if (!task) return null;

    const { name, description, dueDate } = updatedTaskData;
    const query = `
      UPDATE tasks
      SET 
          name = COALESCE($1, name), 
          description = COALESCE($2, description),
          due_date = COALESCE($3, due_date)
      WHERE id = $4
      RETURNING 
          id,
          name, 
          description, 
          due_date AS "dueDate", 
          create_date AS "createDate",
          CASE 
            WHEN due_date > NOW() + INTERVAL '7 days' THEN '${TaskStatus.NotUrgent}'
            WHEN due_date <= NOW() + INTERVAL '7 days' AND due_date >= NOW() THEN '${TaskStatus.DueSoon}'
            ELSE '${TaskStatus.Overdue}'
          END AS status;
    `;
    const values = [name, description, dueDate, taskId];

    const result = await this.db.query(query, values);
    return result.rows[0] as Task;
  }

  async list(
    pageSize: number,
    pageNumber: number,
    sortBy: string | null = null,
    sortDir: "asc" | "desc" = 'asc',
    searchParams: Partial<TaskDTO> = {}
  ): Promise<{ tasks: Task[], totalCount: number }> {
    const offset = (pageNumber - 1) * pageSize;
    let query = `
      SELECT 
        id,
        name,
        description,
        due_date as "dueDate",
        create_date as "createDate",
        CASE 
            WHEN due_date > NOW() + INTERVAL '7 days' THEN '${TaskStatus.NotUrgent}'
            WHEN due_date <= NOW() + INTERVAL '7 days' AND due_date >= NOW() THEN '${TaskStatus.DueSoon}'
            ELSE '${TaskStatus.Overdue}'
        END AS status
      FROM tasks
    `;
  
    const whereClauses: string[] = [];
    const values: any[] = [];
  
    if (Object.keys(searchParams).length > 0) {
      for (const key in searchParams) {
        if (searchParams.hasOwnProperty(key) && (searchParams as any)[key]) {
          whereClauses.push(`${key} ILIKE $${values.length + 1}`);
          values.push(`%${(searchParams as any)[key]}%`);
        }
      }
    }
  
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }
  
    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortDir}`;
    }
  
    query += `
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2};
    `;
  
    values.push(pageSize, offset);
  
    const result = await this.db.query(query, values);
  
    let totalCountQuery = `
      SELECT COUNT(*) as "totalCount" FROM tasks
    `;
  
    if (whereClauses.length > 0) {
      totalCountQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }
  
    const totalCountResult = await this.db.query(totalCountQuery, values.slice(0, -2));
    const totalCount = parseInt(totalCountResult.rows[0].totalCount);
  
    return { tasks: result.rows as Task[], totalCount };
  }
}
