import { Redirect, useLocalSearchParams } from 'expo-router';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={`/tasks/edit/${id}`} />;
}
