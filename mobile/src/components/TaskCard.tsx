import { Pressable, Text, View } from 'react-native';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  teamName?: string;
}

export function TaskCard({ task, onPress, teamName }: TaskCardProps) {
  const displayTeamName = teamName ?? task.teams[0]?.name;

  return (
    <Pressable
      onPress={onPress}
      className="bg-[#29292E] rounded-[8px] h-[144px] w-full p-4 mb-3 active:opacity-80 overflow-hidden"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="font-roboto-bold text-base text-[#FFFFFF] leading-4">
            {task.title}
          </Text>
          {displayTeamName ? (
            <Text className="font-roboto text-[10px] font-normal text-[#FFFFFF] leading-[10px] mt-1">
              {displayTeamName}
            </Text>
          ) : null}
        </View>
        <StatusBadge status={task.status} variant="dark" />
      </View>
      {task.description ? (
        <Text
          className="font-roboto text-sm font-normal text-[#FFFFFF] leading-[14px] mt-3 flex-1"
          numberOfLines={3}
        >
          {task.description}
        </Text>
      ) : null}
    </Pressable>
  );
}
