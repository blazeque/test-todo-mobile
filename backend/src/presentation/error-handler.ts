import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../domain/errors';

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos',
        details: error.flatten(),
      },
    });
  }

  const statusCode = error.statusCode ?? 500;
  return reply.status(statusCode).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: statusCode === 500 ? 'Erro interno do servidor' : error.message,
    },
  });
}
