import { TaskStatus } from '../domain/task-status';

export interface TeamDto {
  id: string;
  name: string;
  colorHex: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTeamDto {
  id: string;
  name: string;
  colorHex: string;
}

export interface TaskDto {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  teams: TaskTeamDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
