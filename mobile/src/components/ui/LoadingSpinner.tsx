import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = true }: LoadingSpinnerProps) {
  return (
    <View className={`justify-center items-center ${fullScreen ? 'flex-1 bg-[#202024]' : 'py-12'}`}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text className="font-roboto text-base text-[#7C7C8A] mt-3">{message}</Text>
      ) : null}
    </View>
  );
}
