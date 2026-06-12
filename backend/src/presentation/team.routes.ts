import { FastifyInstance } from 'fastify';
import { teamService } from '../application/team.service';
import {
  createTeamSchema,
  listTeamsQuerySchema,
  updateTeamSchema,
} from '../application/schemas';

export async function teamRoutes(app: FastifyInstance) {
  app.get('/api/teams', async (request) => {
    const query = listTeamsQuerySchema.parse(request.query);
    return teamService.list(query);
  });

  app.get<{ Params: { id: string } }>('/api/teams/:id', async (request) => {
    const data = await teamService.getById(request.params.id);
    return { data };
  });

  app.post('/api/teams', async (request, reply) => {
    const body = createTeamSchema.parse(request.body);
    const data = await teamService.create(body);
    return reply.status(201).send({ data });
  });

  app.put<{ Params: { id: string } }>('/api/teams/:id', async (request) => {
    const body = updateTeamSchema.parse(request.body);
    const data = await teamService.update(request.params.id, body);
    return { data };
  });

  app.delete<{ Params: { id: string } }>('/api/teams/:id', async (request, reply) => {
    await teamService.delete(request.params.id);
    return reply.status(204).send();
  });
}
