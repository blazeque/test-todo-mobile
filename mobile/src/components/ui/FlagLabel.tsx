import { Text, TextProps } from 'react-native';

export function FlagLabel({ children, className, ...props }: TextProps) {
  return (
    <Text
      className={`font-roboto-bold text-[10px] text-[#FFFFFF] leading-[10px] text-center ${className ?? ''}`}
      style={{ letterSpacing: 0 }}
      {...props}
    >
      {children}
    </Text>
  );
}
