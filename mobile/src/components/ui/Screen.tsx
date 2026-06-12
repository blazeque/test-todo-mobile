import { View } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  edges?: Edge[];
  padded?: boolean;
}

export function Screen({ children, edges = ['top', 'bottom'], padded = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#202024]" edges={edges}>
      <View className={`flex-1 ${padded ? 'px-6' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
