export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Team {
  id: string;
  name: string;
  colorHex: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskTeam {
  id: string;
  name: string;
  colorHex: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  teams: TaskTeam[];
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

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
