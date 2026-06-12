import { Text, View } from 'react-native';

interface TeamChipProps {
  name: string;
  colorHex: string;
}

export function TeamChip({ name, colorHex }: TeamChipProps) {
  return (
    <View
      className="rounded-full px-2 py-0.5 mr-1 mb-1"
      style={{ backgroundColor: colorHex + '33' }}
    >
      <Text className="text-xs font-medium" style={{ color: colorHex }}>
        {name}
      </Text>
    </View>
  );
}
