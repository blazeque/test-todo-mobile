import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorView } from '../../src/components/ErrorView';
import { IconTrash } from '../../src/components/IconTrash';
import { TaskCard } from '../../src/components/TaskCard';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { Screen } from '../../src/components/ui/Screen';
import { ScreenFooter } from '../../src/components/ui/ScreenFooter';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { TEAMS_KEY, useDeleteTeam } from '../../src/hooks/useTeams';
import { useTasks } from '../../src/hooks/useTasks';
import { normalizeParam } from '../../src/utils/param';

export default function TasksScreen() {
  const params = useLocalSearchParams<{ teamId?: string; teamName?: string }>();
  const teamId = normalizeParam(params.teamId);
  const teamName = normalizeParam(params.teamName);
  const { data, isLoading, error, refetch } = useTasks({
    teamId,
    limit: 50,
  });
  const deleteTeam = useDeleteTeam();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (error) {
    return (
      <Screen>
        <ErrorView message={error.message} onRetry={() => refetch()} />
      </Screen>
    );
  }

  const tasks = data?.data ?? [];

  const handleDeleteTeam = () => {
    if (!teamId) return;

    deleteTeam.mutate(teamId, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: TEAMS_KEY });
        router.replace('/');
      },
      onError: (err) => Alert.alert('Erro', err.message),
    });
  };

  return (
    <Screen>
      <ScreenHeader
        title="Tarefas"
        subtitle="adicione a galera e separe os times"
        showBack
        onBack={() => router.back()}
        rightAction={
          teamId ? (
            <Pressable
              onPress={handleDeleteTeam}
              className="p-2 active:opacity-70"
              hitSlop={8}
              disabled={deleteTeam.isPending}
            >
              <IconTrash size={24} />
            </Pressable>
          ) : undefined
        }
      />

      {isLoading ? (
        <LoadingSpinner fullScreen={false} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-4 flex-grow"
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma tarefa encontrada"
              subtitle="Crie a primeira tarefa para este time"
            />
          }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              teamName={teamName}
              onPress={() =>
                router.push({
                  pathname: '/tasks/edit/[id]',
                  params: {
                    id: item.id,
                    ...(teamId ? { teamId } : {}),
                    ...(teamName ? { teamName } : {}),
                  },
                })
              }
            />
          )}
        />
      )}

      <ScreenFooter
        label="Nova Tarefa"
        onPress={() =>
          router.push({
            pathname: '/tasks/new',
            params: teamId ? { teamId } : {},
          })
        }
      />

    </Screen>
  );
}
