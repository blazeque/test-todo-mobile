import { z } from 'zod';

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

export const teamFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  colorHex: z.string().regex(hexColorRegex, 'Selecione uma cor válida'),
  description: z.string().optional(),
});

export type TeamFormData = z.infer<typeof teamFormSchema>;

export const TEAM_COLORS = {
  frontend: '#3B82F6',
  backend: '#10B981',
  devops: '#F59E0B',
} as const;

export const DEFAULT_TEAM_COLOR = TEAM_COLORS.devops;

export const TEAM_COLOR_PRESETS = [
  TEAM_COLORS.frontend,
  TEAM_COLORS.backend,
  TEAM_COLORS.devops,
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
  '#14B8A6',
  '#EAB308',
] as const;
