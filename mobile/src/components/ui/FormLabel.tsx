import { Text } from 'react-native';

interface FormLabelProps {
  children: string;
}

export function FormLabel({ children }: FormLabelProps) {
  return (
    <Text className="font-roboto text-sm font-normal text-[#7C7C8A] mb-1">{children}</Text>
  );
}
