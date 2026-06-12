import { Prisma } from '@prisma/client';
import { NotFoundError } from '../domain/errors';
import { prisma } from '../infrastructure/prisma';
import { mapTeam } from '../infrastructure/mappers';
import { CreateTeamInput, ListTeamsQuery, UpdateTeamInput } from './schemas';
import { PaginatedResponse, TeamDto } from './types';

export class TeamService {
  async list(query: ListTeamsQuery): Promise<PaginatedResponse<TeamDto>> {
    const where: Prisma.TeamWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { description: { contains: query.search } },
          ],
        }
      : {};

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip: query.offset,
        take: query.limit,
        orderBy: { name: 'asc' },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      data: teams.map(mapTeam),
      meta: { total, limit: query.limit, offset: query.offset },
    };
  }

  async getById(id: string): Promise<TeamDto> {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) throw new NotFoundError('Time', id);
    return mapTeam(team);
  }

  async create(input: CreateTeamInput): Promise<TeamDto> {
    const team = await prisma.team.create({ data: input });
    return mapTeam(team);
  }

  async update(id: string, input: UpdateTeamInput): Promise<TeamDto> {
    await this.getById(id);
    const team = await prisma.team.update({ where: { id }, data: input });
    return mapTeam(team);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await prisma.team.delete({ where: { id } });
  }
}

export const teamService = new TeamService();
