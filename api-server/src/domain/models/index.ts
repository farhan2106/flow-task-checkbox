export interface TaskDTO {
  name: string;
  description: string;
  dueDate: Date;
}

export interface Task {
  id: number
  name: string;
  description: string;
  dueDate: Date;
  createDate: Date;
  status: TaskStatus;
}

export enum TaskStatus {
  NotUrgent = 'NotUrgent',
  DueSoon = 'DueSoon',
  Overdue = 'Overdue'
}
