import { PrismaClient, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

const teams = [
  {
    name: 'Frontend',
    colorHex: '#3B82F6',
    description: 'Time responsável pela interface e experiência do usuário',
  },
  {
    name: 'Backend',
    colorHex: '#10B981',
    description: 'Time responsável por APIs e infraestrutura',
  },
  {
    name: 'DevOps',
    colorHex: '#F59E0B',
    description: 'Time responsável por deploy e monitoramento',
  },
];

const TASK_TITLE = 'Título da tarefa';
const TASK_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ullamcorper vehicula diam. In faucibus, augue eget viverra euismod, magna nibh vestibulum mi, a dictum mi nulla in nulla.';

const tasks = [
  {
    title: TASK_TITLE,
    description: TASK_DESCRIPTION,
    status: TaskStatus.PENDING,
    teamNames: ['Frontend', 'Backend', 'DevOps'],
  },
  {
    title: TASK_TITLE,
    description: TASK_DESCRIPTION,
    status: TaskStatus.IN_PROGRESS,
    teamNames: ['Frontend', 'Backend', 'DevOps'],
  },
  {
    title: TASK_TITLE,
    description: TASK_DESCRIPTION,
    status: TaskStatus.COMPLETED,
    teamNames: ['Frontend', 'Backend', 'DevOps'],
  },
];

async function main() {
  console.log('Limpando dados existentes...');
  await prisma.taskTeam.deleteMany();
  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  console.log('Criando times...');
  const createdTeams = await Promise.all(
    teams.map((team) => prisma.team.create({ data: team })),
  );

  const teamMap = new Map(createdTeams.map((t) => [t.name, t.id]));

  console.log('Criando tarefas...');
  for (const task of tasks) {
    const teamIds = task.teamNames
      .map((name) => teamMap.get(name))
      .filter((id): id is string => id !== undefined);

    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        teams: teamIds.length
          ? { create: teamIds.map((teamId) => ({ teamId })) }
          : undefined,
      },
    });
  }

  console.log(`Seed concluído: ${createdTeams.length} times, ${tasks.length} tarefas`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
