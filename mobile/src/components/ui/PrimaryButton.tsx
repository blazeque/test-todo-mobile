import { Pressable, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-[6px] h-14 w-full flex-row items-center justify-center gap-2.5 px-6 py-4 active:opacity-90 ${
        disabled ? 'bg-[#00875F]/50' : 'bg-[#00875F]'
      }`}
    >
      <Text className="font-roboto-bold text-base text-[#FFFFFF] leading-6 text-center">
        {label}
      </Text>
    </Pressable>
  );
}
