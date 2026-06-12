import { describe, expect, it } from 'vitest';
import {
  createTaskSchema,
  createTeamSchema,
  listTasksQuerySchema,
} from '../../src/application/schemas';

describe('createTeamSchema', () => {
  it('aceita dados válidos', () => {
    const result = createTeamSchema.safeParse({
      name: 'Frontend',
      colorHex: '#3B82F6',
      description: 'Time de UI',
    });
    expect(result.success).toBe(true);
  });

  it('rejeita cor hex inválida', () => {
    const result = createTeamSchema.safeParse({
      name: 'Frontend',
      colorHex: 'azul',
    });
    expect(result.success).toBe(false);
  });
});

describe('createTaskSchema', () => {
  it('exige título com mínimo 3 caracteres', () => {
    const result = createTaskSchema.safeParse({ title: 'ab' });
    expect(result.success).toBe(false);
  });

  it('aceita tarefa sem times', () => {
    const result = createTaskSchema.safeParse({ title: 'Nova tarefa' });
    expect(result.success).toBe(true);
  });
});

describe('listTasksQuerySchema', () => {
  it('aplica defaults de paginação', () => {
    const result = listTasksQuerySchema.parse({});
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
    expect(result.sort).toBe('createdAt');
    expect(result.order).toBe('desc');
  });
});
