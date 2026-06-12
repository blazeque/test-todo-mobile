import { Prisma, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import { NotFoundError, ValidationError } from '../domain/errors';
import { prisma } from '../infrastructure/prisma';
import { mapTask } from '../infrastructure/mappers';
import { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './schemas';
import { PaginatedResponse, TaskDto } from './types';

export class TaskService {
  private async validateTeamIds(teamIds: string[]): Promise<void> {
    if (teamIds.length === 0) return;
    const count = await prisma.team.count({ where: { id: { in: teamIds } } });
    if (count !== teamIds.length) {
      throw new ValidationError('Um ou mais times informados não existem');
    }
  }

  async list(query: ListTasksQuery): Promise<PaginatedResponse<TaskDto>> {
    const where: Prisma.TaskWhereInput = {};

    if (query.status) {
      where.status = query.status as PrismaTaskStatus;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    if (query.teamId) {
      where.teams = { some: { teamId: query.teamId } };
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [query.sort]: query.order,
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: query.offset,
        take: query.limit,
        orderBy,
        include: { teams: { include: { team: true } } },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks.map(mapTask),
      meta: { total, limit: query.limit, offset: query.offset },
    };
  }

  async getById(id: string): Promise<TaskDto> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { teams: { include: { team: true } } },
    });
    if (!task) throw new NotFoundError('Tarefa', id);
    return mapTask(task);
  }

  async create(input: CreateTaskInput): Promise<TaskDto> {
    const teamIds = input.teamIds ?? [];
    await this.validateTeamIds(teamIds);

    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        teams: teamIds.length
          ? { create: teamIds.map((teamId) => ({ teamId })) }
          : undefined,
      },
      include: { teams: { include: { team: true } } },
    });

    return mapTask(task);
  }

  async update(id: string, input: UpdateTaskInput): Promise<TaskDto> {
    await this.getById(id);

    if (input.teamIds !== undefined) {
      await this.validateTeamIds(input.teamIds);
    }

    const task = await prisma.$transaction(async (tx) => {
      if (input.teamIds !== undefined) {
        await tx.taskTeam.deleteMany({ where: { taskId: id } });
        if (input.teamIds.length > 0) {
          await tx.taskTeam.createMany({
            data: input.teamIds.map((teamId) => ({ taskId: id, teamId })),
          });
        }
      }

      return tx.task.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          dueDate:
            input.dueDate === null
              ? null
              : input.dueDate
                ? new Date(input.dueDate)
                : undefined,
        },
        include: { teams: { include: { team: true } } },
      });
    });

    return mapTask(task);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await prisma.task.delete({ where: { id } });
  }
}

export const taskService = new TaskService();
