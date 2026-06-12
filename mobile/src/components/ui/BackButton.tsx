import { Pressable, View } from 'react-native';
import { IconChevron } from '../IconChevron';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable onPress={onPress} className="pb-2 self-start active:opacity-70">
      <View style={{ transform: [{ rotate: '180deg' }] }}>
        <IconChevron size={32} />
      </View>
    </Pressable>
  );
}
