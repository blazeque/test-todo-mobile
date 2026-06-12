import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { buildApp } from '../../src/app';
import type { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();
let app: FastifyInstance;

beforeAll(async () => {
  await prisma.taskTeam.deleteMany();
  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

describe('Teams API', () => {
  let teamId: string;

  it('POST /api/teams cria um time', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/teams',
      payload: { name: 'QA', colorHex: '#EF4444', description: 'Qualidade' },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.data.name).toBe('QA');
    teamId = body.data.id;
  });

  it('GET /api/teams lista com metadata', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/teams' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data).toHaveLength(1);
    expect(body.meta.total).toBe(1);
  });

  it('PUT /api/teams/:id atualiza', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/api/teams/${teamId}`,
      payload: { name: 'Quality Assurance' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.name).toBe('Quality Assurance');
  });
});

describe('Tasks API', () => {
  let teamId: string;
  let taskId: string;

  beforeAll(async () => {
    const team = await prisma.team.create({
      data: { name: 'Mobile', colorHex: '#8B5CF6' },
    });
    teamId = team.id;
  });

  it('POST /api/tasks cria tarefa', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: 'Testar formulários',
        status: 'PENDING',
        teamIds: [teamId],
      },
    });
    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.data.teams).toHaveLength(1);
    taskId = body.data.id;
  });

  it('GET /api/tasks filtra por teamId e status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks?teamId=${teamId}&status=PENDING`,
    });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('PUT /api/tasks/:id altera status', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: `/api/tasks/${taskId}`,
      payload: { status: 'COMPLETED' },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().data.status).toBe('COMPLETED');
  });

  it('DELETE /api/tasks/:id remove tarefa', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/tasks/${taskId}`,
    });
    expect(response.statusCode).toBe(204);
  });
});
