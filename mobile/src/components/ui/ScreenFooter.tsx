import { View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface ScreenFooterProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ScreenFooter({ label, onPress, disabled }: ScreenFooterProps) {
  return (
    <View className="pb-[40px] pt-4">
      <PrimaryButton label={label} onPress={onPress} disabled={disabled} />
    </View>
  );
}
