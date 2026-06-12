import { Pressable, Text } from 'react-native';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function SecondaryButton({ label, onPress, disabled }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="rounded-[6px] h-14 w-full flex-row items-center justify-center border border-[#29292E] bg-[#29292E] active:opacity-80"
    >
      <Text className="font-roboto-bold text-base text-[#E1E1E6] leading-6 text-center">
        {label}
      </Text>
    </Pressable>
  );
}
