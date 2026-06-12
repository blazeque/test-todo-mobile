import cors from '@fastify/cors';
import Fastify from 'fastify';
import { errorHandler } from './presentation/error-handler';
import { taskRoutes } from './presentation/task.routes';
import { teamRoutes } from './presentation/team.routes';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  app.setErrorHandler(errorHandler);

  app.get('/health', async () => ({ status: 'ok' }));

  await app.register(teamRoutes);
  await app.register(taskRoutes);

  return app;
}
