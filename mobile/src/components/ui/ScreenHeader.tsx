import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { BackButton } from './BackButton';

const HEADER_BACK_TOP = 32;
const HEADER_TITLE_TOP = 144;

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  icon?: ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  onBack,
  rightAction,
  icon,
}: ScreenHeaderProps) {
  return (
    <View style={{ position: 'relative' }}>
      {showBack && onBack ? (
        <View
          style={{
            position: 'absolute',
            top: HEADER_BACK_TOP,
            left: 0,
            zIndex: 10,
          }}
        >
          <BackButton onPress={onBack} />
        </View>
      ) : null}

      {rightAction ? (
        <View
          style={{
            position: 'absolute',
            top: HEADER_BACK_TOP,
            right: 0,
            zIndex: 20,
            elevation: 20,
          }}
        >
          {rightAction}
        </View>
      ) : null}

      <View style={{ marginTop: HEADER_TITLE_TOP }} className="items-center pb-6">
        {icon ? <View className="mb-4">{icon}</View> : null}
        <Text className="font-roboto-bold text-2xl text-[#FFFFFF] leading-6 text-center mb-2">
          {title}
        </Text>
        {subtitle ? (
          <Text className="font-roboto text-base font-normal text-[#7C7C8A] leading-[25.6px] text-center">
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
