export interface TaskDTO {
  name: string;
  description: string;
  dueDate: Date;
}

export interface Task {
  name: string;
  description: string;
  dueDate: Date;
  createDate: Date;
  status: TaskStatus;
}

export enum TaskStatus {
  NotUrgent,
  DueSoon,
  Overdue
}
