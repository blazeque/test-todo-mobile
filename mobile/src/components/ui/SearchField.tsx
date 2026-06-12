import { TextInput, View } from 'react-native';
import { IconZoom } from '../IconZoom';
import { colors } from '../../theme/colors';

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Busque um time',
}: SearchFieldProps) {
  return (
    <View className="bg-[#121214] rounded-[6px] h-14 w-full flex-row items-center gap-2 px-4 mb-5">
      <TextInput
        className="flex-1 font-roboto text-base text-[#E1E1E6] outline-none border-0 bg-transparent"
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        style={{ outlineStyle: 'none', outlineWidth: 0 }}
      />
      <IconZoom size={20} color={colors.primary} />
    </View>
  );
}
