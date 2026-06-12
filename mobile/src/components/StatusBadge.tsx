import { Text, View } from 'react-native';
import { TaskStatus } from '../types';
import {
  STATUS_BG_DARK,
  STATUS_BADGE_SIZE_DARK,
  STATUS_COLORS,
  STATUS_LABELS,
  STATUS_LABELS_LOWERCASE,
} from '../utils/status';
import { FlagLabel } from './ui/FlagLabel';

interface StatusBadgeProps {
  status: TaskStatus;
  variant?: 'light' | 'dark';
}

export function StatusBadge({ status, variant = 'light' }: StatusBadgeProps) {
  if (variant === 'dark') {
    const size = STATUS_BADGE_SIZE_DARK[status];
    const backgroundColor = STATUS_BG_DARK[status];

    return (
      <View
        className="rounded-full items-center justify-center"
        style={{
          backgroundColor,
          height: size?.height ?? 19,
          width: size?.width,
          minWidth: size?.width,
          paddingHorizontal: size?.width ? 0 : 10,
        }}
      >
        <FlagLabel>{STATUS_LABELS_LOWERCASE[status]}</FlagLabel>
      </View>
    );
  }

  const colors = STATUS_COLORS[status];

  return (
    <View className={`rounded-full px-3 py-1 ${colors}`}>
      <Text className="text-xs font-medium">{STATUS_LABELS[status]}</Text>
    </View>
  );
}
