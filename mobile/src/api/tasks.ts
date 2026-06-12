import { apiDelete, apiGet, apiPost, apiPut } from './client';
import { PaginatedResponse, Task, TaskStatus } from '../types';

export interface ListTasksParams {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string | null;
  teamIds?: string[];
}

export function fetchTasks(params?: ListTasksParams) {
  return apiGet<PaginatedResponse<Task>>('/api/tasks', params);
}

export function fetchTask(id: string) {
  return apiGet<{ data: Task }>(`/api/tasks/${id}`);
}

export function createTask(data: TaskInput) {
  return apiPost<{ data: Task }>('/api/tasks', data);
}

export function updateTask(id: string, data: Partial<TaskInput>) {
  return apiPut<{ data: Task }>(`/api/tasks/${id}`, data);
}

export function deleteTask(id: string) {
  return apiDelete(`/api/tasks/${id}`);
}
