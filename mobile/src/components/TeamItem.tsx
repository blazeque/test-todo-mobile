import { Pressable, Text } from 'react-native';
import { IconChevron } from './IconChevron';
import { IconUser } from './IconUser';
import { Team } from '../types';

interface TeamItemProps {
  team: Team;
  onPress: () => void;
}

export function TeamItem({ team, onPress }: TeamItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-[#29292E] rounded-2xl h-24 w-full flex-row items-center gap-3 px-4 mb-3 active:opacity-80"
    >
      <IconUser size={32} color={team.colorHex} />
      <Text className="flex-1 font-roboto text-lg font-normal text-[#E1E1E6] leading-[28.8px]">
        {team.name}
      </Text>
      <IconChevron size={24} />
    </Pressable>
  );
}
