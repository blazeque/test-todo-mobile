import { z } from 'zod';
import { TASK_STATUSES } from '../domain/task-status';

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  colorHex: z.string().regex(hexColorRegex, 'Cor deve ser um hex válido (#RRGGBB)'),
  description: z.string().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

export const listTeamsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  teamIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').optional(),
  description: z.string().optional().nullable(),
  status: z.enum(TASK_STATUSES).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  teamIds: z.array(z.string()).optional(),
});

export const listTasksQuerySchema = z.object({
  teamId: z.string().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(['createdAt', 'dueDate', 'title', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type ListTeamsQuery = z.infer<typeof listTeamsQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
