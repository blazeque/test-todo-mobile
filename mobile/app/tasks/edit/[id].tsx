import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { EditTaskForm } from '../../../src/components/EditTaskForm';
import { ErrorView } from '../../../src/components/ErrorView';
import { IconCheckBadge } from '../../../src/components/IconCheckBadge';
import { IconTrash } from '../../../src/components/IconTrash';
import { LoadingView } from '../../../src/components/LoadingView';
import { Screen } from '../../../src/components/ui/Screen';
import { ScreenFooter } from '../../../src/components/ui/ScreenFooter';
import { ScreenHeader } from '../../../src/components/ui/ScreenHeader';
import { useDeleteTask, useTask, useUpdateTask, TASKS_KEY } from '../../../src/hooks/useTasks';
import { useTeams } from '../../../src/hooks/useTeams';
import { TaskFormData } from '../../../src/schemas/task';
import { normalizeParam } from '../../../src/utils/param';

export default function EditTaskScreen() {
  const params = useLocalSearchParams<{ id: string; teamId?: string; teamName?: string }>();
  const id = normalizeParam(params.id) ?? '';
  const teamId = normalizeParam(params.teamId);
  const teamName = normalizeParam(params.teamName);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();
  const submitRef = useRef<(() => void) | null>(null);
  const { data: taskData, isLoading: taskLoading, error: taskError, refetch } = useTask(id, {
    enabled: !!id && !deleteTask.isSuccess,
  });
  const { data: teamsData, isLoading: teamsLoading, error: teamsError } = useTeams();

  if (taskLoading || teamsLoading) {
    return (
      <Screen padded={false}>
        <LoadingView />
      </Screen>
    );
  }

  if (taskError) {
    return (
      <Screen>
        <ErrorView message={taskError.message} onRetry={() => refetch()} />
      </Screen>
    );
  }

  if (teamsError) {
    return (
      <Screen>
        <ErrorView message={teamsError.message} />
      </Screen>
    );
  }

  const task = taskData?.data;
  const teams = teamsData?.data ?? [];

  if (!task) {
    return (
      <Screen>
        <ErrorView message="Tarefa não encontrada" />
      </Screen>
    );
  }

  const navigateToTasks = () => {
    router.replace({
      pathname: '/tasks',
      params: {
        ...(teamId ? { teamId } : {}),
        ...(teamName ? { teamName } : {}),
      },
    });
  };

  const handleSubmit = (formData: TaskFormData) => {
    const selectedTeamId = formData.teamIds[0] ?? teamId ?? task.teams[0]?.id;
    const teamIds = teamId
      ? [...new Set([teamId, ...(selectedTeamId ? [selectedTeamId] : [])])]
      : selectedTeamId
        ? [selectedTeamId]
        : formData.teamIds;

    updateTask.mutate(
      {
        id: task.id,
        data: {
          title: formData.title,
          description: formData.description || undefined,
          status: formData.status,
          teamIds,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: TASKS_KEY });
          navigateToTasks();
        },
        onError: (err) => Alert.alert('Erro', err.message),
      },
    );
  };

  const defaultTeamId =
    teamId && task.teams.some((t) => t.id === teamId) ? teamId : task.teams[0]?.id;

  const handleDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        navigateToTasks();
      },
      onError: (err) => Alert.alert('Erro', err.message),
    });
  };

  return (
    <Screen padded={false}>
      <View className="flex-1 px-6">
        <ScreenHeader
          title="Editar tarefa"
          subtitle="crie seu time para gerenciar as tarefas"
          showBack
          onBack={navigateToTasks}
          icon={<IconCheckBadge />}
          rightAction={
            <Pressable
              onPress={handleDelete}
              className="p-2 active:opacity-70"
              hitSlop={8}
              disabled={deleteTask.isPending}
            >
              <IconTrash size={24} />
            </Pressable>
          }
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
          <EditTaskForm
            teams={teams}
            defaultValues={{
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              teamIds: defaultTeamId ? [defaultTeamId] : [],
            }}
            onSubmit={handleSubmit}
            formRef={submitRef}
          />
        </ScrollView>

        <ScreenFooter
          label="Salvar"
          onPress={() => submitRef.current?.()}
          disabled={updateTask.isPending}
        />
      </View>

    </Screen>
  );
}
