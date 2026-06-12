import { TextInput, TextInputProps } from 'react-native';
import { colors } from '../../theme/colors';

interface TextFieldProps extends TextInputProps {
  multiline?: boolean;
}

export function TextField({ multiline, className, ...props }: TextFieldProps) {
  return (
    <TextInput
      className={`rounded-[6px] px-4 font-roboto text-base text-[#E1E1E6] ${
        multiline ? 'py-3 min-h-[96px]' : 'h-14'
      } ${className ?? 'bg-[#121214]'}`}
      placeholderTextColor={colors.placeholder}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      {...props}
    />
  );
}
