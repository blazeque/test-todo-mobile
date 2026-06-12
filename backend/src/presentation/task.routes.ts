import { FastifyInstance } from 'fastify';
import { taskService } from '../application/task.service';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from '../application/schemas';

export async function taskRoutes(app: FastifyInstance) {
  app.get('/api/tasks', async (request) => {
    const query = listTasksQuerySchema.parse(request.query);
    return taskService.list(query);
  });

  app.get<{ Params: { id: string } }>('/api/tasks/:id', async (request) => {
    const data = await taskService.getById(request.params.id);
    return { data };
  });

  app.post('/api/tasks', async (request, reply) => {
    const body = createTaskSchema.parse(request.body);
    const data = await taskService.create(body);
    return reply.status(201).send({ data });
  });

  app.put<{ Params: { id: string } }>('/api/tasks/:id', async (request) => {
    const body = updateTaskSchema.parse(request.body);
    const data = await taskService.update(request.params.id, body);
    return { data };
  });

  app.delete<{ Params: { id: string } }>('/api/tasks/:id', async (request, reply) => {
    await taskService.delete(request.params.id);
    return reply.status(204).send();
  });
}
