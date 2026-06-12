import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  EditTaskForm,
  NEW_TASK_PLACEHOLDERS,
} from '../../src/components/EditTaskForm';
import { ErrorView } from '../../src/components/ErrorView';
import { IconCheckBadge } from '../../src/components/IconCheckBadge';
import { LoadingView } from '../../src/components/LoadingView';
import { Screen } from '../../src/components/ui/Screen';
import { ScreenFooter } from '../../src/components/ui/ScreenFooter';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { useCreateTask, TASKS_KEY } from '../../src/hooks/useTasks';
import { useTeams } from '../../src/hooks/useTeams';
import { TaskFormData } from '../../src/schemas/task';

export default function NewTaskScreen() {
  const { teamId } = useLocalSearchParams<{ teamId?: string }>();
  const { data: teamsData, isLoading, error, refetch } = useTeams();
  const createTask = useCreateTask();
  const queryClient = useQueryClient();
  const submitRef = useRef<(() => void) | null>(null);

  if (isLoading) {
    return (
      <Screen padded={false}>
        <LoadingView />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ErrorView message={error.message} onRetry={() => refetch()} />
      </Screen>
    );
  }

  const teams = teamsData?.data ?? [];

  const handleSubmit = (formData: TaskFormData) => {
    const selectedTeamId = formData.teamIds[0] ?? teamId;
    const teamIds = teamId
      ? [...new Set([teamId, ...(selectedTeamId ? [selectedTeamId] : [])])]
      : selectedTeamId
        ? [selectedTeamId]
        : formData.teamIds;

    createTask.mutate(
      {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        teamIds,
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: TASKS_KEY });
          router.back();
        },
        onError: (err) => Alert.alert('Erro', err.message),
      },
    );
  };

  return (
    <Screen padded={false}>
      <View className="flex-1 px-6">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-4">
          <ScreenHeader
            title="Nova tarefa"
            subtitle="crie seu time para gerenciar as tarefas"
            showBack
            onBack={() => router.back()}
            icon={<IconCheckBadge />}
          />

          <EditTaskForm
            teams={teams}
            defaultValues={teamId ? { teamIds: [teamId] } : undefined}
            onSubmit={handleSubmit}
            formRef={submitRef}
            placeholders={NEW_TASK_PLACEHOLDERS}
          />
        </ScrollView>

        <ScreenFooter
          label="Criar"
          onPress={() => submitRef.current?.()}
          disabled={createTask.isPending}
        />
      </View>
    </Screen>
  );
}
