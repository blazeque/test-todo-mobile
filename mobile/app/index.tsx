import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ErrorView } from '../src/components/ErrorView';
import { TeamItem } from '../src/components/TeamItem';
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner';
import { Screen } from '../src/components/ui/Screen';
import { ScreenFooter } from '../src/components/ui/ScreenFooter';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { SearchField } from '../src/components/ui/SearchField';
import { useTeams } from '../src/hooks/useTeams';

export default function TeamsScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch } = useTeams(debouncedSearch || undefined);

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

  const teams = data?.data ?? [];
  const isInitialLoading = isLoading && !data;
  const showSearch = search.length > 0 || teams.length > 0;

  return (
    <Screen>
      <ScreenHeader
        title="Times"
        subtitle="Acesse um dos times"
      />

      {isInitialLoading ? (
        <LoadingSpinner fullScreen={false} />
      ) : (
        <>
          {showSearch ? (
            <SearchField value={search} onChangeText={setSearch} />
          ) : null}

          {teams.length > 0 ? (
            <FlatList
              data={teams}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerClassName="pb-4 flex-grow"
              renderItem={({ item }) => (
                <TeamItem
                  team={item}
                  onPress={() =>
                    router.push({
                      pathname: '/tasks',
                      params: { teamId: item.id, teamName: item.name },
                    })
                  }
                />
              )}
            />
          ) : showSearch ? (
            <Text className="font-roboto text-base text-[#7C7C8A] text-center mt-8">
              Nenhum time encontrado para &quot;{search}&quot;
            </Text>
          ) : (
            <View className="flex-1" />
          )}
        </>
      )}

      <ScreenFooter label="Criar time" onPress={() => router.push('/teams/new')} />
    </Screen>
  );
}
