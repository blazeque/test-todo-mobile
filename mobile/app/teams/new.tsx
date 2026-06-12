import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { IconUserOutlined } from '../../src/components/IconUserOutlined';
import { TeamForm } from '../../src/components/TeamForm';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';
import { Screen } from '../../src/components/ui/Screen';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { TEAMS_KEY, useCreateTeam } from '../../src/hooks/useTeams';
import { TeamFormData } from '../../src/schemas/team';

export default function NewTeamScreen() {
  const createTeam = useCreateTeam();
  const queryClient = useQueryClient();
  const submitRef = useRef<(() => void) | null>(null);

  const handleSubmit = (formData: TeamFormData) => {
    createTeam.mutate(
      {
        name: formData.name,
        colorHex: formData.colorHex,
        description: formData.description || undefined,
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: TEAMS_KEY });
          router.back();
        },
        onError: (err) => Alert.alert('Erro', err.message),
      },
    );
  };

  return (
    <Screen padded={false}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        <ScreenHeader
          title="Novo Time"
          subtitle="crie seu time para gerenciar as tarefas"
          showBack
          onBack={() => router.back()}
          icon={<IconUserOutlined size={56} color="#00B37E" />}
        />

        <TeamForm onSubmit={handleSubmit} formRef={submitRef} />

        <View className="mt-3">
          <PrimaryButton
            label="Criar"
            onPress={() => submitRef.current?.()}
            disabled={createTeam.isPending}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
