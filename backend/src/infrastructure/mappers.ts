import { Task, Team } from '@prisma/client';
import { TaskDto, TaskTeamDto, TeamDto } from '../application/types';
import { TaskStatus } from '../domain/task-status';

type TaskWithTeams = Task & {
  teams: { team: Team }[];
};

export function mapTeam(team: Team): TeamDto {
  return {
    id: team.id,
    name: team.name,
    colorHex: team.colorHex,
    description: team.description,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
  };
}

export function mapTaskTeam(team: Team): TaskTeamDto {
  return {
    id: team.id,
    name: team.name,
    colorHex: team.colorHex,
  };
}

export function mapTask(task: TaskWithTeams): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    dueDate: task.dueDate?.toISOString() ?? null,
    teams: task.teams.map((tt) => mapTaskTeam(tt.team)),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}
