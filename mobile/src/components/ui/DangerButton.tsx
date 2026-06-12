import { Pressable, Text } from 'react-native';

interface DangerButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function DangerButton({ label, onPress, disabled }: DangerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="rounded-[6px] h-14 w-full flex-row items-center justify-center bg-[#3D2020] active:opacity-80"
    >
      <Text className="font-roboto-bold text-base text-[#EF4444] leading-6 text-center">
        {label}
      </Text>
    </Pressable>
  );
}
