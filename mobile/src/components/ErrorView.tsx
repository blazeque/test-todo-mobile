import { Pressable, Text, View } from 'react-native';
import { PrimaryButton } from './ui/PrimaryButton';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center bg-[#202024] px-6">
      <Text className="font-roboto text-base text-[#EF4444] text-center mb-6">{message}</Text>
      {onRetry ? (
        <View className="w-full">
          <PrimaryButton label="Tentar novamente" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
