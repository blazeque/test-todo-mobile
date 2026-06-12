import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { createTeam, deleteTeam, fetchTeams, updateTeam } from '../api/teams';
import { PaginatedResponse, Team } from '../types';

export const TEAMS_KEY = ['teams'] as const;

function removeTeamFromListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  teamId: string,
) {
  queryClient.setQueriesData<PaginatedResponse<Team>>(
    { queryKey: TEAMS_KEY },
    (old) => {
      if (!old) return old;

      return {
        ...old,
        data: old.data.filter((team) => team.id !== teamId),
        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
      };
    },
  );
}

function addTeamToListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  newTeam: Team,
) {
  queryClient.setQueriesData<PaginatedResponse<Team>>(
    { queryKey: TEAMS_KEY },
    (old) => {
      if (!old) {
        return {
          data: [newTeam],
          meta: { total: 1, limit: 50, offset: 0 },
        };
      }

      if (old.data.some((team) => team.id === newTeam.id)) {
        return old;
      }

      return {
        ...old,
        data: [...old.data, newTeam].sort((a, b) => a.name.localeCompare(b.name)),
        meta: { ...old.meta, total: old.meta.total + 1 },
      };
    },
  );
}

export function useTeams(search?: string) {
  return useQuery({
    queryKey: [...TEAMS_KEY, { search }],
    queryFn: () => fetchTeams({ search, limit: 50 }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: (response) => {
      addTeamToListCache(queryClient, response.data);
      queryClient.invalidateQueries({ queryKey: TEAMS_KEY });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTeam>[1] }) =>
      updateTeam(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAMS_KEY }),
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_response, teamId) => {
      removeTeamFromListCache(queryClient, teamId);
      queryClient.invalidateQueries({ queryKey: TEAMS_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
