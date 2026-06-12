import { TaskStatus } from '../types';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: 'Pendente',
  IN_PROGRESS: 'Em Progresso',
  COMPLETED: 'Concluída',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export const STATUS_BG_DARK: Record<TaskStatus, string> = {
  PENDING: '#980000',
  IN_PROGRESS: '#986E00',
  COMPLETED: '#689800',
};

export const STATUS_BADGE_SIZE_DARK: Partial<Record<TaskStatus, { width: number; height: number }>> = {
  PENDING: { width: 67, height: 19 },
};

export const STATUS_LABELS_LOWERCASE: Record<TaskStatus, string> = {
  PENDING: 'pendente',
  IN_PROGRESS: 'em progresso',
  COMPLETED: 'concluída',
};

export const STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export function getNextStatus(current: TaskStatus): TaskStatus | null {
  const flow: Record<TaskStatus, TaskStatus | null> = {
    PENDING: 'IN_PROGRESS',
    IN_PROGRESS: 'COMPLETED',
    COMPLETED: null,
  };
  return flow[current];
}
