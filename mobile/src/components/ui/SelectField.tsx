import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { IconChevron } from '../IconChevron';
import { colors } from '../../theme/colors';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SelectField({ value, options, onChange, placeholder }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="bg-[#29292E] rounded-[6px] h-14 w-full flex-row items-center justify-between px-4 mb-3 active:opacity-80"
      >
        <Text
          className={
            selected
              ? 'font-roboto-bold text-base text-[#FFFFFF] leading-4'
              : 'font-roboto text-base text-[#7C7C8A] leading-4'
          }
        >
          {selected?.label ?? placeholder}
        </Text>
        <View style={{ transform: [{ rotate: '90deg' }] }}>
          <IconChevron size={20} color={colors.textPrimary} />
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/60 justify-end" onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-[#29292E] rounded-t-2xl px-4 py-4 max-h-80">
              <ScrollView>
                {options.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="py-4 border-b border-[#121214] active:opacity-70"
                  >
                    <Text
                      className={`font-roboto-bold text-base leading-4 ${
                        option.value === value ? 'text-[#00875F]' : 'text-[#FFFFFF]'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
