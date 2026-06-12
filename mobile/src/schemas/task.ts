import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  teamIds: z.array(z.string()),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
