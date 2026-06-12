import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <Text className="font-roboto text-lg font-normal text-[#E1E1E6] text-center">{title}</Text>
      {subtitle ? (
        <Text className="font-roboto text-sm font-normal text-[#7C7C8A] text-center mt-2">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
