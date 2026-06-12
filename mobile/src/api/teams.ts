import { apiDelete, apiGet, apiPost, apiPut } from './client';
import { PaginatedResponse, Team } from '../types';

export interface ListTeamsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export function fetchTeams(params?: ListTeamsParams) {
  return apiGet<PaginatedResponse<Team>>('/api/teams', params);
}

export function fetchTeam(id: string) {
  return apiGet<{ data: Team }>(`/api/teams/${id}`);
}

export function createTeam(data: { name: string; colorHex: string; description?: string }) {
  return apiPost<{ data: Team }>('/api/teams', data);
}

export function updateTeam(id: string, data: Partial<{ name: string; colorHex: string; description?: string }>) {
  return apiPut<{ data: Team }>(`/api/teams/${id}`, data);
}

export function deleteTeam(id: string) {
  return apiDelete(`/api/teams/${id}`);
}
