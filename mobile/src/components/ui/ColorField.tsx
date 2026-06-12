import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ColorFieldProps {
  value: string;
  options: readonly string[];
  onChange: (color: string) => void;
  placeholder?: string;
}

const SWATCH_SIZE = 44;
const COLUMNS = 4;

export function ColorField({ value, options, onChange, placeholder }: ColorFieldProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSelect = (color: string) => {
    onChange(color);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="bg-[#29292E] rounded-[6px] h-14 w-full flex-row items-center justify-between px-4 active:opacity-80"
      >
        <Text className="font-roboto text-base text-[#7C7C8A] leading-4">
          {placeholder}
        </Text>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: value,
            borderWidth: 2,
            borderColor: '#FFFFFF33',
          }}
        />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1 bg-black/70 justify-end" onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="bg-[#202024] rounded-t-2xl px-6 pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
              <View className="w-10 h-1 rounded-full bg-[#7C7C8A] self-center mb-5 opacity-50" />

              <Text className="font-roboto-bold text-lg text-[#FFFFFF] leading-6 mb-1">
                Escolha uma cor
              </Text>
              <Text className="font-roboto text-sm text-[#7C7C8A] leading-5 mb-5">
                Toque em uma cor para o ícone do time
              </Text>

              <View className="bg-[#29292E] rounded-[8px] p-4 mb-5 flex-row items-center">
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: value,
                    borderWidth: 2,
                    borderColor: '#FFFFFF33',
                  }}
                />
                <View className="ml-4">
                  <Text className="font-roboto text-sm text-[#7C7C8A] leading-4">
                    Cor selecionada
                  </Text>
                </View>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 280 }}
                contentContainerClassName="pb-2"
              >
                <View className="flex-row flex-wrap">
                  {options.map((color) => {
                    const isSelected = value === color;

                    return (
                      <View
                        key={color}
                        style={{
                          width: `${100 / COLUMNS}%`,
                          alignItems: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Pressable
                          onPress={() => handleSelect(color)}
                          className="active:opacity-80"
                        >
                          <View
                            style={{
                              width: SWATCH_SIZE,
                              height: SWATCH_SIZE,
                              borderRadius: SWATCH_SIZE / 2,
                              backgroundColor: color,
                              borderWidth: isSelected ? 3 : 0,
                              borderColor: '#FFFFFF',
                              transform: [{ scale: isSelected ? 1.1 : 1 }],
                            }}
                          />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
